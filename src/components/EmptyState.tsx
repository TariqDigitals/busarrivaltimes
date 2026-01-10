import { Bus, MapPin, Star, Search, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'nearby' | 'favorites' | 'arrivals' | 'error';
  message?: string;
  onRetry?: () => void;
}

const icons = {
  search: Search,
  nearby: MapPin,
  favorites: Star,
  arrivals: Bus,
  error: AlertCircle,
};

const defaults = {
  search: 'Search for a bus stop by code or name',
  nearby: 'No bus stops found within 500m',
  favorites: 'No favorite stops yet',
  arrivals: 'No bus services at this stop',
  error: 'Something went wrong',
};

export function EmptyState({ type, message, onRetry }: EmptyStateProps) {
  const Icon = icons[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl mb-4">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{message || defaults[type]}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-teal-500 dark:bg-cyan-600 text-white rounded-xl font-medium hover:bg-teal-600 dark:hover:bg-cyan-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
