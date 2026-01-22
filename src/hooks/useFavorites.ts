import { useState, useCallback } from 'react';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite as checkIsFavorite,
  getHistory,
  addToHistory,
} from '../utils/storage';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(getFavorites);
  const [history, setHistory] = useState<string[]>(getHistory);

  const toggleFavorite = useCallback((code: string) => {
    if (checkIsFavorite(code)) {
      setFavorites(removeFavorite(code));
    } else {
      setFavorites(addFavorite(code));
    }
  }, []);

  const isFavorite = useCallback(
    (code: string) => favorites.includes(code),
    [favorites]
  );

  const recordHistory = useCallback((code: string) => {
    setHistory(addToHistory(code));
  }, []);

  return {
    favorites,
    history,
    toggleFavorite,
    isFavorite,
    recordHistory,
  };
}
