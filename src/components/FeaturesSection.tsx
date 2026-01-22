import { Clock, MapPin, Star, RefreshCw, Search, Zap, Moon, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeatureCard } from './FeatureCard';

export function FeaturesSection() {
  const features = [
    {
      icon: Clock,
      title: 'Real-Time Arrivals',
      description: 'Get live bus arrival times with automatic updates every 30 seconds.',
      color: 'bg-teal-600',
    },
    {
      icon: MapPin,
      title: 'Nearby Stops',
      description: 'Find bus stops near you with walking time and distance information.',
      color: 'bg-cyan-600',
    },
    {
      icon: Star,
      title: 'Favorites',
      description: 'Save your frequently used bus stops for quick access.',
      color: 'bg-amber-500',
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Search by bus stop code or name with instant suggestions and history.',
      color: 'bg-blue-600',
    },
    {
      icon: RefreshCw,
      title: 'Auto-Refresh',
      description: 'Arrival times update automatically so you always have the latest info.',
      color: 'bg-green-600',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with instant loading and smooth animations.',
      color: 'bg-yellow-500',
    },
    {
      icon: Moon,
      title: 'Dark Mode',
      description: 'Easy on the eyes with a beautiful dark theme for night time use.',
      color: 'bg-slate-700',
    },
    {
      icon: Wifi,
      title: 'Works Offline',
      description: 'Access recently viewed stops and cached data even without internet.',
      color: 'bg-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3 px-4 pt-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome to Bus Arrivals
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          <Link to="/" className="text-teal-600 dark:text-cyan-500 hover:underline">Track real-time bus arrivals</Link> across Singapore. Search for stops, save favorites, and never miss your bus again.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      <div className="text-center px-4 pb-4">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Start by searching for a bus stop or tap the location button to find nearby stops
        </p>
      </div>
    </div>
  );
}
