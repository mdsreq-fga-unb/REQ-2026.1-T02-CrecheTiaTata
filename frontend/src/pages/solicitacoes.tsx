import { useState, useEffect } from 'react';
import { clearAuthToken } from '../utils/authStorage';
import { navigateTo } from '../utils/navigation';
import AdminNavbar from '../components/layout/AdminNavbar';

interface Solicitacao {
  id: string;
  userId: string;
  participantName: string;
  activity: string;
  date: string;
  time: string;
}

type AcaoStatus = 'aceito' | 'recusado';

interface AcaoState {
  status: AcaoStatus | null;
  loading: boolean;
  error: boolean;
}

// Dados mockados para teste enqt n conceta no back
const MOCK_SOLICITACOES: Solicitacao[] = [
  {
    id: '1',
    userId: 'user-001',
    participantName: 'Maria Silva',
    activity: 'Educação Infantil',
    date: 'Segunda a Quinta',
    time: '09:00 - 12:00',
  },
  {
    id: '2',
    userId: 'user-002',
    participantName: 'João Santos',
    activity: 'Atividades Recreativas',
    date: 'Terça e Quinta',
    time: '14:00 - 17:00',
  },
  {
    id: '3',
    userId: 'user-003',
    participantName: 'Ana Costa',
    activity: 'Suporte Administrativo',
    date: 'Segunda a Sexta',
    time: '08:00 - 14:00',
  },
];

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-1/3 rounded-full bg-slate-200" />
          <div className="h-3 w-1/2 rounded-full bg-slate-100" />
          <div className="h-3 w-2/5 rounded-full bg-slate-100" />
          <div className="h-3 w-1/4 rounded-full bg-slate-100" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-20 rounded-2xl bg-slate-200" />
          <div className="h-10 w-20 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="w-16 shrink-0 text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-700">{value}</span>
    </div>
  );
}

export default function SolicitacoesVoluntariosPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [acoes, setAcoes] = useState<Record<string, AcaoState>>({});

  useEffect(() => {
    // mock de carregamento com delay pra ver como fica 
    const timer = setTimeout(() => {
      setSolicitacoes(MOCK_SOLICITACOES);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleAcao = (id: string, acao: 'aceitar' | 'recusar') => {
    setAcoes((prev) => ({ ...prev, [id]: { status: null, loading: true, error: false } }));
    
    // Simular delay de carregar requisição
    setTimeout(() => {
      setAcoes((prev) => ({
        ...prev,
        [id]: { status: acao === 'aceitar' ? 'aceito' : 'recusado', loading: false, error: false },
      }));
    }, 600);
  };
  const handleReverter = (id: string) => {
    setAcoes((prev) => {
      const novoAcoes = { ...prev };
      delete novoAcoes[id];
      return novoAcoes;
    });
  };
  const handleLogout = () => {
    clearAuthToken();
    navigateTo('/login');
  };

  const pendentes = solicitacoes.filter((s) => !acoes[s.id]?.status);
  const processadas = solicitacoes.filter((s) => acoes[s.id]?.status);

  return (
    <div className="min-h-screen bg-stone-50">
      <AdminNavbar
        activeTab="voluntarios"
        onTabSelect={(tab) => {
          navigateTo('/gerenciamento');
        }}
        onLogout={handleLogout}
        onPublicPage={() => navigateTo('/')}
      />

      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">

          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigateTo('/gerenciamento')}
              className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors hover:text-emerald-700"
            >
              ← Voltar ao painel
            </button>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Voluntários</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Solicitações</h1>
            <p className="mt-2 text-slate-500">
              Revise e gerencie as solicitações de novos voluntários.
            </p>
          </div>

          {/* Carregamento */}
          {loading && (
            <div className="grid gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* Erro de requisição */}
          {!loading && fetchError && (
            <div className="rounded-3xl bg-red-50 p-10 text-center ring-1 ring-red-200">
              <p className="text-lg font-bold text-red-700">
                Não foi possível carregar as solicitações.
              </p>
              <p className="mt-1 text-sm text-red-500">Verifique sua conexão e tente novamente.</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Vazio */}
          {!loading && !fetchError && solicitacoes.length === 0 && (
            <div className="rounded-3xl bg-white p-14 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-xl font-black text-slate-300">Nenhuma solicitação pendente</p>
              <p className="mt-2 text-sm text-slate-400">Novas solicitações aparecerão aqui.</p>
            </div>
          )}

          {/* Lista de pendentes */}
          {!loading && !fetchError && pendentes.length > 0 && (
            <div className="grid gap-4">
              {pendentes.map((s) => {
                const acao = acoes[s.id];
                return (
                  <div
                    key={s.id}
                    className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      {/* Informações */}
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-950">{s.participantName}</h3>
                        <div className="mt-3 grid gap-2">
                          <InfoRow label="Atividade" value={s.activity} />
                          <InfoRow label="Dias" value={s.date} />
                          <InfoRow label="Horário" value={s.time} />
                        </div>
                        {acao?.error && (
                          <p className="mt-3 text-xs font-semibold text-red-500">
                            Erro ao processar. Tente novamente.
                          </p>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                        <button
                          type="button"
                          disabled={acao?.loading}
                          onClick={() => handleAcao(s.id, 'aceitar')}
                          className="rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {acao?.loading ? 'Aguarde...' : 'Aceitar'}
                        </button>
                        <button
                          type="button"
                          disabled={acao?.loading}
                          onClick={() => handleAcao(s.id, 'recusar')}
                          className="rounded-2xl border border-red-200 px-6 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {acao?.loading ? 'Aguarde...' : 'Recusar'}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* historico */}
          {!loading && !fetchError && processadas.length > 0 && (
            <div className="mt-10">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                Processadas nesta sessão
              </p>
              <div className="grid gap-3">
                {processadas.map((s) => {
                  const acao = acoes[s.id]!;
                  const aceito = acao.status === 'aceito';
                  return (
                    <div
                      key={s.id}
                      className={`rounded-3xl p-5 ring-1 transition-all ${
                        aceito
                          ? 'bg-emerald-50 ring-emerald-200'
                          : 'bg-red-50/40 ring-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-black text-slate-950">{s.participantName}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {s.activity} · {s.date} · {s.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                              aceito
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {aceito ? '✓ Aceito' : '✗ Recusado'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleReverter(s.id)}
                            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                          >
                            Reverter
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}