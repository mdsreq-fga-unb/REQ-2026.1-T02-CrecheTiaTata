import { useCallback, useEffect, useState } from 'react';
import AdminNavbar from '../components/layout/AdminNavbar';
import PublicarSolicitacaoModal from '../components/solicitacoes/PublicarSolicitacaoModal';
import { listarSolicitacoes } from '../services/solicitacoesService';
import { clearAuthToken } from '../utils/authStorage';
import { navigateTo } from '../utils/navigation';

const CATEGORIA_LABELS = {
  alimentacao: 'Alimentação',
  material: 'Material',
  voluntario: 'Voluntariado',
  financeiro: 'Financeiro',
  outro: 'Outro',
};

const STATUS_CONFIG = {
  pendente: {
    label: 'Pendente',
    className: 'bg-amber-100 text-amber-700',
  },
  em_andamento: {
    label: 'Em andamento',
    className: 'bg-blue-100 text-blue-700',
  },
  concluida: {
    label: 'Concluída',
    className: 'bg-emerald-100 text-emerald-700',
  },
};

export default function ListarSolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadSolicitacoes = useCallback(async ({ preserveItems = false } = {}) => {
    try {
      const data = await listarSolicitacoes();
      setSolicitacoes(data);
      setLoadError('');
    } catch (error) {
      setLoadError(error.message || 'Não foi possível carregar as solicitações.');
      if (!preserveItems) {
        setSolicitacoes([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    listarSolicitacoes()
      .then((data) => {
        if (!cancelled) {
          setSolicitacoes(data);
          setLoadError('');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setSolicitacoes([]);
          setLoadError(
            error.message || 'Não foi possível carregar as solicitações.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePublished = async (novaSolicitacao) => {
    if (novaSolicitacao) {
      setSolicitacoes((current) => [
        novaSolicitacao,
        ...current.filter((item) => item.id !== novaSolicitacao.id),
      ]);
    }

    setSuccessMessage('Solicitação publicada com sucesso.');
    await loadSolicitacoes({ preserveItems: true });
  };

  const handleLogout = () => {
    clearAuthToken();
    navigateTo('/login');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <AdminNavbar
        activeTab="pedidos"
        onTabSelect={() => navigateTo('/gerenciamento')}
        onLogout={handleLogout}
        onPublicPage={() => navigateTo('/necessidades')}
      />

      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigateTo('/gerenciamento')}
                className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors hover:text-emerald-700"
              >
                ← Voltar ao painel
              </button>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                Solicitações de apoio
              </p>
              <h1 className="mt-1 text-3xl font-black text-slate-950 sm:text-4xl">
                Necessidades publicadas
              </h1>
              <p className="mt-2 max-w-2xl text-slate-500">
                Cadastre e acompanhe as necessidades divulgadas para a comunidade.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSuccessMessage('');
                setIsOpen(true);
              }}
              className="shrink-0 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + Nova solicitação
            </button>
          </div>

          {successMessage && (
            <div
              role="status"
              className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700"
            >
              {successMessage}
            </div>
          )}

          {loadError && (
            <div
              role="alert"
              className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm font-semibold">{loadError}</span>
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  loadSolicitacoes();
                }}
                className="text-sm font-black underline underline-offset-2"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {isLoading ? (
            <div
              aria-label="Carregando solicitações"
              className="grid gap-4 sm:grid-cols-2"
            >
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-48 animate-pulse rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
                />
              ))}
            </div>
          ) : solicitacoes.length === 0 ? (
            <div className="rounded-3xl bg-white p-14 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-xl font-black text-slate-400">
                Nenhuma solicitação publicada
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Use o botão “Nova solicitação” para cadastrar a primeira.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {solicitacoes.map((solicitacao) => {
                const status = STATUS_CONFIG[solicitacao.status] ??
                  STATUS_CONFIG.pendente;

                return (
                  <article
                    key={solicitacao.id}
                    className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {CATEGORIA_LABELS[solicitacao.categoria] ??
                          solicitacao.categoria}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <h2 className="mt-5 text-xl font-black text-slate-950">
                      {solicitacao.titulo}
                    </h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                      {solicitacao.descricao}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {isOpen && (
        <PublicarSolicitacaoModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onPublished={handlePublished}
        />
      )}
    </div>
  );
}
