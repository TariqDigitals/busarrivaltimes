import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { url: 'https://www.facebook.com/busarrivaltimes/', icon: Facebook, label: 'Facebook' },
    { url: 'https://www.instagram.com/busarrivalstimessg/', icon: Instagram, label: 'Instagram' },
    { url: 'https://www.youtube.com/channel/UCslVATcdPYIxZdS9exbzjMg', icon: Youtube, label: 'YouTube' },
  ];

  return (
    <footer className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-center gap-4 mb-6">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="p-3 rounded-full bg-teal-100 dark:bg-slate-700 text-teal-600 dark:text-cyan-400 hover:bg-teal-200 dark:hover:bg-slate-600 transition-all hover:scale-110"
            aria-label={social.label}
          >
            <social.icon className="w-5 h-5" />
          </a>
        ))}
        <a
          href="https://www.pinterest.com/BusArrivalsTimesSingapore/"
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="p-3 rounded-full bg-teal-100 dark:bg-slate-700 text-teal-600 dark:text-cyan-400 hover:bg-teal-200 dark:hover:bg-slate-600 transition-all hover:scale-110"
          aria-label="Pinterest"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>

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
          to="/blog"
          className="text-sm text-teal-600 dark:text-cyan-500 hover:underline"
        >
          Blog
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
          rel="nofollow noopener"
          className="text-teal-600 dark:text-cyan-500 hover:underline font-semibold"
        >
          TARIQ DIGITALS
        </a>
      </p>
    </footer>
  );
}
