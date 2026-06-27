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
            <span className="text-sm font-semibold text-slate-700">
                {value}
            </span>
        </div>
    );
}

export default function VoluntariosPage() {
    const [voluntarios, setVoluntarios] =
        useState<Voluntario[]>(MOCK_VOLUNTARIOS);
    const [voluntarioToRemove, setVoluntarioToRemove] =
        useState<Voluntario | null>(null);
    const [processed, setProcessed] = useState<Voluntario[]>([]);

    const handleRemove = (id: string) => {
        const voluntario = voluntarios.find((item) => item.id === id);
        if (!voluntario) return;
        setVoluntarioToRemove(voluntario);
    };

    const confirmRemove = () => {
        if (!voluntarioToRemove) return;
        // remove da lista
        setVoluntarios((current) =>
            current.filter((item) => item.id !== voluntarioToRemove.id),
        );
        // add no historico
        setProcessed((prev) => [voluntarioToRemove!, ...prev]);
        setVoluntarioToRemove(null);
    };

    const cancelRemove = () => setVoluntarioToRemove(null);

    const handleReverter = (id: string) => {
        const item = processed.find((p) => p.id === id);
        if (!item) return;
        // volta pra lista
        setVoluntarios((current) => [item, ...current]);
        // tira do historico
        setProcessed((prev) => prev.filter((p) => p.id !== id));
    };

    const handleLogout = () => {
        clearAuthToken();
        navigateTo("/login");
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <AdminNavbar
                activeTab="voluntarios"
                onTabSelect={() => {
                    navigateTo("/gerenciamento");
                }}
                onLogout={handleLogout}
                onPublicPage={() => navigateTo("/")}
            />

            <section className="px-5 py-12 lg:px-8">
                <div className="mx-auto max-w-5xl">
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
                            Veja todos os voluntários cadastrados e remova os
                            registros que não forem mais necessários.
                        </p>
                    </div>

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
                            {voluntarios.map((voluntario) => (
                                <div
                                    key={voluntario.id}
                                    className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-4">
                                                <h2 className="text-xl font-black text-slate-950">
                                                    {voluntario.participantName}
                                                </h2>
                                                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
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
                                                    handleRemove(voluntario.id)
                                                }
                                                className="rounded-2xl border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-bold text-red-700 transition-colors hover:bg-red-100"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {voluntarioToRemove && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
                        <h2 className="text-xl font-black text-slate-950">
                            Remover voluntário
                        </h2>
                        <p className="mt-3 text-sm text-slate-600">
                            Tem certeza que deseja remover{" "}
                            <strong>
                                {voluntarioToRemove.participantName}
                            </strong>
                            ? Essa ação pode ser desfeita enquanto você
                            permanecer nesta tela.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={cancelRemove}
                                className="rounded-2xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmRemove}
                                className="rounded-2xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <section className="px-5 py-5 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8">
                        {processed.length > 0 && (
                            <div className="">
                                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Histórico de voluntários removidos
                                </p>
                                <div className="grid gap-3">
                                    {processed.map((p) => (
                                        <div
                                            key={p.id}
                                            className="rounded-3xl p-5 ring-1 transition-all bg-red-50/40 ring-red-200"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-black text-slate-950">
                                                        {p.participantName}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {p.activity} · {p.date}{" "}
                                                        · {p.time}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="rounded-full px-4 py-1.5 text-xs font-bold bg-red-100 text-red-700">
                                                        ✗ Removido
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleReverter(p.id)
                                                        }
                                                        className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                                                    >
                                                        Reverter
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
