import crecheTiaTata from '../../assets/creche-tia-tata.jpg';
import criancasFamilias from '../../assets/criancas-e-familias.jpg';
import { HeartIcon } from '../icons';

export default function StorySection() {
  return (
    <section className="bg-white px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="rounded-3xl border border-emerald-100 bg-stone-50 p-6 shadow-sm sm:p-8 lg:p-10">
          <span className="text-sm font-bold uppercase tracking-wide text-emerald-700">Nossa história</span>
          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            Sobre a Creche Tia Tata
          </h1>
          <div className="mt-8 space-y-5 text-slate-600">
            <p className="flex gap-3 leading-8">
              <HeartIcon className="mt-1 h-5 w-5 flex-none text-emerald-600" />
              <span>
                A creche nasceu do sonho de transformar a rotina de crianças e famílias em situação de
                vulnerabilidade na comunidade de Santa Luzia, na Cidade Estrutural.
              </span>
            </p>
            <p className="flex gap-3 leading-8">
              <HeartIcon className="mt-1 h-5 w-5 flex-none text-emerald-600" />
              <span>
                Ao longo dos anos, a iniciativa cresceu com apoio comunitário, doações, voluntariado e muita
                persistência para manter as portas abertas.
              </span>
            </p>
            <p className="flex gap-3 leading-8">
              <HeartIcon className="mt-1 h-5 w-5 flex-none text-emerald-600" />
              <span>
                Nossa missão é proporcionar um futuro melhor para crianças que mais precisam, através do amor,
                do cuidado e da mobilização de quem acredita nessa causa.
              </span>
            </p>
          </div>
        </div>

        <div className="relative min-h-[420px]">
          <img
            className="h-[420px] w-full rounded-3xl object-cover shadow-2xl shadow-emerald-900/10"
            src={crecheTiaTata}
            alt="Fachada da Creche Tia Tata em Santa Luzia"
          />
          <img
            className="absolute -bottom-6 right-4 h-40 w-40 rounded-2xl border-4 border-white object-cover shadow-xl sm:right-8 sm:h-52 sm:w-52"
            src={criancasFamilias}
            alt="Tia Tata e crianças atendidas pela creche"
          />
          <div className="absolute left-4 top-4 rounded-2xl bg-white/95 px-5 py-4 shadow-lg sm:left-8">
            <strong className="block text-slate-950">Santa Luzia</strong>
            <span className="text-sm font-semibold text-slate-500">Cidade Estrutural - DF</span>
          </div>
        </div>
      </div>
    </section>
  );
}
