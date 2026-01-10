import { Bus, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-slate-800 dark:to-slate-900 text-white shadow-lg sticky top-0 z-50 pb-4">
      <div className="max-w-5xl mx-auto px-4 pt-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:scale-105 hover:opacity-90 transition-all duration-200 cursor-pointer group">
          <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl group-hover:bg-white/30 transition-all">
            <Bus className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight leading-tight">Bus Arrival Times in Singapore</h1>
            <p className="text-xs text-white/90">Check Real-time Singapore Bus Arrivals</p>
          </div>
        </Link>
        <button
          onClick={onToggleTheme}
          className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
}
