import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ArrowLeft, Bus, MapPin } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTheme } from '../hooks/useTheme';
import { useSEO } from '../hooks/useSEO';

export function NotFoundPage() {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [busPosition, setBusPosition] = useState(0);

    useSEO({
        title: '404 - Page Not Found | Bus Arrival Times Singapore',
        description: 'Oops! The page you are looking for does not exist. Navigate back to Bus Arrival Times to find real-time bus arrivals in Singapore.',
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setBusPosition((prev) => (prev >= 110 ? -10 : prev + 0.5));
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const quickLinks = [
        { to: '/', label: 'Home', icon: Home, description: 'Back to bus tracking' },
        { to: '/about', label: 'About Us', icon: Search, description: 'Learn about our service' },
        { to: '/blog', label: 'Blog', icon: MapPin, description: 'Read latest posts' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors">
            <Header theme={theme} onToggleTheme={toggleTheme} />

            <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Animated Bus */}
                    <div className="relative h-24 sm:h-32 mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700">
                        {/* Road */}
                        <div className="absolute bottom-4 left-0 right-0 h-1 bg-gray-300 dark:bg-slate-600" />
                        <div className="absolute bottom-5 left-0 right-0 flex gap-8 justify-center">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="w-8 h-0.5 bg-gray-400 dark:bg-slate-500" />
                            ))}
                        </div>
                        {/* Bus moving */}
                        <div
                            className="absolute bottom-5 transition-none"
                            style={{ left: `${busPosition}%`, transform: 'translateX(-50%)' }}
                        >
                            <Bus className="w-12 h-12 sm:w-16 sm:h-16 text-teal-600 dark:text-cyan-400 -scale-x-100" />
                        </div>
                        {/* Bus stop sign */}
                        <div className="absolute bottom-4 right-8 sm:right-16 flex flex-col items-center">
                            <div className="w-1 h-10 bg-red-400 dark:bg-red-500" />
                            <div className="w-6 h-6 rounded-full bg-red-500 dark:bg-red-400 flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold">?</span>
                            </div>
                        </div>
                    </div>

                    {/* 404 Text */}
                    <div className="mb-6">
                        <h1 className="text-7xl sm:text-9xl font-black bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-300 bg-clip-text text-transparent mb-4 leading-none">
                            404
                        </h1>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3">
                            Oops! Wrong Bus Stop
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-md mx-auto">
                            The page <code className="text-sm bg-gray-200 dark:bg-slate-700 px-2 py-0.5 rounded text-teal-600 dark:text-cyan-400">{location.pathname}</code> doesn't exist. Looks like this bus route has been cancelled!
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                        >
                            <Home className="w-5 h-5" />
                            Go to Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-slate-700 transition-all transform hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div className="border-t border-gray-200 dark:border-slate-700 pt-8">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium uppercase tracking-wide">
                            Helpful Links
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-cyan-500 hover:shadow-md transition-all group"
                                >
                                    <div className="p-2 rounded-lg bg-teal-100 dark:bg-slate-700 text-teal-600 dark:text-cyan-400 group-hover:bg-teal-200 dark:group-hover:bg-slate-600 transition-colors">
                                        <link.icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-800 dark:text-white text-sm">{link.label}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{link.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
