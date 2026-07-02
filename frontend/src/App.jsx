import { useEffect, useState } from 'react';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import CtaSection from './components/sections/CtaSection';
import ComoAjudarPage from './pages/ComoAjudarPage';
import ContatoPage from './pages/ContatoPage';
import GerenciamentoPage from './pages/gerenciamento';
import SolicitacoesPage from './pages/solicitacoes';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import SobrePage from './pages/SobrePage';
import { isAuthTokenValid } from './utils/authStorage';
import AtualizarPerfilPage from './pages/AtualizarPerfilPage';
import ListarDoacoesPage from './pages/ListarDoacoesPage';

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
  const isGerenciamentoPage = path === '/gerenciamento';
  const isSolicitacoesPage = path === '/solicitacoes';
  const isDoacoesPage = path === '/doacoes';

  const isHomePage = !isSobrePage && !isComoAjudarPage && !isContatoPage && !isLoginPage && !isPasswordRecoveryPage && !isPerfilPage && !isGerenciamentoPage && !isSolicitacoesPage && !isDoacoesPage;

  return (
    <main className="min-h-screen bg-stone-50 font-sans text-slate-900">
      {!isLoginPage && !isPasswordRecoveryPage && !isGerenciamentoPage && !isSolicitacoesPage && <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
      {isSobrePage && <SobrePage />}
      {isComoAjudarPage && <ComoAjudarPage />}
      {isContatoPage && <ContatoPage />}
      {isLoginPage && <LoginPage />}
      {isPasswordRecoveryPage && <PasswordRecoveryPage />}
      {/* {isGerenciamentoPage && (isAuthTokenValid() ? <GerenciamentoPage /> : <LoginPage />)}   Pra qnd tiver com token no login */}
      {isGerenciamentoPage && <GerenciamentoPage />}                                              {/* So pra teste */}
      {/* {isSolicitacoesPage && (isAuthTokenValid() ? <SolicitacoesPage /> : <LoginPage />)}     Pra qnd tiver com token no login*/}
      {isSolicitacoesPage && <SolicitacoesPage />}                                                {/* So pra teste */}

      {isPerfilPage && (isAuthTokenValid() ? <AtualizarPerfilPage /> : <LoginPage />)}
      {isDoacoesPage && <ListarDoacoesPage />}

      {isHomePage && <HomePage />}
      {isHomePage && <CtaSection />}
      {!isSobrePage && !isLoginPage && !isPasswordRecoveryPage && !isGerenciamentoPage && !isSolicitacoesPage && <Footer />}
    </main>
  );
}

export default App;