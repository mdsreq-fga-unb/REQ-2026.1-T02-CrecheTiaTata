import { useEffect, useState } from 'react';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import CtaSection from './components/sections/CtaSection';
import ComoAjudarPage from './pages/ComoAjudarPage';
import ContatoPage from './pages/ContatoPage';
import HomePage from './pages/HomePage';
import SobrePage from './pages/SobrePage';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const isSobrePage = path === '/sobre';
  const isComoAjudarPage = path === '/como-ajudar';
  const isContatoPage = path === '/contato';
  const isHomePage = !isSobrePage && !isComoAjudarPage && !isContatoPage;

  return (
    <main className="min-h-screen bg-stone-50 font-sans text-slate-900">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {isSobrePage && <SobrePage />}
      {isComoAjudarPage && <ComoAjudarPage />}
      {isContatoPage && <ContatoPage />}
      {isHomePage && <HomePage />}
      {isHomePage && <CtaSection />}
      {!isSobrePage && <Footer />}
    </main>
  );
}

export default App;
