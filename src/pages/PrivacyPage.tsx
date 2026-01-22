import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PrivacyView } from '../views/PrivacyView';
import { useTheme } from '../hooks/useTheme';

export function PrivacyPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.title = 'Privacy Policy - Bus Arrival Times';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read our privacy policy to understand how Bus Arrival Times collects, uses, and protects your personal information.');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="pb-6">
        <PrivacyView onBack={handleBack} />
      </main>
      <Footer />
    </div>
  );
}
