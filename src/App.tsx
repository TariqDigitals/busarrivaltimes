import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AlarmsPage } from './pages/AlarmsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import BlogAdminPage from './pages/BlogAdminPage';
import BlogEditorPage from './pages/BlogEditorPage';
import BlogLoginPage from './pages/BlogLoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/alarms" element={<AlarmsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/login" element={<BlogLoginPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/blog/admin" element={<BlogAdminPage />} />
        <Route path="/blog/admin/:id" element={<BlogEditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
