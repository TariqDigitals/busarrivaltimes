import { supabase } from './supabaseClient';

export class NotificationService {
  private static hasPermission = false;

  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    }

    return false;
  }

  static async sendNotification(
    title: string,
    options?: NotificationOptions,
    alarmId?: string
  ): Promise<void> {
    if (!this.hasPermission && !(await this.requestPermission())) {
      console.warn('Notification permission denied');
      return;
    }

    const notification = new Notification(title, {
      icon: '/manifest.json',
      badge: '/manifest.json',
      vibrate: [200, 100, 200],
      ...options
    });

    notification.onclick = () => {
      window.focus();
      if (alarmId) {
        window.location.href = `/alarms`;
      }
      notification.close();
    };

    if (alarmId) {
      await this.logNotification(alarmId, 'scheduled', true);
    }
  }

  static async logNotification(
    alarmId: string,
    notificationType: 'scheduled' | 'manual' | 'snoozed',
    wasSuccessful: boolean,
    busArrivalTime?: string
  ): Promise<void> {
    try {
      await supabase.from('alarm_history').insert({
        alarm_id: alarmId,
        notification_type: notificationType,
        was_successful: wasSuccessful,
        bus_arrival_time: busArrivalTime
      });
    } catch (error) {
      console.error('Failed to log notification:', error);
    }
  }

  static getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  static isSupported(): boolean {
    return 'Notification' in window;
  }
}
