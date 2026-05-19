import criancasFamilias from '../../assets/criancas-e-familias.jpg';

export default function HelpHeroSection() {
  return (
    <section className="relative overflow-hidden bg-emerald-950 px-5 py-20 text-white lg:px-8 lg:py-28">
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover opacity-35"
          src={criancasFamilias}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/85 to-emerald-900/45" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-wide text-emerald-100">Como ajudar</span>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Você pode transformar uma necessidade em cuidado.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            Doar, voluntariar ou divulgar: cada gesto ajuda a manter a rotina da Creche Tia Tata viva e mais
            organizada para as famílias de Santa Luzia.
          </p>
        </div>
      </div>
    </section>
  );
}
