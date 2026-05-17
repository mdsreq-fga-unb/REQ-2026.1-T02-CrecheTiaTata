import { principles } from '../../data/siteContent';

export default function PrinciplesSection() {
  return (
    <section className="bg-white px-5 pb-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {principles.map((item) => (
          <article key={item.title} className={`rounded-2xl border p-6 ${item.className}`}>
            <span className="text-sm font-black uppercase tracking-wide">{item.title}</span>
            <p className="mt-3 leading-7">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
