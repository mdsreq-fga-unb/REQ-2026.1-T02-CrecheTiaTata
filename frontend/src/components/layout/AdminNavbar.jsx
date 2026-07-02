import { useState } from 'react';
import { HeartIcon } from '../icons';

export default function AdminNavbar({ activeTab, onTabSelect, onLogout, onPublicPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { key: 'inicio',      label: 'Início' },
    { key: 'voluntarios', label: 'Voluntários' },
    { key: 'doacoes',     label: 'Doações' },
    { key: 'pedidos',     label: 'Pedidos' },
  ];

  const handleSelect = (key) => {
    onTabSelect(key);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 backdrop-blur">

      {/* Barra principal */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        <div className="flex items-center gap-3 font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
            <HeartIcon className="h-5 w-5" />
          </span>
          <span className="text-lg sm:text-xl">
            Painel Administrativo
          </span>
        </div>

        {/* Links — só aparece em desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleSelect(item.key)}
              className={`px-5 py-2.5 rounded text-sm font-medium transition-colors ${
                activeTab === item.key
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
              }`}
            >
              {item.label}
            </button>
          ))}

          <span className="mx-2 h-4 w-px bg-emerald-700" />

          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-white shadow-sm transition hover:bg-emerald-700"
          >
            Sair
          </button>
        </div>

        {/* Botão Menu — só aparece em mobile */}
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

      {/* Menu mobile */}
      {menuOpen && (
        <nav className="md:hidden border-t border-emerald-100 bg-white px-6 py-4">
          <div className="grid gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSelect(item.key)}
                className={`w-full text-left px-4 py-3 rounded text-sm font-medium transition-colors ${
                  activeTab === item.key
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="mt-2 border-t border-emerald-100 pt-3">
              <button
                type="button"
                onClick={onLogout}
                className="w-full text-left px-4 py-3 rounded text-sm font-semibold border border-emerald-600 text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </nav>
      )}

    </header>
  );
}