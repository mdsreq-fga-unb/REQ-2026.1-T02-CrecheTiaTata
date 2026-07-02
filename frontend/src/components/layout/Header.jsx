import { HeartIcon } from '../icons';
import { clearAuthToken, isAuthTokenValid } from '../../utils/authStorage';
import { navigateTo } from '../../utils/navigation';

export default function Header({ menuOpen, setMenuOpen }) {
  const isAuthenticated = isAuthTokenValid();
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    clearAuthToken();
    setMenuOpen(false);
    navigateTo('/login?modo=cadastro');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => navigateTo('/')}
          className="flex items-center gap-3 font-bold"
          aria-label="Ir para o início"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
            <HeartIcon className="h-5 w-5" />
          </span>
          <span className="text-lg sm:text-xl">Creche Tia Tata</span>
        </button>

        {/* MENU DESKTOP */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <a className="hover:text-emerald-700" href="/#inicio">Início</a>
          <button type="button" onClick={() => navigateTo('/como-ajudar')} className="hover:text-emerald-700">
            Como ajudar
          </button>
          
          <button type="button" onClick={() => navigateTo('/doacoes')} className="hover:text-emerald-700">
            Doações
          </button>
          <button type="button" onClick={() => navigateTo('/entregas')} className="hover:text-emerald-700">
            Entregas
          </button>

          <button type="button" onClick={() => navigateTo('/sobre')} className="hover:text-emerald-700">
            Sobre
          </button>
          <button type="button" onClick={() => navigateTo('/contato')} className="hover:text-emerald-700">
            Contato
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-8">
              <button type="button" onClick={() => navigateTo('/perfil')} className="hover:text-emerald-700">
                Meu Perfil
              </button>
              <button type="button" onClick={handleLogout} className="hover:text-emerald-700">
                Sair
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => navigateTo('/login?modo=cadastro')} className="hover:text-emerald-700">
              Entrar/Criar conta
            </button>
          )}
          
          <a
            href="/#ajudar"
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-white shadow-sm transition hover:bg-emerald-700"
          >
            Quero ajudar
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 md:hidden"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
        >
          Menu
        </button>
      </div>

      {/* MENU MOBILE (CELULAR) */}
      {menuOpen && (
        <nav className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-3 text-sm font-semibold text-slate-700">
            <a onClick={closeMenu} href="/#inicio">Início</a>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                navigateTo('/como-ajudar');
              }}
              className="text-left"
            >
              Como ajudar
            </button>
            
            <button
              type="button"
              onClick={() => {
                closeMenu();
                navigateTo('/doacoes');
              }}
              className="text-left"
            >
              Doações
            </button>

            <button
              type="button"
              onClick={() => {
                closeMenu();
                navigateTo('/sobre');
              }}
              className="text-left"
            >
              Sobre
            </button>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                navigateTo('/contato');
              }}
              className="text-left"
            >
              Contato
            </button>
            {isAuthenticated ? (
              <>
                <button type="button" onClick={() => {closeMenu();navigateTo('/perfil');}} 
                  className="text-left">
                  Meu Perfil
                </button>

                <button type="button" onClick={handleLogout} className="text-left">
                  Sair
                </button>
                
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  navigateTo('/login?modo=cadastro');
                }}
                className="text-left"
              >
                Entrar/Criar conta
              </button>
            )}
            <a
              onClick={closeMenu}
              href="/#ajudar"
              className="mt-2 rounded-xl bg-emerald-600 px-4 py-3 text-center text-white"
            >
              Quero ajudar
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}