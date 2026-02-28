import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PrivacyView } from '../views/PrivacyView';
import { useTheme } from '../hooks/useTheme';
import { useSEO } from '../hooks/useSEO';

export function PrivacyPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useSEO({
    title: 'Privacy Policy - Bus Arrival Times Singapore',
    description: 'Read our privacy policy to understand how Bus Arrival Times collects, uses, and protects your personal information.',
  });

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
