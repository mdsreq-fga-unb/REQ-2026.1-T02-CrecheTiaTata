import { ArrowIcon } from '../icons';

export default function MapSection() {
  return (
    <section className="bg-white px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-wide text-emerald-700">Como chegar</span>
          <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
            Estamos em Santa Luzia, na Cidade Estrutural.
          </h2>
          <p className="mt-5 leading-8 text-slate-600">
            Antes de sair para entregar doações, confirme pelo WhatsApp. Assim a creche consegue orientar o melhor
            horário e os itens prioritários.
          </p>
        </div>

        <iframe
          className="mt-8 h-96 w-full rounded-3xl border border-slate-200"
          title="Mapa da região da Creche Tia Tata"
          src="https://www.google.com/maps?q=Santa%20Luzia%20Cidade%20Estrutural%20DF&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-emerald-700"
            href="https://www.google.com/maps/search/?api=1&query=Santa%20Luzia%20Cidade%20Estrutural%20DF"
            target="_blank"
            rel="noreferrer"
          >
            Abrir rota no mapa
            <ArrowIcon />
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-6 py-4 font-bold text-emerald-700 transition hover:bg-emerald-50"
            href="https://wa.me/5561996483772"
            target="_blank"
            rel="noreferrer"
          >
            Chamar no WhatsApp
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
