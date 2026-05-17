import { helpWays } from '../../data/siteContent';
import { ArrowIcon, WayIcon } from '../icons';

export default function WaysSection() {
  return (
    <section className="bg-white px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {helpWays.map((way) => (
          <a
            className={`group rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 ${way.className}`}
            href={way.href}
            key={way.title}
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/80">
              <WayIcon tone={way.tone} />
            </span>
            <h2 className="mt-5 text-2xl font-black">{way.title}</h2>
            <p className="mt-3 min-h-16 leading-7">{way.text}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-black">
              Clique para ajudar
              <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
