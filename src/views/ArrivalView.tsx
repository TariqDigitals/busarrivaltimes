import { ArrowLeft, RefreshCw, Star, MapPin, ExternalLink, ArrowDown, Share2 } from 'lucide-react';
import { useState } from 'react';
import type { BusStop, BusService } from '../types';
import { BusArrivalCard } from '../components/BusArrivalCard';
import { LoadIndicator } from '../components/LoadIndicator';
import { BusCardSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

interface ArrivalViewProps {
  stop: BusStop;
  services: BusService[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isFavorite: boolean;
  onBack: () => void;
  onRefresh: () => void;
  onToggleFavorite: () => void;
}

export function ArrivalView({
  stop,
  services,
  loading,
  error,
  lastUpdated,
  isFavorite,
  onBack,
  onRefresh,
  onToggleFavorite,
}: ArrivalViewProps) {
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${stop.latitude},${stop.longitude}`;
  const { isPulling, pullDistance, isTriggered } = usePullToRefresh(onRefresh);

  async function handleShare() {
    const shareData = {
      title: `Bus Stop ${stop.code} - ${stop.name}`,
      text: `Check bus arrivals at ${stop.name} (${stop.code})`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await copyToClipboard();
        }
      }
    } else {
      await copyToClipboard();
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard');
    }
  }

  return (
    <div className="space-y-4 slide-in-from-bottom">
      {isPulling && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all"
          style={{ height: `${pullDistance}px` }}
        >
          <div className={`transition-all ${isTriggered ? 'scale-110' : 'scale-100'}`}>
            <RefreshCw
              className={`w-6 h-6 text-teal-600 dark:text-cyan-400 ${
                isTriggered ? 'animate-spin' : ''
              }`}
            />
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4">
        <div className="flex items-start justify-between mb-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-1">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              aria-label="Open in Google Maps"
            >
              <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </a>
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                aria-label="Share bus stop"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              {showShareTooltip && (
                <div className="absolute top-full mt-2 right-0 bg-gray-800 text-white text-xs py-1 px-3 rounded-lg whitespace-nowrap">
                  Link copied!
                </div>
              )}
            </div>
            <button
              onClick={onToggleFavorite}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-amber-400 text-amber-400' : 'text-gray-400'
                }`}
              />
            </button>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
              aria-label="Refresh arrivals"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white px-4 py-2 rounded-xl">
            <span className="font-bold text-lg font-mono">{stop.code}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
              {stop.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{stop.road}</p>
          </div>
        </div>

        {lastUpdated && (
          <div className="mt-3 flex items-center justify-end gap-2">
            {loading && services.length > 0 && (
              <div className="w-1.5 h-1.5 bg-teal-500 dark:bg-cyan-400 rounded-full animate-pulse" />
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>

      <LoadIndicator />

      {loading && services.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <BusCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <EmptyState type="error" message={error} onRetry={onRefresh} />
      ) : services.length === 0 ? (
        <EmptyState type="arrivals" message="No bus services currently at this stop" />
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <BusArrivalCard key={service.no} service={service} />
          ))}
        </div>
      )}

      <div className="text-center pt-4">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-cyan-400 hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          View on Google Maps
        </a>
      </div>
    </div>
  );
}
