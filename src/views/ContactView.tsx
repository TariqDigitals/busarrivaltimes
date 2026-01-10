import { ArrowLeft, Mail, MessageSquare, Bug, Lightbulb } from 'lucide-react';

interface ContactViewProps {
  onBack: () => void;
}

export function ContactView({ onBack }: ContactViewProps) {
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
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We'd love to hear from you
          </p>
        </div>

        <div className="h-px bg-gray-200 dark:bg-slate-700"></div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Get in Touch
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Have questions, suggestions, or feedback? We're here to help! Reach out to us through
            any of the following channels:
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <Mail className="w-6 h-6 text-teal-600 dark:text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                For general inquiries and support
              </p>
              <a
                href="mailto:support@busarrivaltimes.com"
                className="text-teal-600 dark:text-cyan-500 hover:underline"
              >
                support@busarrivaltimes.com
              </a>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <Bug className="w-6 h-6 text-teal-600 dark:text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Report a Bug</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Found an issue? Let us know so we can fix it
              </p>
              <a
                href="mailto:support@busarrivaltimes.com"
                className="text-teal-600 dark:text-cyan-500 hover:underline"
              >
                support@busarrivaltimes.com
              </a>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <Lightbulb className="w-6 h-6 text-teal-600 dark:text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Feature Request</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Have an idea to improve the app?
              </p>
              <a
                href="mailto:support@busarrivaltimes.com"
                className="text-teal-600 dark:text-cyan-500 hover:underline"
              >
                support@busarrivaltimes.com
              </a>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <MessageSquare className="w-6 h-6 text-teal-600 dark:text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">General Feedback</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Share your thoughts and experiences
              </p>
              <a
                href="mailto:support@busarrivaltimes.com"
                className="text-teal-600 dark:text-cyan-500 hover:underline"
              >
                support@busarrivaltimes.com
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Response Time
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We typically respond to all inquiries within 24-48 hours during business days. For urgent
            technical issues affecting the service, we'll prioritize and respond as quickly as possible.
          </p>
        </div>

        <div className="bg-teal-50 dark:bg-slate-700 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Before You Contact Us
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Please check our Privacy Policy and Terms & Conditions pages for answers to common
            questions about data handling, service usage, and your rights as a user.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Note About Bus Data
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            For issues related to bus schedules, routes, or LTA services, please contact the{' '}
            <a
              href="https://www.lta.gov.sg/content/ltagov/en/contact_us.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-cyan-500 hover:underline"
            >
              Land Transport Authority
            </a>
            {' '}directly. We provide the interface but don't control the underlying transport data.
          </p>
        </div>
      </div>
    </div>
  );
}
