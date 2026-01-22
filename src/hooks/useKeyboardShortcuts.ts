import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onEscape?: () => void;
  onSlash?: () => void;
}

export function useKeyboardShortcuts({ onEscape, onSlash }: KeyboardShortcutsConfig) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape' && onEscape) {
          e.preventDefault();
          onEscape();
        }
        return;
      }

      if (e.key === '/' && onSlash) {
        e.preventDefault();
        onSlash();
      }

      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onSlash]);
}
