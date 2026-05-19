import crecheTiaTata from '../../assets/creche-tia-tata.jpg';

export default function ContactHeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-5 py-20 text-white lg:px-8 lg:py-28">
      <div className="absolute inset-0">
        <img className="h-full w-full object-cover opacity-35" src={crecheTiaTata} alt="" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-emerald-900/40" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-wide text-emerald-100">Contato</span>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Fale com a Creche Tia Tata
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
            Combine entregas, tire dúvidas sobre pedidos, voluntariado ou visite a comunidade com orientação da
            coordenação.
          </p>
        </div>
      </div>
    </section>
  );
}
