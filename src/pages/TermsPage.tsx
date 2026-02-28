import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TermsView } from '../views/TermsView';
import { useTheme } from '../hooks/useTheme';
import { useSEO } from '../hooks/useSEO';

export function TermsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useSEO({
    title: 'Terms & Conditions - Bus Arrival Times Singapore',
    description: 'Read the terms and conditions for using Bus Arrival Times service. Understand your rights and responsibilities.',
  });

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="pb-6">
        <TermsView onBack={handleBack} />
      </main>
      <Footer />
    </div>
  );
}
