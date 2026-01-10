const FAVORITES_KEY = 'sg-bus-favorites';
const HISTORY_KEY = 'sg-bus-history';
const THEME_KEY = 'sg-bus-theme';
const MAX_HISTORY = 10;

export function getFavorites(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function addFavorite(code: string): string[] {
  const favorites = getFavorites();
  if (!favorites.includes(code)) {
    favorites.unshift(code);
    saveFavorites(favorites);
  }
  return favorites;
}

export function removeFavorite(code: string): string[] {
  const favorites = getFavorites().filter((c) => c !== code);
  saveFavorites(favorites);
  return favorites;
}

export function isFavorite(code: string): boolean {
  return getFavorites().includes(code);
}

export function getHistory(): string[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToHistory(code: string): string[] {
  let history = getHistory().filter((c) => c !== code);
  history.unshift(code);
  history = history.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
}

export function getTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}
