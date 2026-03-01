import { useState, useEffect } from 'react';
import { X, Download, Share, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed as PWA
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone === true;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Check if dismissed recently (don't show for 7 days)
        const dismissedAt = localStorage.getItem('pwa-dismiss-time');
        if (dismissedAt) {
            const daysSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
            if (daysSince < 7) return;
        }

        // Detect iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        // Android/Desktop: Listen for install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show prompt after 5 seconds of browsing
            setTimeout(() => setShowPrompt(true), 5000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // iOS: Show custom guide after 10 seconds
        if (isIOSDevice) {
            setTimeout(() => setShowPrompt(true), 10000);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        setShowIOSGuide(false);
        localStorage.setItem('pwa-dismiss-time', Date.now().toString());
    };

    if (isInstalled || !showPrompt) return null;

    return (
        <>
            {/* Install Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
                <div className="max-w-lg mx-auto p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-white" />
                                <span className="text-white font-semibold text-sm">Install App</span>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="text-white/80 hover:text-white transition-colors"
                                aria-label="Dismiss"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src="/logo.png"
                                    alt="Bus Arrivals SG"
                                    className="w-14 h-14 rounded-xl shadow-md flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                                        Bus Arrivals SG
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                        Get instant bus times — works offline too!
                                    </p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="flex gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">✨ Free</span>
                                <span className="flex items-center gap-1">⚡ Fast</span>
                                <span className="flex items-center gap-1">📴 Offline</span>
                                <span className="flex items-center gap-1">🔔 Alerts</span>
                            </div>

                            {/* Install Button */}
                            <div className="mt-4 flex gap-2">
                                {isIOS ? (
                                    <button
                                        onClick={() => setShowIOSGuide(true)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all active:scale-95"
                                    >
                                        <Share className="w-4 h-4" />
                                        Add to Home Screen
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleInstall}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all active:scale-95"
                                    >
                                        <Download className="w-4 h-4" />
                                        Install App
                                    </button>
                                )}
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* iOS Guide Modal */}
            {showIOSGuide && (
                <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-4 flex items-center justify-between">
                            <h3 className="text-white font-bold text-lg">Install on iPhone</h3>
                            <button onClick={handleDismiss} className="text-white/80 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0 text-teal-600 dark:text-teal-400 font-bold text-sm">1</div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Tap the Share button</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                        Find the <Share className="w-3 h-3 inline" /> icon at the bottom of Safari
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0 text-teal-600 dark:text-teal-400 font-bold text-sm">2</div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Scroll down and tap</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                        "Add to Home Screen" ➕
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0 text-teal-600 dark:text-teal-400 font-bold text-sm">3</div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Tap "Add"</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                        The app will appear on your home screen!
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleDismiss}
                                className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all active:scale-95"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
