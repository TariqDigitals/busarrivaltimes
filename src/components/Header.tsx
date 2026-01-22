import { Bus, Moon, Sun, Menu, X, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/alarms', label: 'Alarms', icon: Bell },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/blog', label: 'Blog' },
  ];

  return (
    <header className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-slate-800 dark:to-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:scale-105 hover:opacity-90 transition-all duration-200 cursor-pointer group">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl group-hover:bg-white/30 transition-all">
              <Bus className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight leading-tight">Bus Arrival Times in Singapore</h1>
              <p className="text-xs text-white/90">Check Real-time Singapore Bus Arrivals</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white/90 hover:text-white hover:underline transition-all font-medium flex items-center gap-1"
                >
                  {link.icon && <link.icon size={16} />}
                  {link.label}
                </Link>
              ))}
            </nav>

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

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2"
              >
                {link.icon && <link.icon size={18} />}
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
