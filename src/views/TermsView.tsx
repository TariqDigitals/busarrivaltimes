import { ArrowLeft, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface TermsViewProps {
  onBack: () => void;
}

export function TermsView({ onBack }: TermsViewProps) {
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
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last Updated: January 8, 2026
          </p>
        </div>

        <div className="h-px bg-gray-200 dark:bg-slate-700"></div>

        <div className="bg-teal-50 dark:bg-slate-700 rounded-lg p-4">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-teal-600 dark:text-cyan-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Please read these terms carefully before using Singapore Bus Tracker. By accessing or
              using this service, you agree to be bound by these terms.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <CheckCircle className="w-6 h-6 text-teal-600 dark:text-cyan-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                1. Acceptance of Terms
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  By accessing and using Singapore Bus Tracker (the "Service"), you accept and agree
                  to be bound by these Terms and Conditions. If you do not agree to these terms,
                  please do not use the Service.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            2. Description of Service
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              Singapore Bus Tracker is a web-based application that provides:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Real-time bus arrival information for Singapore bus stops</li>
              <li>Search functionality for bus stops</li>
              <li>Location-based nearby bus stop finder</li>
              <li>Ability to save favorite bus stops</li>
              <li>Recent search history</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                3. Important Disclaimers
              </h2>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    3.1 Third-Party Data
                  </h3>
                  <p>
                    All bus arrival information is provided by third-party services (LTA DataMall
                    via arrivelah API). We do not control or guarantee the accuracy, completeness,
                    or timeliness of this data.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    3.2 Not Official LTA Service
                  </h3>
                  <p>
                    This is an independent project and is NOT affiliated with, endorsed by, or
                    connected to the Land Transport Authority (LTA) or the Government of Singapore.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    3.3 Service Availability
                  </h3>
                  <p>
                    We strive to maintain high availability but cannot guarantee uninterrupted
                    service. The Service may be temporarily unavailable due to maintenance,
                    third-party service disruptions, or other factors beyond our control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            4. User Responsibilities
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>When using this Service, you agree to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Use the Service only for lawful purposes</li>
              <li>Not attempt to reverse engineer, hack, or compromise the Service</li>
              <li>Not use automated scripts or bots to overload the Service</li>
              <li>Not misuse location services or any other features</li>
              <li>Verify critical information through official sources</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            5. Limitation of Liability
          </h2>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong>USE AT YOUR OWN RISK.</strong> The Service is provided "as is" without
              warranties of any kind, either express or implied.
            </p>
            <p>
              We are not liable for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Missed buses or incorrect arrival information</li>
              <li>Any direct, indirect, incidental, or consequential damages</li>
              <li>Lost profits, data, or opportunities</li>
              <li>Service interruptions or errors</li>
              <li>Issues arising from third-party service failures</li>
            </ul>
            <p>
              You should always verify bus arrival times through official channels and plan
              accordingly. Do not rely solely on this app for time-critical situations.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            6. Intellectual Property
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              The Service's interface, design, and code are protected by intellectual property
              rights. Bus data and stop information are provided by LTA and third parties under
              their respective licenses.
            </p>
            <p>
              You may not copy, modify, distribute, or create derivative works from the Service
              without explicit permission.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            7. Privacy
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              Your use of the Service is also governed by our Privacy Policy. Please review it to
              understand how we handle data.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            8. Location Services
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              The "Find Nearby Stops" feature requires access to your device's location. By using
              this feature, you grant permission for location access. You can revoke this
              permission at any time through your device settings.
            </p>
            <p>
              Location accuracy depends on your device and may not always be precise. Always verify
              your actual location before making travel decisions.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            9. Termination
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              We reserve the right to terminate or suspend access to the Service at any time,
              without notice, for any reason, including violation of these terms.
            </p>
            <p>
              You may stop using the Service at any time. Your local data (favorites, history) will
              remain on your device until you clear it.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            10. Changes to Terms
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              We may modify these terms at any time. Continued use of the Service after changes
              constitutes acceptance of the modified terms. We recommend checking this page
              periodically.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            11. Governing Law
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              These terms are governed by the laws of Singapore. Any disputes shall be subject to
              the exclusive jurisdiction of the courts of Singapore.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            12. Contact Information
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              For questions about these terms, please contact us at{' '}
              <a
                href="mailto:support@busarrivaltimes.com"
                className="text-teal-600 dark:text-cyan-500 hover:underline"
              >
                support@busarrivaltimes.com
              </a>
            </p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-slate-700 rounded-lg p-4">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            <strong>Important Reminder:</strong> While we strive to provide accurate information,
            always verify bus timings through official sources, especially for important journeys.
            Plan ahead and allow buffer time for your commute.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            By clicking "I understand" or continuing to use Singapore Bus Tracker, you acknowledge
            that you have read, understood, and agree to these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
