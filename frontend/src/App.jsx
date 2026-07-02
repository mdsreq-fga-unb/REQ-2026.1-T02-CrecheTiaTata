import { useEffect, useState } from 'react';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import CtaSection from './components/sections/CtaSection';
import { isAuthTokenValid } from './utils/authStorage';
import AtualizarPerfilPage from './pages/AtualizarPerfilPage';
import ComoAjudarPage from './pages/ComoAjudarPage';
import ContatoPage from './pages/ContatoPage';
import DoarPage from './pages/DoarPage';
import GerenciamentoPage from './pages/gerenciamento';
import HomePage from './pages/HomePage';
import ListarDoacoesPage from './pages/ListarDoacoesPage';
import ListarEntregasPage from './pages/ListarEntregasPage';
import ListarSolicitacoesPage from './pages/ListarSolicitacoesPage';
import LoginPage from './pages/LoginPage';
import NecessidadesPage from './pages/necessidades';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import SobrePage from './pages/SobrePage';
import SolicitacoesPage from './pages/solicitacoes';
import VoluntariosPage from './pages/voluntarios';

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
  const isSolicitacoesApoioPage = path === '/solicitacoes-apoio';
  const isVoluntariosPage = path === '/voluntarios';
  const isNecessidadesPage = path === '/necessidades';
  const isDoarPage = path === '/doar';
  const isDoacoesPage = path === '/doacoes';
  const isEntregasPage = path === '/entregas';

  const isAdminPage =
    isGerenciamentoPage ||
    isSolicitacoesPage ||
    isSolicitacoesApoioPage ||
    isVoluntariosPage;

  const isHomePage =
    !isSobrePage &&
    !isComoAjudarPage &&
    !isContatoPage &&
    !isLoginPage &&
    !isPasswordRecoveryPage &&
    !isPerfilPage &&
    !isAdminPage &&
    !isNecessidadesPage &&
    !isDoarPage &&
    !isDoacoesPage &&
    !isEntregasPage;

  return (
    <main className="min-h-screen bg-stone-50 font-sans text-slate-900">
      {!isLoginPage && !isPasswordRecoveryPage && !isAdminPage && (
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}

      {isSobrePage && <SobrePage />}
      {isComoAjudarPage && <ComoAjudarPage />}
      {isContatoPage && <ContatoPage />}
      {isLoginPage && <LoginPage />}
      {isPasswordRecoveryPage && <PasswordRecoveryPage />}
      {isGerenciamentoPage && <GerenciamentoPage />}
      {isSolicitacoesPage && <SolicitacoesPage />}
      {isSolicitacoesApoioPage && <ListarSolicitacoesPage />}
      {isVoluntariosPage && <VoluntariosPage />}
      {isNecessidadesPage && <NecessidadesPage />}
      {isDoarPage && <DoarPage />}
      {isDoacoesPage && <ListarDoacoesPage />}
      {isEntregasPage && <ListarEntregasPage />}
      {isPerfilPage &&
        (isAuthTokenValid() ? <AtualizarPerfilPage /> : <LoginPage />)}
      {isHomePage && <HomePage />}
      {isHomePage && <CtaSection />}

      {!isSobrePage &&
        !isLoginPage &&
        !isPasswordRecoveryPage &&
        !isAdminPage && <Footer />}
    </main>
  );
}

export default App;
