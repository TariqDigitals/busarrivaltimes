import { UserAlarm } from '../types';
import { NotificationService } from './notificationService';
import { fetchBusArrivals } from '../services/api';

export class AlarmChecker {
  private static checkInterval: number | null = null;
  private static notifiedAlarms = new Set<string>();

  static startChecking(alarms: UserAlarm[]): void {
    if (this.checkInterval) {
      this.stopChecking();
    }

    this.checkInterval = window.setInterval(() => {
      this.checkAlarms(alarms);
    }, 30000);

    this.checkAlarms(alarms);
  }

  static stopChecking(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private static async checkAlarms(alarms: UserAlarm[]): Promise<void> {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay();

    for (const alarm of alarms) {
      if (!alarm.is_enabled || !alarm.schedules || alarm.schedules.length === 0) {
        continue;
      }

      const schedule = alarm.schedules[0];
      const scheduleTime = schedule.trigger_time.substring(0, 5);

      let shouldTrigger = false;

      if (schedule.schedule_type === 'once') {
        shouldTrigger = scheduleTime === currentTime;
      } else if (schedule.schedule_type === 'daily') {
        shouldTrigger = scheduleTime === currentTime;
      } else if (schedule.schedule_type === 'weekdays') {
        shouldTrigger = scheduleTime === currentTime && currentDay >= 1 && currentDay <= 5;
      } else if (schedule.schedule_type === 'weekends') {
        shouldTrigger = scheduleTime === currentTime && (currentDay === 0 || currentDay === 6);
      } else if (schedule.schedule_type === 'custom' && schedule.days_of_week) {
        shouldTrigger = scheduleTime === currentTime && schedule.days_of_week.includes(currentDay);
      }

      if (shouldTrigger && !this.notifiedAlarms.has(`${alarm.id}-${currentTime}`)) {
        await this.triggerAlarm(alarm);
        this.notifiedAlarms.add(`${alarm.id}-${currentTime}`);

        setTimeout(() => {
          this.notifiedAlarms.delete(`${alarm.id}-${currentTime}`);
        }, 120000);
      }
    }
  }

  private static async triggerAlarm(alarm: UserAlarm): Promise<void> {
    try {
      const arrivals = await fetchBusArrivals(alarm.bus_stop_code);

      const services = arrivals.services || [];
      let relevantService = services.find(s =>
        !alarm.service_no || s.no === alarm.service_no
      );

      if (!relevantService && alarm.service_no) {
        relevantService = services[0];
      }

      if (relevantService?.next) {
        const arrivalMinutes = Math.floor(relevantService.next.duration_ms / 60000);

        for (const notifyBefore of alarm.notification_minutes.sort((a, b) => b - a)) {
          if (arrivalMinutes <= notifyBefore) {
            const serviceName = alarm.service_no || 'your bus';
            const title = `${alarm.alarm_name}`;
            const body = `Bus ${serviceName} arriving at ${alarm.bus_stop_name} in ${arrivalMinutes} minutes`;

            await NotificationService.sendNotification(
              title,
              {
                body,
                tag: alarm.id,
                requireInteraction: true
              },
              alarm.id
            );

            await NotificationService.logNotification(
              alarm.id,
              'scheduled',
              true,
              relevantService.next.time
            );
            break;
          }
        }
      }
    } catch (error) {
      console.error('Failed to trigger alarm:', error);
      await NotificationService.logNotification(alarm.id, 'scheduled', false);
    }
  }

  static clearNotifiedCache(): void {
    this.notifiedAlarms.clear();
  }
}
