import { useState, useEffect } from 'react';
import { Plus, Bell, BellOff, Calendar, AlarmClock } from 'lucide-react';
import { AlarmCard } from '../components/AlarmCard';
import { AlarmModal } from '../components/AlarmModal';
import { LoadIndicator } from '../components/LoadIndicator';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAlarms } from '../hooks/useAlarms';
import { useAlarmTemplates } from '../hooks/useAlarmTemplates';
import { useTheme } from '../hooks/useTheme';
import { NotificationService } from '../utils/notificationService';
import { AlarmChecker } from '../utils/alarmChecker';
import { UserAlarm } from '../types';

export const AlarmsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { alarms, loading, createAlarm, updateAlarm, deleteAlarm, toggleAlarm, refetch } = useAlarms();
  const { templates } = useAlarmTemplates();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<UserAlarm | undefined>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const hasPermission = await NotificationService.requestPermission();
      setNotificationsEnabled(hasPermission);
    };
    checkPermission();
  }, []);

  useEffect(() => {
    if (alarms.length > 0 && notificationsEnabled) {
      AlarmChecker.startChecking(alarms);
    }

    return () => {
      AlarmChecker.stopChecking();
    };
  }, [alarms, notificationsEnabled]);

  const handleCreateAlarm = () => {
    setEditingAlarm(undefined);
    setIsModalOpen(true);
  };

  const handleEditAlarm = (alarm: UserAlarm) => {
    setEditingAlarm(alarm);
    setIsModalOpen(true);
  };

  const handleSaveAlarm = async (alarmData: any, scheduleData: any) => {
    if (editingAlarm) {
      await updateAlarm(editingAlarm.id, alarmData, scheduleData);
    } else {
      await createAlarm(alarmData, scheduleData);
    }
    setIsModalOpen(false);
    setEditingAlarm(undefined);
  };

  const handleDeleteAlarm = async (id: string) => {
    await deleteAlarm(id);
  };

  const handleToggleAlarm = async (id: string, enabled: boolean) => {
    await toggleAlarm(id, enabled);
  };

  const requestNotificationPermission = async () => {
    const granted = await NotificationService.requestPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      await NotificationService.sendNotification(
        'Notifications Enabled!',
        { body: 'You will now receive bus arrival alerts' }
      );
    } else {
      alert('Please enable notifications in your browser settings to receive alarms.');
    }
  };

  const activeAlarms = alarms.filter(a => a.is_enabled).length;
  const totalAlarms = alarms.length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Alarms</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your bus arrival notifications</p>
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Alarms</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalAlarms}</p>
                </div>
                <Calendar className="text-blue-500" size={32} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Active Alarms</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeAlarms}</p>
                </div>
                <Bell className="text-green-500" size={32} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Notifications</p>
                  <p className={`text-lg font-bold ${notificationsEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                {notificationsEnabled ? (
                  <Bell className="text-purple-500" size={32} />
                ) : (
                  <BellOff className="text-red-500" size={32} />
                )}
              </div>
            </div>
          </div>

          {!notificationsEnabled && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400 dark:border-orange-600 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <BellOff className="text-orange-500 dark:text-orange-400 mt-1" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-1">Notifications Disabled</h3>
                  <p className="text-orange-800 dark:text-orange-400 text-sm mb-3">
                    Enable browser notifications to receive bus arrival alerts.
                  </p>
                  <button
                    onClick={requestNotificationPermission}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Enable Notifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadIndicator />
          </div>
        ) : alarms.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full mb-6">
              <Bell size={48} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Alarms Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Create your first alarm to get notified when your bus is arriving. Never miss your ride again!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Click the floating button at the bottom right to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alarms.map(alarm => (
              <AlarmCard
                key={alarm.id}
                alarm={alarm}
                onToggle={handleToggleAlarm}
                onEdit={handleEditAlarm}
                onDelete={handleDeleteAlarm}
              />
            ))}
          </div>
        )}
      </div>

        <AlarmModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAlarm(undefined);
          }}
          onSave={handleSaveAlarm}
          editAlarm={editingAlarm}
          templates={templates}
        />

        <button
          onClick={handleCreateAlarm}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-600 dark:to-cyan-600 text-white rounded-full hover:from-teal-600 hover:to-cyan-600 dark:hover:from-teal-700 dark:hover:to-cyan-700 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 font-semibold"
          aria-label="Add new alarm"
        >
          <AlarmClock size={24} className="animate-pulse" />
          <span className="hidden sm:inline">Add Alarm</span>
        </button>
      </div>

      <Footer />
    </div>
  );
};
