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

type DecisaoStaged = 'aceitar' | 'recusar';
type AcaoStatus = 'aceito' | 'recusado';

interface ProcessedState {
    status: AcaoStatus;
}

// Dados mockados — substituir por GET /api/voluntarios/solicitacoes
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

    // Decisões staged: cada id mapeia para 'aceitar' ou 'recusar'
    const [staged, setStaged] = useState<Record<string, DecisaoStaged>>({});
    // Itens já processados (após confirmar)
    const [processed, setProcessed] = useState<Record<string, ProcessedState>>({});
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [confirmError, setConfirmError] = useState(false);
    // Estado de loading/erro por item ao reverter
    const [revertLoading, setRevertLoading] = useState<Set<string>>(new Set());
    const [revertError, setRevertError] = useState<Set<string>>(new Set());

    useEffect(() => {
        // TODO: substituir por fetch('/api/voluntarios/solicitacoes')
        const timer = setTimeout(() => {
            setSolicitacoes(MOCK_SOLICITACOES);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Clicar no mesmo botão duas vezes remove a decisão staged (toggle)
    const handleStage = (id: string, decisao: DecisaoStaged) => {
        setStaged((prev) => {
            if (prev[id] === decisao) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: decisao };
        });
    };

    const handleConfirmarAlteracoes = async () => {
        setConfirming(true);
        setConfirmError(false);
        try {
            // TODO: substituir pelo PATCH real
            // await Promise.all(
            //   Object.entries(staged).map(([id, decisao]) =>
            //     fetch(`/api/voluntarios/solicitacoes/${id}`, {
            //       method: 'PATCH',
            //       headers: { 'Content-Type': 'application/json' },
            //       body: JSON.stringify({ acao: decisao }),
            //     })
            //   )
            // );
            await new Promise((r) => setTimeout(r, 800));

            setProcessed((prev) => {
                const novo = { ...prev };
                Object.entries(staged).forEach(([id, decisao]) => {
                    novo[id] = {
                        status: decisao === 'aceitar' ? 'aceito' : 'recusado',
                    };
                });
                return novo;
            });
            setStaged({});
            setConfirmModalOpen(false);
        } catch {
            setConfirmError(true);
        } finally {
            setConfirming(false);
        }
    };

    const handleReverter = async (id: string) => {
        setRevertLoading((prev) => new Set(prev).add(id));
        setRevertError((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
        try {
            // TODO: substituir pela chamada real ao back
            // await fetch(`/api/voluntarios/solicitacoes/${id}/decisao`, {
            //   method: 'DELETE',
            // });
            await new Promise((r) => setTimeout(r, 600));

            setProcessed((prev) => {
                const { [id]: _, ...rest } = prev;
                return rest;
            });
        } catch {
            setRevertError((prev) => new Set(prev).add(id));
        } finally {
            setRevertLoading((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    const handleLogout = () => {
        clearAuthToken();
        navigateTo('/login');
    };

    const pendentes = solicitacoes.filter((s) => !processed[s.id]);
    const processadas = solicitacoes.filter((s) => processed[s.id]);
    const stagedCount = Object.keys(staged).length;
    const stagedItems = solicitacoes.filter((s) => staged[s.id]);

    return (
        <div className="min-h-screen bg-stone-50">
            <AdminNavbar
                activeTab="voluntarios"
                onTabSelect={() => { navigateTo('/gerenciamento'); }}
                onLogout={handleLogout}
                onPublicPage={() => navigateTo('/')}
            />

            <section className="px-5 py-12 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Cabeçalho */}
                    <div className="mb-8">
                        <button
                            type="button"
                            onClick={() => navigateTo('/gerenciamento')}
                            className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors hover:text-emerald-700"
                        >
                            ← Voltar ao painel
                        </button>
                        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                            Voluntários
                        </p>
                        <h1 className="mt-1 text-3xl font-black text-slate-950">
                            Solicitações
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Marque cada solicitação como aceita ou recusada e
                            confirme todas as alterações de uma vez.
                        </p>
                    </div>

                    {/* Banner de alterações pendentes */}
                    {stagedCount > 0 && (
                        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white px-6 py-4 text-black shadow-lg sm:flex-row sm:items-center sm:justify-between border border-slate-300">
                            <div>
                                <p className="text-sm font-semibold">
                                    <span className="font-black">{stagedCount}</span>{' '}
                                    {stagedCount === 1
                                        ? 'alteração pendente'
                                        : 'alterações pendentes'}
                                </p>
                                {confirmError && (
                                    <p className="mt-1 text-xs font-semibold text-red-400">
                                        Erro ao salvar. Tente novamente.
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStaged({})}
                                    className="text-sm font-semibold text-slate-400 transition-colors hover:text-slate-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmModalOpen(true)}
                                    className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-400"
                                >
                                    Confirmar alterações
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Carregamento */}
                    {loading && (
                        <div className="grid gap-4">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    )}

                    {/* Erro de fetch */}
                    {!loading && fetchError && (
                        <div className="rounded-3xl bg-red-50 p-10 text-center ring-1 ring-red-200">
                            <p className="text-lg font-bold text-red-700">
                                Não foi possível carregar as solicitações.
                            </p>
                            <p className="mt-1 text-sm text-red-500">
                                Verifique sua conexão e tente novamente.
                            </p>
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
                            <p className="text-xl font-black text-slate-300">
                                Nenhuma solicitação pendente
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                                Novas solicitações aparecerão aqui.
                            </p>
                        </div>
                    )}

                    {/* Lista de pendentes */}
                    {!loading && !fetchError && pendentes.length > 0 && (
                        <div className="grid gap-4">
                            {pendentes.map((s) => {
                                const decisao = staged[s.id];
                                const isAceitar = decisao === 'aceitar';
                                const isRecusar = decisao === 'recusar';

                                return (
                                    <div
                                        key={s.id}
                                        className={`rounded-3xl p-6 shadow-sm ring-1 transition-all ${
                                            isAceitar
                                                ? 'bg-emerald-50 ring-emerald-300 shadow-md'
                                                : isRecusar
                                                ? 'bg-red-50/50 ring-red-300 shadow-md'
                                                : 'bg-white ring-slate-200 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            {/* Informações */}
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-xl font-black text-slate-950">
                                                        {s.participantName}
                                                    </h3>
                                                    {isAceitar && (
                                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                                            Marcado para aceitar
                                                        </span>
                                                    )}
                                                    {isRecusar && (
                                                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                                                            Marcado para recusar
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-3 grid gap-2">
                                                    <InfoRow label="Atividade" value={s.activity} />
                                                    <InfoRow label="Dias" value={s.date} />
                                                    <InfoRow label="Horário" value={s.time} />
                                                </div>
                                            </div>

                                            {/* Ações */}
                                            <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                                                <button
                                                    type="button"
                                                    onClick={() => handleStage(s.id, 'aceitar')}
                                                    className={`rounded-2xl px-6 py-2.5 text-sm font-bold transition-all ${
                                                        isAceitar
                                                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-500 ring-offset-2'
                                                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                    }`}
                                                >
                                                    {isAceitar ? '✓ Aceitar' : 'Aceitar'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleStage(s.id, 'recusar')}
                                                    className={`rounded-2xl border px-6 py-2.5 text-sm font-bold transition-all ${
                                                        isRecusar
                                                            ? 'border-red-500 bg-red-600 text-white ring-2 ring-red-500 ring-offset-2'
                                                            : 'border-red-200 text-red-600 hover:bg-red-50'
                                                    }`}
                                                >
                                                    {isRecusar ? '✗ Recusar' : 'Recusar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Histórico */}
                    {!loading && !fetchError && processadas.length > 0 && (
                        <div className="mt-10">
                            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                                Histórico de solicitações
                            </p>
                            <div className="grid gap-3">
                                {processadas.map((s) => {
                                    const state = processed[s.id]!;
                                    const aceito = state.status === 'aceito';
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
                                                    <p className="font-black text-slate-950">
                                                        {s.participantName}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {s.activity} · {s.date} · {s.time}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
                                                    <span
                                                        className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                                                            aceito
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {aceito ? '✓ Aceito' : '✗ Recusado'}
                                                    </span>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleReverter(s.id)}
                                                            disabled={revertLoading.has(s.id)}
                                                            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {revertLoading.has(s.id)
                                                                ? 'Revertendo...'
                                                                : 'Reverter'}
                                                        </button>
                                                        {revertError.has(s.id) && (
                                                            <p className="text-xs font-semibold text-red-500">
                                                                Erro ao reverter
                                                            </p>
                                                        )}
                                                    </div>
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

            {/* Modal de confirmação de alterações */}
            {confirmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
                        <h2 className="text-xl font-black text-slate-950">
                            Confirmar alterações
                        </h2>
                        <p className="mt-3 text-sm text-slate-600">
                            As seguintes decisões serão aplicadas:
                        </p>

                        <ul className="mt-4 space-y-2.5">
                            {stagedItems.map((s) => {
                                const decisao = staged[s.id];
                                const aceitar = decisao === 'aceitar';
                                return (
                                    <li key={s.id} className="flex items-center gap-2.5 text-sm">
                                        <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                                aceitar ? 'bg-emerald-500' : 'bg-red-500'
                                            }`}
                                        />
                                        <span className="font-semibold text-slate-800">
                                            {s.participantName}
                                        </span>
                                        <span
                                            className={`ml-auto text-xs font-bold ${
                                                aceitar ? 'text-emerald-600' : 'text-red-600'
                                            }`}
                                        >
                                            {aceitar ? '✓ Aceitar' : '✗ Recusar'}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        {confirmError && (
                            <p className="mt-4 text-xs font-semibold text-red-600">
                                Erro ao salvar. Verifique sua conexão e tente novamente.
                            </p>
                        )}

                        <p className="mt-4 text-xs text-slate-400">
                            Esta ação pode ser desfeita enquanto você permanecer nesta tela.
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setConfirmModalOpen(false)}
                                disabled={confirming}
                                className="rounded-2xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmarAlteracoes}
                                disabled={confirming}
                                className="rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {confirming
                                    ? 'Confirmando...'
                                    : `Confirmar ${stagedCount} ${stagedCount === 1 ? 'alteração' : 'alterações'}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}