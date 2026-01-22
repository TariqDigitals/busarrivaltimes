import { Star, ChevronRight, Bell } from 'lucide-react';
import type { BusStop } from '../types';

interface BusStopCardProps {
  stop: BusStop;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onSetAlarm?: () => void;
  distance?: number;
  walkingTime?: number;
}

export function BusStopCard({
  stop,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onSetAlarm,
  distance,
  walkingTime,
}: BusStopCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-slate-700">
      <div className="flex items-center">
        <button
          onClick={onSelect}
          className="flex-1 p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors min-w-0"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-teal-100 dark:bg-cyan-900/50 text-teal-700 dark:text-cyan-300 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-mono font-bold shadow-sm flex-shrink-0">
              {stop.code}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base break-words line-clamp-2">{stop.name}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">{stop.road}</p>
              {distance !== undefined && walkingTime !== undefined && (
                <p className="text-teal-600 dark:text-cyan-400 text-xs mt-1.5 font-medium truncate">
                  {distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`} · {walkingTime} min walk
                </p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          </div>
        </button>
        {onSetAlarm && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetAlarm();
            }}
            className="p-3 sm:p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-l border-gray-200 dark:border-slate-700 flex-shrink-0"
            aria-label="Set alarm for this stop"
            title="Set alarm"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400 hover:scale-110 transition-transform" />
          </button>
        )}
        <button
          onClick={onToggleFavorite}
          className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-l border-gray-200 dark:border-slate-700 flex-shrink-0"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
              isFavorite
                ? 'fill-amber-400 text-amber-400 scale-110'
                : 'text-gray-300 dark:text-gray-600 hover:text-amber-400 hover:scale-110'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
