import { actions } from '../../data/siteContent';
import { InfoIcon } from '../icons';

export default function WorkSection() {
  return (
    <section className="bg-stone-50 px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-wide text-emerald-700">O que fazemos</span>
          <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
            Ajuda prática, organizada e próxima da comunidade.
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {actions.map((action) => (
            <article key={action.title} className="flex gap-4 rounded-2xl border border-slate-200 p-5">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <InfoIcon />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-950">{action.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{action.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
