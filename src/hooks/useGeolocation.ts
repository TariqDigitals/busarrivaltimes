import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        let message = 'Failed to get your location';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location permission denied';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location unavailable';
        } else if (error.code === error.TIMEOUT) {
          message = 'Location request timed out';
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: message,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return { ...state, getCurrentPosition };
}
