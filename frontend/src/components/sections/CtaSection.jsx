import { ArrowIcon } from '../icons';
import { navigateTo } from '../../utils/navigation';

export default function CtaSection() {
  return (
    <section id="ajudar" className="bg-emerald-700 px-5 py-16 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <span className="text-sm font-bold uppercase tracking-wide text-emerald-100">Como ajudar</span>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            Uma doação pequena pode resolver uma necessidade de hoje.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigateTo('/contato')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-center font-bold text-emerald-700"
          >
            Quero doar
            <ArrowIcon />
          </button>
          <button type="button" onClick={() => navigateTo('/contato')} className="rounded-xl border border-emerald-300 px-6 py-4 text-center font-bold text-white">
            Ser voluntário
          </button>
        </div>
      </div>
    </section>
  );
}
