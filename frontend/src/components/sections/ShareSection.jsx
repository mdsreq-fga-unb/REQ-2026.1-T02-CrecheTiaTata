import { ArrowIcon } from '../icons';

export default function ShareSection() {
  return (
    <section className="bg-stone-50 px-5 py-16 lg:px-8" id="divulgar">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-wide text-emerald-700">Divulgar também ajuda</span>
          <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
            Leve os pedidos da creche para mais pessoas.
          </h2>
          <p className="mt-5 leading-8 text-slate-600">
            Compartilhe a página, envie para grupos de bairro, converse com amigos e ajude a creche a encontrar
            doadores certos no momento certo.
          </p>
        </div>
        <a
          href="#doacoes"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-emerald-700"
        >
          Ver pedidos de doação
          <ArrowIcon />
        </a>
      </div>
    </section>
  );
}
