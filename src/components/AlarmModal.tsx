import { useState, useEffect } from 'react';
import { X, Clock, MapPin, Calendar, Bell } from 'lucide-react';
import { UserAlarm, AlarmSchedule, ScheduleType, AlarmTemplate } from '../types';
import { BusStop } from '../types';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    alarm: Omit<UserAlarm, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
    schedule: Omit<AlarmSchedule, 'id' | 'alarm_id' | 'created_at'>
  ) => Promise<void>;
  editAlarm?: UserAlarm;
  busStop?: BusStop;
  templates?: AlarmTemplate[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const NOTIFICATION_OPTIONS = [5, 10, 15, 20, 30];

export const AlarmModal = ({ isOpen, onClose, onSave, editAlarm, busStop, templates = [] }: AlarmModalProps) => {
  const [alarmName, setAlarmName] = useState('');
  const [busStopCode, setBusStopCode] = useState('');
  const [busStopName, setBusStopName] = useState('');
  const [serviceNo, setServiceNo] = useState('');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('daily');
  const [triggerTime, setTriggerTime] = useState('08:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [notificationMinutes, setNotificationMinutes] = useState<number[]>([10]);
  const [isRecurring, setIsRecurring] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editAlarm) {
      setAlarmName(editAlarm.alarm_name);
      setBusStopCode(editAlarm.bus_stop_code);
      setBusStopName(editAlarm.bus_stop_name);
      setServiceNo(editAlarm.service_no || '');
      setNotificationMinutes(editAlarm.notification_minutes);
      setIsRecurring(editAlarm.is_recurring);

      if (editAlarm.schedules && editAlarm.schedules[0]) {
        const schedule = editAlarm.schedules[0];
        setScheduleType(schedule.schedule_type);
        setTriggerTime(schedule.trigger_time.substring(0, 5));
        if (schedule.days_of_week) {
          setSelectedDays(schedule.days_of_week);
        }
      }
    } else if (busStop) {
      setBusStopCode(busStop.code);
      setBusStopName(busStop.name);
      setAlarmName(`${busStop.name} Alarm`);
    }
  }, [editAlarm, busStop]);

  const handleTemplateSelect = (template: AlarmTemplate) => {
    setScheduleType(template.default_schedule_type);
    setNotificationMinutes(template.default_notification_minutes);
    if (template.default_days_of_week) {
      setSelectedDays(template.default_days_of_week);
    }
    if (template.default_schedule_type !== 'once') {
      setIsRecurring(true);
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const toggleNotificationMinute = (minute: number) => {
    setNotificationMinutes(prev =>
      prev.includes(minute)
        ? prev.filter(m => m !== minute)
        : [...prev, minute].sort((a, b) => b - a)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alarmName || !busStopCode || !busStopName || notificationMinutes.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    if (scheduleType === 'custom' && selectedDays.length === 0) {
      alert('Please select at least one day');
      return;
    }

    setSaving(true);
    try {
      await onSave(
        {
          alarm_name: alarmName,
          bus_stop_code: busStopCode,
          bus_stop_name: busStopName,
          service_no: serviceNo || undefined,
          notification_minutes: notificationMinutes,
          is_enabled: true,
          is_recurring: isRecurring
        },
        {
          schedule_type: scheduleType,
          trigger_time: `${triggerTime}:00`,
          days_of_week: scheduleType === 'custom' ? selectedDays : undefined
        }
      );
      onClose();
    } catch (error) {
      alert('Failed to save alarm');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editAlarm ? 'Edit Alarm' : 'Create New Alarm'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {templates.length > 0 && !editAlarm && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Templates
              </label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map(template => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateSelect(template)}
                    className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="font-medium text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Alarm Name *
            </label>
            <input
              type="text"
              value={alarmName}
              onChange={(e) => setAlarmName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Morning Commute"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Bus Stop Code *
            </label>
            <input
              type="text"
              value={busStopCode}
              onChange={(e) => setBusStopCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 83139"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus Stop Name *
            </label>
            <input
              type="text"
              value={busStopName}
              onChange={(e) => setBusStopName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Opp Blk 123"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus Service Number (Optional)
            </label>
            <input
              type="text"
              value={serviceNo}
              onChange={(e) => setServiceNo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 174"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to track all buses at this stop</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Trigger Time *
            </label>
            <input
              type="time"
              value={triggerTime}
              onChange={(e) => setTriggerTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Schedule Type
            </label>
            <select
              value={scheduleType}
              onChange={(e) => {
                setScheduleType(e.target.value as ScheduleType);
                setIsRecurring(e.target.value !== 'once');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="once">One Time</option>
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays (Mon-Fri)</option>
              <option value="weekends">Weekends (Sat-Sun)</option>
              <option value="custom">Custom Days</option>
            </select>
          </div>

          {scheduleType === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Days
              </label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(index)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedDays.includes(index)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bell className="inline w-4 h-4 mr-1" />
              Notify Me (Minutes Before Arrival) *
            </label>
            <div className="flex gap-2 flex-wrap">
              {NOTIFICATION_OPTIONS.map(minute => (
                <button
                  key={minute}
                  type="button"
                  onClick={() => toggleNotificationMinute(minute)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    notificationMinutes.includes(minute)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {minute} min
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">You can select multiple notification times</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : editAlarm ? 'Update Alarm' : 'Create Alarm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
