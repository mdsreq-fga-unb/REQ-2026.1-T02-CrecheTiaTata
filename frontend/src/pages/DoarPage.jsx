import { useState } from "react";
import { navigateTo } from "../utils/navigation";

function Campo({ label, children, hint }) {
    return (
        <label className="grid gap-2 text-sm font-bold text-slate-700">
            {label}
            {hint && (
                <span className="text-xs font-normal text-slate-400">
                    {hint}
                </span>
            )}
            {children}
        </label>
    );
}

const inputClass =
    "rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DoarPage() {
    const params = new URLSearchParams(window.location.search);
    const nome = params.get("nome") ?? "Item solicitado";
    const urgencia = params.get("urgencia") ?? "Baixa";
    const descricao = params.get("descricao") ?? "";

    const URGENCIA_BADGE = {
        Alta: "bg-orange-100 text-orange-700",
        Média: "bg-amber-100 text-amber-700",
        Baixa: "bg-emerald-100 text-emerald-700",
    };

    const [quantidade, setQuantidade] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [horario, setHorario] = useState("");
    const [erro, setErro] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async () => {
        setErro("");

        if (!quantidade || !telefone || !endereco || !horario) {
            setErro("Por favor, preencha todos os campos antes de continuar.");
            return;
        }

        setEnviando(true);

        // Substituir por POST /api/doacoes
        await new Promise((r) => setTimeout(r, 800));

        setEnviando(false);
        setEnviado(true);
    };

    /* ── Tela de sucesso ── */
    if (enviado) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-stone-50 px-5 py-12">
                <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-200">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                        <span className="text-3xl">✓</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-950">
                        Doação registrada!
                    </h1>
                    <p className="mt-3 text-slate-500">
                        Obrigado pela sua contribuição com{" "}
                        <strong>{nome}</strong>. Entraremos em contato pelo
                        número informado para combinar a entrega.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigateTo("/necessidades")}
                        className="mt-8 w-full rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
                    >
                        Ver outras solicitações
                    </button>
                    <button
                        type="button"
                        onClick={() => navigateTo("/")}
                        className="mt-3 w-full rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        Voltar ao início
                    </button>
                </div>
            </section>
        );
    }

    /* ── Formulário ── */
    return (
        <section className="min-h-screen bg-stone-50 px-5 py-12 lg:px-8">
            <div className="mx-auto max-w-lg">
                {/* Voltar */}
                <button
                    type="button"
                    onClick={() => navigateTo("/necessidades")}
                    className="mb-8 flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors hover:text-emerald-700"
                >
                    ← Voltar às solicitações
                </button>

                <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200">
                    {/* Cabeçalho */}
                    <header className="mb-8">
                        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                            Fazer uma doação
                        </p>
                        <h1 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
                            Confirme sua doação
                        </h1>
                    </header>

                    {/* Item selecionado */}
                    <div className="mb-8 flex items-start justify-between gap-3 rounded-2xl bg-stone-50 px-5 py-4 ring-1 ring-slate-200">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Item
                            </p>
                            <p className="mt-0.5 font-black text-slate-950">
                                {nome}
                            </p>
                            {descricao && (
                                <p className="mt-1 text-xs text-slate-500">
                                    {descricao}
                                </p>
                            )}
                        </div>
                        <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${URGENCIA_BADGE[urgencia] ?? URGENCIA_BADGE.Baixa}`}
                        >
                            {urgencia}
                        </span>
                    </div>

                    {/* Campos */}
                    <div className="grid gap-5">
                        <Campo
                            label="Quantidade"
                            hint="Informe o número de unidades ou o peso aproximado"
                        >
                            <input
                                type="number"
                                min="1"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                placeholder="Ex: 5 pacotes"
                                className={inputClass}
                            />
                        </Campo>

                        <Campo label="Telefone para contato">
                            <input
                                type="tel"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                placeholder="(00) 00000-0000"
                                className={inputClass}
                            />
                        </Campo>

                        <Campo
                            label="Endereço de entrega"
                            hint="Rua, número, bairro e cidade"
                        >
                            <textarea
                                rows={3}
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                placeholder="Ex: Rua das Flores, 123 — Centro, São Paulo"
                                className={`${inputClass} resize-none`}
                            />
                        </Campo>

                        <Campo label="Horário disponível para entrega">
                            <input
                                type="text"
                                value={horario}
                                onChange={(e) => setHorario(e.target.value)}
                                placeholder="Ex: Seg a Sex das 14h às 18h"
                                className={inputClass}
                            />
                        </Campo>
                    </div>

                    {/* Erro */}
                    {erro && (
                        <div
                            role="alert"
                            className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700"
                        >
                            {erro}
                        </div>
                    )}

                    {/* Botão */}
                    <button
                        type="button"
                        disabled={enviando}
                        onClick={handleSubmit}
                        className="mt-8 w-full rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {enviando ? "Enviando..." : "Confirmar doação"}
                    </button>

                    <p className="mt-4 text-center text-xs text-slate-400">
                        Entraremos em contato pelo telefone informado para
                        combinar os detalhes.
                    </p>
                </div>
            </div>
        </section>
    );
}
