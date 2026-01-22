import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { UserAlarm, AlarmSchedule } from '../types';

export const useAlarms = () => {
  const [alarms, setAlarms] = useState<UserAlarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlarms = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: alarmsData, error: alarmsError } = await supabase
        .from('user_alarms')
        .select('*')
        .order('created_at', { ascending: false });

      if (alarmsError) throw alarmsError;

      const alarmsWithSchedules = await Promise.all(
        (alarmsData || []).map(async (alarm) => {
          const { data: schedules } = await supabase
            .from('alarm_schedules')
            .select('*')
            .eq('alarm_id', alarm.id);

          return {
            ...alarm,
            schedules: schedules || []
          };
        })
      );

      setAlarms(alarmsWithSchedules);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alarms');
    } finally {
      setLoading(false);
    }
  };

  const createAlarm = async (
    alarm: Omit<UserAlarm, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
    schedule: Omit<AlarmSchedule, 'id' | 'alarm_id' | 'created_at'>
  ) => {
    try {
      const { data: newAlarm, error: alarmError } = await supabase
        .from('user_alarms')
        .insert({
          bus_stop_code: alarm.bus_stop_code,
          bus_stop_name: alarm.bus_stop_name,
          service_no: alarm.service_no,
          alarm_name: alarm.alarm_name,
          notification_minutes: alarm.notification_minutes,
          is_enabled: alarm.is_enabled,
          is_recurring: alarm.is_recurring
        })
        .select()
        .single();

      if (alarmError) throw alarmError;

      const { error: scheduleError } = await supabase
        .from('alarm_schedules')
        .insert({
          alarm_id: newAlarm.id,
          schedule_type: schedule.schedule_type,
          trigger_time: schedule.trigger_time,
          days_of_week: schedule.days_of_week,
          specific_dates: schedule.specific_dates,
          start_date: schedule.start_date,
          end_date: schedule.end_date
        });

      if (scheduleError) throw scheduleError;

      await fetchAlarms();
      return newAlarm;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create alarm');
    }
  };

  const updateAlarm = async (
    alarmId: string,
    updates: Partial<Omit<UserAlarm, 'id' | 'created_at' | 'user_id'>>,
    scheduleUpdates?: Partial<Omit<AlarmSchedule, 'id' | 'alarm_id' | 'created_at'>>
  ) => {
    try {
      const { error: alarmError } = await supabase
        .from('user_alarms')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', alarmId);

      if (alarmError) throw alarmError;

      if (scheduleUpdates) {
        const { data: existingSchedule } = await supabase
          .from('alarm_schedules')
          .select('id')
          .eq('alarm_id', alarmId)
          .single();

        if (existingSchedule) {
          const { error: scheduleError } = await supabase
            .from('alarm_schedules')
            .update(scheduleUpdates)
            .eq('alarm_id', alarmId);

          if (scheduleError) throw scheduleError;
        }
      }

      await fetchAlarms();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update alarm');
    }
  };

  const deleteAlarm = async (alarmId: string) => {
    try {
      const { error } = await supabase
        .from('user_alarms')
        .delete()
        .eq('id', alarmId);

      if (error) throw error;

      await fetchAlarms();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete alarm');
    }
  };

  const toggleAlarm = async (alarmId: string, isEnabled: boolean) => {
    await updateAlarm(alarmId, { is_enabled: isEnabled });
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  return {
    alarms,
    loading,
    error,
    refetch: fetchAlarms,
    createAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm
  };
};
