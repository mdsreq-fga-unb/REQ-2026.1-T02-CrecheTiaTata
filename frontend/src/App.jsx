import { useEffect, useState } from 'react';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import CtaSection from './components/sections/CtaSection';
import ComoAjudarPage from './pages/ComoAjudarPage';
import ContatoPage from './pages/ContatoPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import SobrePage from './pages/SobrePage';
// NOVO:
import AtualizarPerfilPage from './pages/AtualizarPerfilPage';

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
  const isLoginPage = path === '/login';
  const isPasswordRecoveryPage = path === '/recuperar-senha';

  const isPerfilPage = path === '/perfil';
  const isHomePage = !isSobrePage && !isComoAjudarPage && !isContatoPage && !isLoginPage && !isPasswordRecoveryPage && !isPerfilPage;

  return (
    <main className="min-h-screen bg-stone-50 font-sans text-slate-900">
      {!isLoginPage && !isPasswordRecoveryPage && <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
      {isSobrePage && <SobrePage />}
      {isComoAjudarPage && <ComoAjudarPage />}
      {isContatoPage && <ContatoPage />}
      {isLoginPage && <LoginPage />}
      {isPasswordRecoveryPage && <PasswordRecoveryPage />}
      
      {isPerfilPage && <AtualizarPerfilPage />}

      {isHomePage && <HomePage />}
      {isHomePage && <CtaSection />}
      {!isSobrePage && !isLoginPage && !isPasswordRecoveryPage && <Footer />}
    </main>
  );
}

export default App;