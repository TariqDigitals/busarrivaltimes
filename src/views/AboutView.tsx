import { ArrowLeft, Bus, MapPin, Heart, Zap } from 'lucide-react';

interface AboutViewProps {
  onBack: () => void;
}

export function AboutView({ onBack }: AboutViewProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-teal-600 dark:text-cyan-500 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            About Singapore Bus Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your smart companion for Singapore's public transport
          </p>
        </div>

        <div className="h-px bg-gray-200 dark:bg-slate-700"></div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We built this app to make your daily commute easier and more predictable. No more waiting
            in uncertainty at bus stops. Get real-time bus arrival information instantly, save your
            favorite stops, and plan your journey with confidence.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Key Features
          </h2>
          <div className="grid gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Zap className="w-5 h-5 text-teal-600 dark:text-cyan-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Real-Time Arrivals</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Live bus arrival times updated every 30 seconds with load information
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <MapPin className="w-5 h-5 text-teal-600 dark:text-cyan-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Find Nearby Stops</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Locate bus stops near you with one tap using your device location
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Heart className="w-5 h-5 text-teal-600 dark:text-cyan-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Save Favorites</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quick access to your frequently used bus stops
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Bus className="w-5 h-5 text-teal-600 dark:text-cyan-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Search & History</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Search by bus stop code or name, view your recent searches
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Data Sources
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            All bus arrival data is sourced from the{' '}
            <a
              href="https://datamall.lta.gov.sg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-cyan-500 hover:underline"
            >
              Land Transport Authority (LTA) DataMall
            </a>
            , Singapore's official public transport data platform. We use the realtime API to provide you with accurate, real-time information.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Privacy & Storage
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Your favorites and search history are stored locally on your device. We don't collect
            or store any personal information on external servers. Your data stays with you.
          </p>
        </div>

        <div className="bg-teal-50 dark:bg-slate-700 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Note:</strong> This is an independent project and is not affiliated with or
            endorsed by the Land Transport Authority or the Government of Singapore.
          </p>
        </div>
      </div>
    </div>
  );
}
