import { useState, useEffect, useCallback } from 'react';
import { getTheme, saveTheme } from '../utils/storage';

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(getTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    saveTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
