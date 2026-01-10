import { getLoadColor } from '../utils/helpers';

export function LoadIndicator() {
  const loads = ['SEA', 'SDA', 'LSD'] as const;

  return (
    <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
      {loads.map((load) => {
        const { bg, label } = getLoadColor(load);
        return (
          <div key={load} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${bg}`} />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
