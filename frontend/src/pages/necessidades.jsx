import { useState, useEffect } from "react";
import { navigateTo } from "../utils/navigation";

// Mock substituído dps por GET /api/necessidades
const MOCK_NECESSIDADES = [
    {
        id: "1",
        nome: "Fraldas tamanho P",
        urgencia: "Alta",
        descricao:
            "Fraldas descartáveis para bebês de até 4 kg. Aceitamos qualquer marca.",
    },
    {
        id: "2",
        nome: "Leite em pó integral",
        urgencia: "Alta",
        descricao: "Latas de 400 g ou 800 g para crianças de 1 a 3 anos.",
    },
    {
        id: "3",
        nome: "Roupas infantis (0–2 anos)",
        urgencia: "Alta",
        descricao: "Roupas em bom estado: bodies, macacões, calças e blusas.",
    },
    {
        id: "4",
        nome: "Cadeiras para sala de aula",
        urgencia: "Média",
        descricao:
            "Cadeiras infantis para reposição das danificadas. Precisamos de pelo menos 10 unidades.",
    },
    {
        id: "5",
        nome: "Material escolar (lápis e borracha)",
        urgencia: "Média",
        descricao:
            "Lápis de cor, borrachas e apontadores para as turmas do maternal.",
    },
    {
        id: "6",
        nome: "Cobertores e mantas",
        urgencia: "Média",
        descricao:
            "Cobertores e mantas de tamanho infantil para o período do inverno.",
    },
    {
        id: "7",
        nome: "Brinquedos educativos",
        urgencia: "Baixa",
        descricao:
            "Quebra-cabeças, jogos de encaixe e blocos de montar para crianças de 2 a 5 anos.",
    },
    {
        id: "8",
        nome: "Livros infantis",
        urgencia: "Baixa",
        descricao:
            "Livros de histórias ilustradas para ampliar nossa pequena biblioteca.",
    },
    {
        id: "9",
        nome: "Sapatos infantis (tamanhos variados)",
        urgencia: "Baixa",
        descricao:
            "Sapatos, tênis ou sandálias em bom estado nos tamanhos 18 ao 28.",
    },
];

const URGENCIA_CONFIG = {
    Alta: {
        label: "Alta",
        badge: "bg-orange-100 text-orange-700",
        bar: "bg-orange-400",
    },
    Média: {
        label: "Média",
        badge: "bg-amber-100  text-amber-700",
        bar: "bg-amber-400",
    },
    Baixa: {
        label: "Baixa",
        badge: "bg-emerald-100 text-emerald-700",
        bar: "bg-emerald-400",
    },
};

const FILTROS = ["Todas", "Alta", "Média", "Baixa"];

function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-4">
                <div className="h-4 w-2/3 rounded-full bg-slate-200" />
                <div className="h-6 w-16 rounded-full bg-slate-100" />
            </div>
        </div>
    );
}

export default function NecessidadesPage() {
    const [necessidades, setNecessidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroAtivo, setFiltroAtivo] = useState("Todas");

    useEffect(() => {
        // Substituir por: fetch('/api/necessidades').then(r => r.json()).then(setNecessidades)
        const timer = setTimeout(() => {
            setNecessidades(MOCK_NECESSIDADES);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const listagem =
        filtroAtivo === "Todas"
            ? necessidades
            : necessidades.filter((n) => n.urgencia === filtroAtivo);

    const contadores = {
        Alta: necessidades.filter((n) => n.urgencia === "Alta").length,
        Média: necessidades.filter((n) => n.urgencia === "Média").length,
        Baixa: necessidades.filter((n) => n.urgencia === "Baixa").length,
    };

    return (
        <section className="min-h-screen bg-stone-50 px-5 py-12 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* ── Cabeçalho ── */}
                <div className="mb-10">
                    <button
                        type="button"
                        onClick={() => navigateTo("/")}
                        className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors hover:text-emerald-700"
                    >
                        ← Voltar ao início
                    </button>

                    <p className="text-sm font-bold uppercase tracking-wide text-orange-600">
                        Precisamos agora
                    </p>
                    <h1 className="mt-1 text-3xl font-black text-slate-950 sm:text-4xl">
                        Todas as solicitações
                    </h1>
                    <p className="mt-3 text-slate-500">
                        Veja tudo que a Creche Tia Tata precisa no momento e
                        escolha como ajudar.
                    </p>
                </div>

                {/* ── Resumo por urgência ── */}
                {!loading && (
                    <div className="mb-8 grid grid-cols-3 gap-3">
                        {["Alta", "Média", "Baixa"].map((u) => {
                            const cfg = URGENCIA_CONFIG[u];
                            return (
                                <div
                                    key={u}
                                    className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200"
                                >
                                    <p
                                        className={`text-2xl font-black ${cfg.badge.split(" ")[1]}`}
                                    >
                                        {contadores[u]}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-500">
                                        Urgência {u}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Filtros ── */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {FILTROS.map((f) => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setFiltroAtivo(f)}
                            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                                filtroAtivo === f
                                    ? "bg-slate-950 text-white"
                                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* ── Lista ── */}
                {loading ? (
                    <div className="grid gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : listagem.length === 0 ? (
                    <div className="rounded-3xl bg-white p-14 text-center shadow-sm ring-1 ring-slate-200">
                        <p className="text-lg font-black text-slate-300">
                            Nenhuma solicitação encontrada
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {listagem.map((item) => {
                            const cfg = URGENCIA_CONFIG[item.urgencia];
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
                                >
                                    {/* barra lateral de urgência */}
                                    <div
                                        className={`h-full w-1 self-stretch rounded-full ${cfg.bar}`}
                                    />

                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">
                                            {item.nome}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            {item.descricao}
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${cfg.badge}`}
                                    >
                                        {cfg.label}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigateTo(
                                                `/doar?id=${item.id}&nome=${encodeURIComponent(item.nome)}&urgencia=${encodeURIComponent(item.urgencia)}&descricao=${encodeURIComponent(item.descricao)}`,
                                            )
                                        }
                                        className="shrink-0 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                                    >
                                        Ajudar
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── final ── */}
                {!loading && (
                    <div className="mt-10 rounded-3xl bg-emerald-50 p-8 text-center ring-1 ring-emerald-200">
                        <p className="text-lg font-black text-slate-950">
                            Quer ajudar de outra forma?
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            Conheça todas as maneiras de contribuir com a
                            creche.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigateTo("/como-ajudar")}
                            className="mt-5 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
                        >
                            Como ajudar
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
