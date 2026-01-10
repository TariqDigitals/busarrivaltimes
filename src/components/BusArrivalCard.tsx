import { Accessibility, Bus as BusIcon } from 'lucide-react';
import type { BusService, BusArrival } from '../types';
import { formatArrivalTime, getLoadColor, getBusTypeLabel } from '../utils/helpers';
import { useEffect, useState } from 'react';

interface BusArrivalCardProps {
  service: BusService;
}

function ArrivalBadge({ arrival, label }: { arrival: BusArrival | null; label: string }) {
  const [timeLeft, setTimeLeft] = useState<number>(arrival?.duration_ms || 0);

  useEffect(() => {
    if (!arrival?.time) return;

    const targetTime = new Date(arrival.time).getTime();

    function updateTime() {
      const now = Date.now();
      const remaining = targetTime - now;
      setTimeLeft(Math.max(0, remaining));
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [arrival?.time]);

  if (!arrival || !arrival.time) {
    return (
      <div className="text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
        <div className="bg-gray-100 dark:bg-slate-700 rounded-xl px-3 py-2">
          <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
        </div>
      </div>
    );
  }

  const isArriving = timeLeft <= 60000;
  const loadInfo = getLoadColor(arrival.load);

  return (
    <div className="text-center">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{label}</p>
      <div
        className={`rounded-xl px-3 py-2.5 min-h-[48px] flex items-center justify-center ${
          isArriving
            ? 'bg-teal-500 dark:bg-cyan-500 shadow-md'
            : 'bg-gray-100 dark:bg-slate-700'
        }`}
      >
        <span
          className={`font-bold text-lg ${
            isArriving ? 'text-white' : 'text-gray-800 dark:text-white'
          }`}
        >
          {formatArrivalTime(timeLeft)}
        </span>
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <div className={`w-2.5 h-2.5 rounded-full ${loadInfo.bg} shadow-sm`} title={loadInfo.label} />
        {arrival.feature === 'WAB' && (
          <span title="Wheelchair Accessible">
            <Accessibility className="w-3.5 h-3.5 text-blue-500" />
          </span>
        )}
        {arrival.type === 'DD' && (
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-slate-600 px-1.5 py-0.5 rounded" title="Double Decker">
            DD
          </span>
        )}
      </div>
    </div>
  );
}

export function BusArrivalCard({ service }: BusArrivalCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-5 hover:shadow-xl transition-all border border-gray-100 dark:border-slate-700 scale-in">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white px-5 py-3 rounded-xl min-w-[80px] text-center shadow-lg">
            <span className="font-bold text-2xl">{service.no}</span>
          </div>
          <div className="text-gray-400 dark:text-gray-500">
            <BusIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-3">
          <ArrivalBadge arrival={service.next || null} label="Next" />
          <ArrivalBadge arrival={service.next2 || service.subsequent || null} label="2nd" />
          <ArrivalBadge arrival={service.next3 || null} label="3rd" />
        </div>
      </div>

      {service.next?.type && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pl-1">
          <span>{getBusTypeLabel(service.next.type)}</span>
          {service.operator && (
            <>
              <span>·</span>
              <span>{service.operator}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
