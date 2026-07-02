import { useState } from "react";
import { clearAuthToken } from "../utils/authStorage";
import { navigateTo } from "../utils/navigation";
import AdminNavbar from "../components/layout/AdminNavbar";

interface Voluntario {
    id: string;
    userId: string;
    participantName: string;
    activity: string;
    date: string;
    time: string;
}

// Dados mockados — substituir por GET /api/voluntarios
const MOCK_VOLUNTARIOS: Voluntario[] = [
    {
        id: "1",
        userId: "user-001",
        participantName: "Maria Silva",
        activity: "Educação Infantil",
        date: "Segunda a Quinta",
        time: "09:00 - 12:00",
    },
    {
        id: "2",
        userId: "user-002",
        participantName: "João Santos",
        activity: "Atividades Recreativas",
        date: "Terça e Quinta",
        time: "14:00 - 17:00",
    },
    {
        id: "3",
        userId: "user-003",
        participantName: "Ana Costa",
        activity: "Suporte Administrativo",
        date: "Segunda a Sexta",
        time: "08:00 - 14:00",
    },
];

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline gap-3">
            <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-wide text-slate-400">
                {label}
            </span>
            <span className="text-sm font-semibold text-slate-700">{value}</span>
        </div>
    );
}

export default function VoluntariosPage() {
    const [voluntarios, setVoluntarios] =
        useState<Voluntario[]>(MOCK_VOLUNTARIOS);
    const [processed, setProcessed] = useState<Voluntario[]>([]);

    // IDs marcados para remoção (staged)
    const [stagedForRemoval, setStagedForRemoval] = useState<Set<string>>(
        new Set(),
    );
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [removeError, setRemoveError] = useState(false);
    // Estado de loading/erro por item ao reverter
    const [revertLoading, setRevertLoading] = useState<Set<string>>(new Set());
    const [revertError, setRevertError] = useState<Set<string>>(new Set());

    const handleToggleRemoval = (id: string) => {
        setStagedForRemoval((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleConfirmarRemocoes = async () => {
        setRemoving(true);
        setRemoveError(false);
        try {
            // TODO: substituir pelo DELETE real
            // await Promise.all(
            //   [...stagedForRemoval].map((id) =>
            //     fetch(`/api/voluntarios/${id}`, { method: 'DELETE' })
            //   )
            // );
            await new Promise((r) => setTimeout(r, 800));

            const removidos = voluntarios.filter((v) =>
                stagedForRemoval.has(v.id),
            );
            setVoluntarios((curr) =>
                curr.filter((v) => !stagedForRemoval.has(v.id)),
            );
            setProcessed((prev) => [...removidos, ...prev]);
            setStagedForRemoval(new Set());
            setConfirmModalOpen(false);
        } catch {
            setRemoveError(true);
        } finally {
            setRemoving(false);
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
            // await fetch(`/api/voluntarios/${id}/remocao`, { method: 'DELETE' });
            await new Promise((r) => setTimeout(r, 600));

            const item = processed.find((p) => p.id === id);
            if (!item) return;
            setVoluntarios((curr) => [item, ...curr]);
            setProcessed((prev) => prev.filter((p) => p.id !== id));
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
        navigateTo("/login");
    };

    const stagedCount = stagedForRemoval.size;
    const stagedItems = voluntarios.filter((v) => stagedForRemoval.has(v.id));

    return (
        <div className="min-h-screen bg-stone-50">
            <AdminNavbar
                activeTab="voluntarios"
                onTabSelect={() => { navigateTo("/gerenciamento"); }}
                onLogout={handleLogout}
                onPublicPage={() => navigateTo("/")}
            />

            <section className="px-5 py-12 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    {/* Cabeçalho */}
                    <div className="mb-8">
                        <button
                            type="button"
                            onClick={() => navigateTo("/gerenciamento")}
                            className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors hover:text-emerald-700"
                        >
                            ← Voltar ao painel
                        </button>
                        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                            Voluntários
                        </p>
                        <h1 className="mt-1 text-3xl font-black text-slate-950">
                            Lista de voluntários
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Selecione os voluntários que deseja remover e
                            confirme as alterações de uma vez.
                        </p>
                    </div>

                    {/* Banner de remoções pendentes */}
                    {stagedCount > 0 && (
                        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white px-6 py-4 text-black shadow-lg sm:flex-row sm:items-center sm:justify-between border border-slate-300">
                            <p className="text-sm font-semibold">
                                <span className="font-black">{stagedCount}</span>{" "}
                                {stagedCount === 1
                                    ? "voluntário marcado para remoção"
                                    : "voluntários marcados para remoção"}
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setStagedForRemoval(new Set())
                                    }
                                    className="text-sm font-semibold text-slate-400 transition-colors hover:text-slate-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmModalOpen(true)}
                                    className="rounded-xl bg-red-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-400"
                                >
                                    Confirmar remoções
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Lista vazia */}
                    {voluntarios.length === 0 ? (
                        <div className="rounded-3xl bg-white p-14 text-center shadow-sm ring-1 ring-slate-200">
                            <p className="text-xl font-black text-slate-300">
                                Nenhum voluntário cadastrado
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                                Os voluntários removidos não aparecerão mais na
                                lista.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {voluntarios.map((voluntario) => {
                                const isStaged = stagedForRemoval.has(
                                    voluntario.id,
                                );
                                return (
                                    <div
                                        key={voluntario.id}
                                        className={`rounded-3xl p-6 shadow-sm ring-1 transition-all ${
                                            isStaged
                                                ? "bg-red-50/50 ring-red-300 shadow-md"
                                                : "bg-white ring-slate-200 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h2 className="text-xl font-black text-slate-950">
                                                        {
                                                            voluntario.participantName
                                                        }
                                                    </h2>
                                                    {isStaged && (
                                                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                                                            Marcado para remover
                                                        </span>
                                                    )}
                                                    <span className="ml-auto rounded-full border border-emerald-300 bg-emerald-50 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                                        {voluntario.activity}
                                                    </span>
                                                </div>
                                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                    <InfoRow
                                                        label="Dias"
                                                        value={voluntario.date}
                                                    />
                                                    <InfoRow
                                                        label="Horário"
                                                        value={voluntario.time}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleRemoval(
                                                            voluntario.id,
                                                        )
                                                    }
                                                    className={`rounded-2xl border px-6 py-2.5 text-sm font-bold transition-all ${
                                                        isStaged
                                                            ? "border-red-500 bg-red-600 text-white ring-2 ring-red-500 ring-offset-2 hover:bg-red-700"
                                                            : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                                    }`}
                                                >
                                                    {isStaged
                                                        ? "✗ Desmarcar"
                                                        : "Remover"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal de confirmação de remoções */}
            {confirmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
                        <h2 className="text-xl font-black text-slate-950">
                            Confirmar remoções
                        </h2>
                        <p className="mt-3 text-sm text-slate-600">
                            Os seguintes voluntários serão removidos:
                        </p>

                        <ul className="mt-4 space-y-2.5">
                            {stagedItems.map((v) => (
                                <li
                                    key={v.id}
                                    className="flex items-center gap-2.5 text-sm"
                                >
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                                    <span className="font-semibold text-slate-800">
                                        {v.participantName}
                                    </span>
                                    <span className="text-slate-400">
                                        — {v.activity}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {removeError && (
                            <p className="mt-4 text-xs font-semibold text-red-600">
                                Erro ao remover. Verifique sua conexão e tente
                                novamente.
                            </p>
                        )}

                        <p className="mt-4 text-xs text-slate-400">
                            Esta ação pode ser desfeita enquanto você permanecer
                            nesta tela.
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setConfirmModalOpen(false)}
                                disabled={removing}
                                className="rounded-2xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmarRemocoes}
                                disabled={removing}
                                className="rounded-2xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {removing
                                    ? "Removendo..."
                                    : `Remover ${stagedCount} ${stagedCount === 1 ? "voluntário" : "voluntários"}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Histórico de removidos */}
            {processed.length > 0 && (
                <section className="px-5 py-5 lg:px-8">
                    <div className="mx-auto max-w-5xl">
                        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                            Histórico de voluntários removidos
                        </p>
                        <div className="grid gap-3">
                            {processed.map((p) => (
                                <div
                                    key={p.id}
                                    className="rounded-3xl bg-red-50/40 p-5 ring-1 ring-red-200 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-black text-slate-950">
                                                {p.participantName}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {p.activity} · {p.date} ·{" "}
                                                {p.time}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="rounded-full bg-red-100 px-4 py-1.5 text-xs font-bold text-red-700">
                                                ✗ Removido
                                            </span>
                                            <div className="flex flex-col items-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReverter(p.id)
                                                    }
                                                    disabled={revertLoading.has(p.id)}
                                                    className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {revertLoading.has(p.id)
                                                        ? "Revertendo..."
                                                        : "Reverter"}
                                                </button>
                                                {revertError.has(p.id) && (
                                                    <p className="text-xs font-semibold text-red-500">
                                                        Erro ao reverter
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}