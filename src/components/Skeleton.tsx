export function BusCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="bg-gray-200 dark:bg-slate-700 rounded-xl w-[70px] h-12" />
        <div className="flex-1 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="bg-gray-100 dark:bg-slate-700 rounded h-3 w-8" />
              <div className="bg-gray-200 dark:bg-slate-600 rounded-xl h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StopCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="bg-gray-200 dark:bg-slate-700 rounded-xl w-16 h-8" />
        <div className="flex-1">
          <div className="bg-gray-200 dark:bg-slate-700 rounded h-5 w-3/4 mb-2" />
          <div className="bg-gray-100 dark:bg-slate-700 rounded h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function InitialLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-2xl mb-4" />
      <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
    </div>
  );
}
