import { Star, Clock, MapPin } from 'lucide-react';
import type { BusStop, NearbyStop } from '../types';
import { BusStopCard } from '../components/BusStopCard';
import { StopCardSkeleton, InitialLoadingSkeleton } from '../components/Skeleton';
import { FeaturesSection } from '../components/FeaturesSection';
import { WhyDifferentSection } from '../components/WhyDifferentSection';
import { FAQSection } from '../components/FAQSection';
import { EmptyState } from '../components/EmptyState';
import { BrowseStopsSection } from '../components/BrowseStopsSection';
import { getBusStopByCode } from '../services/api';

interface HomeViewProps {
  stops: BusStop[];
  stopsLoading: boolean;
  favorites: string[];
  history: string[];
  nearbyStops: NearbyStop[];
  nearbyLoading: boolean;
  nearbyError: string | null;
  onSelectStop: (stop: BusStop) => void;
  onToggleFavorite: (code: string) => void;
  isFavorite: (code: string) => boolean;
  onFindNearby: () => void;
  showNearby: boolean;
}

export function HomeView({
  stops,
  stopsLoading,
  favorites,
  history,
  nearbyStops,
  nearbyLoading,
  nearbyError,
  onSelectStop,
  onToggleFavorite,
  isFavorite,
  onFindNearby,
  showNearby,
}: HomeViewProps) {
  if (stopsLoading) {
    return <InitialLoadingSkeleton />;
  }

  const favoriteStops = favorites
    .map((code) => getBusStopByCode(stops, code))
    .filter((stop): stop is BusStop => stop !== undefined);

  const historyStops = history
    .filter((code) => !favorites.includes(code))
    .map((code) => getBusStopByCode(stops, code))
    .filter((stop): stop is BusStop => stop !== undefined)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {showNearby && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <MapPin className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Nearby Stops
            </h2>
          </div>
          {nearbyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <StopCardSkeleton key={i} />
              ))}
            </div>
          ) : nearbyError ? (
            <EmptyState type="error" message={nearbyError} onRetry={onFindNearby} />
          ) : nearbyStops.length === 0 ? (
            <EmptyState type="nearby" />
          ) : (
            <div className="space-y-3">
              {nearbyStops.map((stop) => (
                <BusStopCard
                  key={stop.code}
                  stop={stop}
                  isFavorite={isFavorite(stop.code)}
                  onSelect={() => onSelectStop(stop)}
                  onToggleFavorite={() => onToggleFavorite(stop.code)}
                  distance={stop.distance}
                  walkingTime={stop.walkingTime}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {favoriteStops.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Star className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Favorites
            </h2>
          </div>
          <div className="space-y-3">
            {favoriteStops.map((stop) => (
              <BusStopCard
                key={stop.code}
                stop={stop}
                isFavorite={true}
                onSelect={() => onSelectStop(stop)}
                onToggleFavorite={() => onToggleFavorite(stop.code)}
              />
            ))}
          </div>
        </section>
      )}

      <BrowseStopsSection
        stops={stops}
        onSelectStop={onSelectStop}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
      />

      {historyStops.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Recent
            </h2>
          </div>
          <div className="space-y-3">
            {historyStops.map((stop) => (
              <BusStopCard
                key={stop.code}
                stop={stop}
                isFavorite={isFavorite(stop.code)}
                onSelect={() => onSelectStop(stop)}
                onToggleFavorite={() => onToggleFavorite(stop.code)}
              />
            ))}
          </div>
        </section>
      )}

      <FeaturesSection />
      <WhyDifferentSection />
      <FAQSection />
    </div>
  );
}
