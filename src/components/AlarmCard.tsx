import { Clock, MapPin, Bell, Calendar, Edit2, Trash2, Power } from 'lucide-react';
import { UserAlarm } from '../types';

interface AlarmCardProps {
  alarm: UserAlarm;
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (alarm: UserAlarm) => void;
  onDelete: (id: string) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AlarmCard = ({ alarm, onToggle, onEdit, onDelete }: AlarmCardProps) => {
  const schedule = alarm.schedules?.[0];

  const getScheduleText = () => {
    if (!schedule) return 'No schedule';

    switch (schedule.schedule_type) {
      case 'once':
        return 'One time';
      case 'daily':
        return 'Every day';
      case 'weekdays':
        return 'Weekdays (Mon-Fri)';
      case 'weekends':
        return 'Weekends (Sat-Sun)';
      case 'custom':
        if (schedule.days_of_week && schedule.days_of_week.length > 0) {
          return schedule.days_of_week.map(d => DAYS[d]).join(', ');
        }
        return 'Custom days';
      default:
        return schedule.schedule_type;
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${alarm.alarm_name}"?`)) {
      onDelete(alarm.id);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-2 ${
        alarm.is_enabled ? 'border-green-200 dark:border-green-700' : 'border-gray-200 dark:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{alarm.alarm_name}</h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm gap-1 mb-1">
            <MapPin size={14} />
            <span>{alarm.bus_stop_name}</span>
            <span className="text-gray-400 dark:text-gray-500">({alarm.bus_stop_code})</span>
          </div>
          {alarm.service_no && (
            <div className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-semibold">
              Bus {alarm.service_no}
            </div>
          )}
        </div>

        <button
          onClick={() => onToggle(alarm.id, !alarm.is_enabled)}
          className={`p-2 rounded-lg transition-all ${
            alarm.is_enabled
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600'
          }`}
          title={alarm.is_enabled ? 'Disable alarm' : 'Enable alarm'}
        >
          <Power size={20} />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Clock size={16} className="text-blue-500 dark:text-blue-400" />
          <span className="font-semibold">{schedule?.trigger_time?.substring(0, 5) || '--:--'}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Calendar size={16} className="text-purple-500 dark:text-purple-400" />
          <span className="text-sm">{getScheduleText()}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Bell size={16} className="text-orange-500 dark:text-orange-400" />
          <span className="text-sm">
            {alarm.notification_minutes.sort((a, b) => b - a).join(', ')} min before
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={() => onEdit(alarm)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      {!alarm.is_enabled && (
        <div className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 italic">
          This alarm is currently disabled
        </div>
      )}
    </div>
  );
};
