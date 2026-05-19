import crecheTiaTata from '../assets/creche-tia-tata.jpg';
import criancasFamilias from '../assets/criancas-e-familias.jpg';
import { needs, impact } from '../data/siteContent';
import { ArrowIcon } from '../components/icons';
import { navigateTo } from '../utils/navigation';
import { requireAuthForAction } from '../utils/protectedActions';

export default function HomePage() {
  return (
    <>
      <section id="inicio" className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
              Há 15 anos cuidando de crianças e famílias
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Ajudando crianças e famílias com amor
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              A Creche Tia Tata conecta doadores, voluntários e famílias em uma rede de cuidado com transparência e carinho.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => requireAuthForAction('/contato?acao=doar')}
                className="rounded-xl bg-emerald-600 px-6 py-4 text-center font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Fazer uma doação
              </button>
              <a
                href="#necessidades"
                className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-center font-bold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Ver necessidades
              </a>
            </div>
          </div>

          <div className="relative">
            <img
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl shadow-emerald-900/10"
              src={criancasFamilias}
              alt="Crianças sorrindo em uma atividade comunitária"
            />
            <div className="absolute -bottom-6 left-5 right-5 rounded-2xl bg-white p-5 shadow-xl shadow-slate-900/10 sm:left-auto sm:w-72">
              <p className="text-sm font-semibold text-slate-500">Impacto acumulado</p>
              <p className="mt-1 text-3xl font-black text-emerald-700">500+ famílias</p>
            </div>
          </div>
        </div>
      </section>

      <section id="necessidades" className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xl font-black uppercase tracking-wide text-orange-600 sm:text-2xl">Precisamos agora</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Doações mais urgentes</h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {needs.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.urgent ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {item.urgent ? 'Urgente' : 'Regular'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => requireAuthForAction('/contato?acao=doar')}
                  className="mt-8 block rounded-xl bg-slate-950 px-4 py-3 text-center font-bold text-white transition hover:bg-emerald-700"
                >
                  Ajudar com este item
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <img
            className="aspect-[5/4] w-full rounded-3xl object-cover"
            src={crecheTiaTata}
            alt="Voluntários organizando doações"
          />
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Sobre a creche</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              Cuidado, acolhimento e oportunidades reais.
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Somos um projeto social que apoia crianças e famílias em situação de vulnerabilidade, organizando doações,
              voluntariado e ações de suporte comunitário.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('/sobre')}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700"
            >
              Conhecer nossa história
              <ArrowIcon />
            </button>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-black text-slate-950 sm:text-4xl">Nosso impacto</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {impact.map((item) => (
              <div key={item.label} className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-4xl font-black text-emerald-700 sm:text-5xl">{item.value}</p>
                <p className="mt-2 font-semibold text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
