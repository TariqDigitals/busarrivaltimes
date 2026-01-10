import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search, X, MapPin, Clock } from 'lucide-react';
import type { BusStop } from '../types';
import { searchBusStops } from '../services/api';
import { getHistory } from '../utils/storage';

interface SearchBarProps {
  stops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  onNearbyClick: () => void;
  nearbyLoading: boolean;
}

export interface SearchBarHandle {
  focus: () => void;
}

export const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(function SearchBar(
  { stops, onSelectStop, onNearbyClick, nearbyLoading },
  ref
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BusStop[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showRecent, setShowRecent] = useState(false);
  const [recentStops, setRecentStops] = useState<BusStop[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchBusStops(stops, query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setShowRecent(false);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
      setShowRecent(false);
      setSelectedIndex(-1);
    }
  }, [query, stops]);

  useEffect(() => {
    const history = getHistory();
    const recent = history
      .map(code => stops.find(s => s.code === code))
      .filter((s): s is BusStop => s !== undefined)
      .slice(0, 5);
    setRecentStops(recent);
  }, [stops]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowRecent(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(stop: BusStop) {
    onSelectStop(stop);
    setQuery('');
    setIsOpen(false);
    setShowRecent(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  }

  function handleFocus() {
    if (!query && recentStops.length > 0) {
      setShowRecent(true);
    } else if (results.length > 0) {
      setIsOpen(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const activeList = showRecent ? recentStops : results;
    if ((!isOpen && !showRecent) || activeList.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < activeList.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < activeList.length) {
          handleSelect(activeList[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setShowRecent(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }

  return (
    <div className="px-4 mt-10 relative z-40 mb-6" ref={containerRef}>
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder="Search stop code or name..."
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border-0 outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-cyan-500 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-base"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            onClick={onNearbyClick}
            disabled={nearbyLoading}
            className="px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Find nearby stops"
          >
            <MapPin className={`w-6 h-6 text-teal-600 dark:text-cyan-400 ${nearbyLoading ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        {(isOpen || showRecent) && (
          <div className="absolute left-4 right-4 top-full mt-2 max-h-80 overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 fade-in">
            {showRecent && (
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Recent Searches
              </div>
            )}
            {(showRecent ? recentStops : results).map((stop, index) => (
              <button
                key={stop.code}
                onClick={() => handleSelect(stop)}
                className={`w-full px-4 py-3 text-left transition-colors ${
                  !showRecent && index === 0 ? 'first:rounded-t-2xl' : ''
                } last:rounded-b-2xl ${
                  index === selectedIndex
                    ? 'bg-teal-50 dark:bg-cyan-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 dark:bg-cyan-900/50 text-teal-700 dark:text-cyan-300 px-2.5 py-1 rounded-lg text-sm font-mono font-semibold">
                    {stop.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 dark:text-white font-medium truncate">{stop.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{stop.road}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
