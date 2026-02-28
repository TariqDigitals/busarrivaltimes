import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ContactView } from '../views/ContactView';
import { useTheme } from '../hooks/useTheme';
import { useSEO } from '../hooks/useSEO';

export function ContactPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useSEO({
    title: 'Contact Us - Bus Arrival Times Singapore',
    description: 'Get in touch with Bus Arrival Times. We\'re here to help with any questions, feedback, or support requests about Singapore bus tracking.',
  });

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="pb-6">
        <ContactView onBack={handleBack} />
      </main>
      <Footer />
    </div>
  );
}
