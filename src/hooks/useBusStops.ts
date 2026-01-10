import { useState, useEffect } from 'react';
import type { BusStop } from '../types';
import { fetchAllBusStops } from '../services/api';

export function useBusStops() {
  const [stops, setStops] = useState<BusStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadStops() {
      try {
        const data = await fetchAllBusStops();
        if (mounted) {
          setStops(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load bus stops');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStops();

    return () => {
      mounted = false;
    };
  }, []);

  return { stops, loading, error };
}
