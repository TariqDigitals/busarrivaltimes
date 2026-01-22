import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-react';

interface PrivacyViewProps {
  onBack: () => void;
}

export function PrivacyView({ onBack }: PrivacyViewProps) {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last Updated: January 8, 2026
          </p>
        </div>

        <div className="h-px bg-gray-200 dark:bg-slate-700"></div>

        <div className="bg-teal-50 dark:bg-slate-700 rounded-lg p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-teal-600 dark:text-cyan-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Your Privacy Matters:</strong> We are committed to protecting your privacy.
              This app is designed with a privacy-first approach and collects minimal data.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <Database className="w-6 h-6 text-teal-600 dark:text-cyan-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                1. Information We Collect
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    1.1 Information Stored Locally
                  </h3>
                  <p className="text-sm">
                    The following data is stored only on your device using browser local storage:
                  </p>
                  <ul className="text-sm list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Your favorite bus stops</li>
                    <li>Your recent search history</li>
                    <li>Your theme preference (light/dark mode)</li>
                    <li>Last viewed bus stop</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    1.2 Location Data
                  </h3>
                  <p className="text-sm">
                    When you use the "Find Nearby Stops" feature, we request access to your device's
                    location. This data is:
                  </p>
                  <ul className="text-sm list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Used only to calculate distances to nearby bus stops</li>
                    <li>Never stored or transmitted to any server</li>
                    <li>Processed entirely on your device</li>
                    <li>Only accessed when you explicitly request it</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    1.3 Bus Arrival Data
                  </h3>
                  <p className="text-sm">
                    When you check bus arrivals, your device makes direct requests to the arrivelah
                    API service. We don't intercept or store these requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <Eye className="w-6 h-6 text-teal-600 dark:text-cyan-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                2. How We Use Your Information
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>We use the information described above solely to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide you with bus arrival information</li>
                  <li>Save your preferences and favorites for a better experience</li>
                  <li>Show you nearby bus stops when requested</li>
                  <li>Remember your last viewed bus stop</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <Lock className="w-6 h-6 text-teal-600 dark:text-cyan-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                3. Data Storage and Security
              </h2>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    3.1 No Server Storage
                  </h3>
                  <p>
                    We do not operate any servers that store your personal data. All your preferences
                    and history are stored locally in your browser's storage.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    3.2 Third-Party Services
                  </h3>
                  <p>
                    This app uses the following third-party services:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>
                      <strong>arrivelah API:</strong> For real-time bus arrival data
                    </li>
                    <li>
                      <strong>BusRouter.sg:</strong> For bus stop information
                    </li>
                  </ul>
                  <p className="mt-2">
                    These services have their own privacy policies. We recommend reviewing them if
                    you have concerns.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    3.3 Data Retention
                  </h3>
                  <p>
                    Your local data persists until you:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Clear your browser's cache and storage</li>
                    <li>Uninstall the app (if installed as PWA)</li>
                    <li>Manually delete your favorites and history</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            4. Cookies and Tracking
          </h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p>
              We do not use cookies or any tracking technologies. We do not use analytics services
              to track your usage.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            5. Data Sharing
          </h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p>
              We do not share, sell, or disclose any of your data to third parties. Your data stays
              on your device.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            6. Your Rights
          </h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p>Since all data is stored locally on your device, you have complete control:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Access your data by viewing your favorites and history</li>
              <li>Delete individual favorites or history items</li>
              <li>Clear all data by clearing browser storage</li>
              <li>Deny location permission at any time</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            7. Children's Privacy
          </h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p>
              This service is available for all ages. We do not knowingly collect any personal
              information from anyone, including children.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            8. Changes to This Policy
          </h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p>
              We may update this privacy policy from time to time. Any changes will be posted on
              this page with an updated revision date.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            9. Contact Us
          </h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p>
              If you have questions about this privacy policy, please contact us at{' '}
              <a
                href="mailto:support@busarrivaltimes.com"
                className="text-teal-600 dark:text-cyan-500 hover:underline"
              >
                support@busarrivaltimes.com
              </a>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            By using Singapore Bus Tracker, you agree to this privacy policy. If you do not agree
            with this policy, please do not use this service.
          </p>
        </div>
      </div>
    </div>
  );
}
