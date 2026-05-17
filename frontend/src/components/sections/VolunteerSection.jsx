import crecheTiaTata from '../../assets/creche-tia-tata.jpg';
import { volunteerItems } from '../../data/siteContent';
import { HandIcon } from '../icons';

export default function VolunteerSection() {
  return (
    <section className="bg-white px-5 py-16 lg:px-8" id="voluntariado">
      <article className="mx-auto max-w-7xl rounded-3xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <header className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-700">
                <HandIcon />
              </span>
              <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">Como ser voluntário</h2>
            </header>
            <p className="mt-5 leading-8 text-slate-600">
              Voluntários são essenciais para o funcionamento da creche. Você pode ajudar em tarefas simples,
              recorrentes ou pontuais.
            </p>
            <ul className="mt-6 grid gap-3 text-slate-700 sm:grid-cols-2">
              {volunteerItems.map((item) => (
                <li className="rounded-xl bg-sky-50 px-4 py-3 font-semibold" key={item}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-emerald-50 p-5 text-sm font-semibold leading-7 text-emerald-900">
              Não precisa de experiência: o mais importante é ter vontade de ajudar e disponibilidade de tempo.
            </p>
          </div>

          <img
            className="aspect-[4/3] w-full rounded-3xl object-cover"
            src={crecheTiaTata}
            alt="Crianças em atividade dentro da creche"
          />
        </div>
      </article>
    </section>
  );
}
