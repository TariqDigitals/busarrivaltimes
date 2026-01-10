import { useState } from 'react';
import { ChevronDown, ChevronUp, List, X } from 'lucide-react';
import type { BusStop } from '../types';
import { BusStopCard } from './BusStopCard';

interface BrowseStopsSectionProps {
  stops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  onToggleFavorite: (code: string) => void;
  isFavorite: (code: string) => boolean;
}

export function BrowseStopsSection({
  stops,
  onSelectStop,
  onToggleFavorite,
  isFavorite,
}: BrowseStopsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const groupedStops = stops.reduce((acc, stop) => {
    const firstChar = stop.name.charAt(0).toUpperCase();
    if (!acc[firstChar]) {
      acc[firstChar] = [];
    }
    acc[firstChar].push(stop);
    return acc;
  }, {} as Record<string, BusStop[]>);

  const numericCategories = Object.keys(groupedStops)
    .filter((key) => /^\d/.test(key))
    .sort();

  const alphabetCategories = Object.keys(groupedStops)
    .filter((key) => /^[A-Z]/.test(key))
    .sort();

  const allCategories = [...numericCategories, ...alphabetCategories];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const closeModal = () => {
    setSelectedCategory(null);
  };

  return (
    <section className="mt-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 px-6 py-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-slate-700"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
            <List className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Browse All Stops
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stops.length} bus stops available
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="aspect-square bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95"
            >
              <span className="text-2xl font-bold text-teal-600 dark:text-cyan-400">
                {category}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {groupedStops[category].length}
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between gap-4 p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-600 dark:bg-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{selectedCategory}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {selectedCategory} Stops
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {groupedStops[selectedCategory].length} bus stops
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {groupedStops[selectedCategory].map((stop) => (
                  <BusStopCard
                    key={stop.code}
                    stop={stop}
                    isFavorite={isFavorite(stop.code)}
                    onSelect={() => {
                      onSelectStop(stop);
                      closeModal();
                    }}
                    onToggleFavorite={() => onToggleFavorite(stop.code)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
