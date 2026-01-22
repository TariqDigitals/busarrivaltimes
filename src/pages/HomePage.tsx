import { useState, useCallback, useRef, useEffect } from 'react';
import type { BusStop } from '../types';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { Footer } from '../components/Footer';
import { HomeView } from '../views/HomeView';
import { ArrivalView } from '../views/ArrivalView';
import { useBusStops } from '../hooks/useBusStops';
import { useBusArrivals } from '../hooks/useBusArrivals';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNearbyStops } from '../hooks/useNearbyStops';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../hooks/useTheme';
import { usePersistedState } from '../hooks/usePersistedState';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export function HomePage() {
  const [selectedStop, setSelectedStop] = usePersistedState<BusStop | null>('selectedStop', null);
  const [showNearby, setShowNearby] = useState(false);
  const searchInputRef = useRef<{ focus: () => void }>(null);

  const { theme, toggleTheme } = useTheme();
  const { stops, loading: stopsLoading } = useBusStops();
  const { services, loading: arrivalsLoading, error: arrivalsError, lastUpdated, refresh } = useBusArrivals(
    selectedStop?.code || null
  );
  const { latitude, longitude, loading: geoLoading, error: geoError, getCurrentPosition } = useGeolocation();
  const nearbyStops = useNearbyStops(stops, latitude, longitude);
  const { favorites, history, toggleFavorite, isFavorite, recordHistory } = useFavorites();

  useEffect(() => {
    document.title = 'Bus Arrival Times - Real-Time Singapore Bus Arrivals';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get real-time bus arrival times for Singapore bus stops. Track your favorite stops, find nearby buses, and plan your journey efficiently.');
    }
  }, []);

  const handleSelectStop = useCallback(
    (stop: BusStop) => {
      setSelectedStop(stop);
      recordHistory(stop.code);
    },
    [recordHistory]
  );

  const handleBack = useCallback(() => {
    setSelectedStop(null);
  }, []);

  const handleFindNearby = useCallback(() => {
    setShowNearby(true);
    getCurrentPosition();
  }, [getCurrentPosition]);

  const handleToggleFavorite = useCallback(
    (code: string) => {
      toggleFavorite(code);
    },
    [toggleFavorite]
  );

  useKeyboardShortcuts({
    onEscape: useCallback(() => {
      if (selectedStop) {
        setSelectedStop(null);
      }
    }, [selectedStop, setSelectedStop]),
    onSlash: useCallback(() => {
      searchInputRef.current?.focus();
    }, []),
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <SearchBar
        ref={searchInputRef}
        stops={stops}
        onSelectStop={handleSelectStop}
        onNearbyClick={handleFindNearby}
        nearbyLoading={geoLoading}
      />

      <main className="pb-6">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {selectedStop ? (
            <ArrivalView
              stop={selectedStop}
              services={services}
              loading={arrivalsLoading}
              error={arrivalsError}
              lastUpdated={lastUpdated}
              isFavorite={isFavorite(selectedStop.code)}
              onBack={handleBack}
              onRefresh={refresh}
              onToggleFavorite={() => handleToggleFavorite(selectedStop.code)}
            />
          ) : (
            <HomeView
              stops={stops}
              stopsLoading={stopsLoading}
              favorites={favorites}
              history={history}
              nearbyStops={nearbyStops}
              nearbyLoading={geoLoading}
              nearbyError={geoError}
              onSelectStop={handleSelectStop}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
              onFindNearby={handleFindNearby}
              showNearby={showNearby}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
