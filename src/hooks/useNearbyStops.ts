import { useMemo } from 'react';
import type { BusStop, NearbyStop } from '../types';
import { calculateDistance, calculateWalkingTime } from '../utils/helpers';

const MAX_DISTANCE = 500;

export function useNearbyStops(
  stops: BusStop[],
  latitude: number | null,
  longitude: number | null
): NearbyStop[] {
  return useMemo(() => {
    if (!latitude || !longitude || stops.length === 0) {
      return [];
    }

    const stopsWithDistance = stops.map((stop) => {
      const distance = calculateDistance(latitude, longitude, stop.latitude, stop.longitude);
      return {
        ...stop,
        distance,
        walkingTime: calculateWalkingTime(distance),
      };
    });

    return stopsWithDistance
      .filter((stop) => stop.distance <= MAX_DISTANCE)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 15);
  }, [stops, latitude, longitude]);
}
