import { donationGroups } from '../../data/siteContent';
import { GiftIcon } from '../icons';

export default function DonationSection() {
  return (
    <section className="bg-stone-50 px-5 py-16 lg:px-8" id="doacoes">
      <article className="mx-auto max-w-7xl rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <header className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
            <GiftIcon />
          </span>
          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">O que você pode doar</h2>
        </header>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {donationGroups.map((group) => (
            <div className="rounded-2xl border border-slate-200 bg-stone-50 p-5" key={group.title}>
              <h3 className="font-black text-slate-950">{group.title}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {group.items.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
