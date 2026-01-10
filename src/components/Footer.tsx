import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <Link
          to="/about"
          className="text-sm text-teal-600 dark:text-cyan-500 hover:underline"
        >
          About Us
        </Link>
        <span className="text-gray-400 dark:text-gray-600">•</span>
        <Link
          to="/contact"
          className="text-sm text-teal-600 dark:text-cyan-500 hover:underline"
        >
          Contact Us
        </Link>
        <span className="text-gray-400 dark:text-gray-600">•</span>
        <Link
          to="/privacy"
          className="text-sm text-teal-600 dark:text-cyan-500 hover:underline"
        >
          Privacy Policy
        </Link>
        <span className="text-gray-400 dark:text-gray-600">•</span>
        <Link
          to="/terms"
          className="text-sm text-teal-600 dark:text-cyan-500 hover:underline"
        >
          Terms & Conditions
        </Link>
      </div>
      <p className="text-xs text-center text-gray-400 dark:text-gray-600">
        Designed and Developed by{' '}
        <a
          href="https://tariqdigitals.com"
          target="_blank"
          rel="noopener"
          className="text-teal-600 dark:text-cyan-500 hover:underline font-semibold"
        >
          TARIQ DIGITALS
        </a>
      </p>
    </footer>
  );
}
