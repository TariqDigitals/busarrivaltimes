import { useState, useEffect, useCallback } from 'react';
import type { BusService } from '../types';
import { fetchBusArrivals } from '../services/api';

const REFRESH_INTERVAL = 30000;

export function useBusArrivals(busStopCode: string | null) {
  const [services, setServices] = useState<BusService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!busStopCode) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchBusArrivals(busStopCode);
      setServices(data.services || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch bus arrivals');
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [busStopCode]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { services, loading, error, lastUpdated, refresh };
}
