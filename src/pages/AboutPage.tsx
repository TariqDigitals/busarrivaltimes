import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AboutView } from '../views/AboutView';
import { useTheme } from '../hooks/useTheme';
import { useSEO } from '../hooks/useSEO';

export function AboutPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useSEO({
    title: 'About Us - Bus Arrival Times Singapore',
    description: 'Learn about Bus Arrival Times - Singapore\'s most reliable real-time bus tracking service. Discover our mission to make public transport easier.',
  });

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="pb-6">
        <AboutView onBack={handleBack} />
      </main>
      <Footer />
    </div>
  );
}
