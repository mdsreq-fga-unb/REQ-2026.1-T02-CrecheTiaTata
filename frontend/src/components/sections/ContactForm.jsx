import { CheckIcon, MailIcon } from '../icons';

export default function ContactForm() {
  return (
    <form className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-6 flex items-center gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
          <MailIcon />
        </span>
        <h2 className="text-2xl font-black text-slate-950">Envie uma mensagem</h2>
      </header>

      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Seu nome
          <input
            className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            type="text"
            name="nome"
            placeholder="Digite seu nome completo"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          E-mail
          <input
            className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            type="email"
            name="email"
            placeholder="seuemail@exemplo.com"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Telefone
          <input
            className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            type="tel"
            name="telefone"
            placeholder="(61) 99999-9999"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Mensagem
          <textarea
            className="min-h-36 rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            name="mensagem"
            placeholder="Como podemos ajudar você?"
          />
        </label>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700"
        >
          <CheckIcon />
          Enviar mensagem
        </button>
      </div>
    </form>
  );
}
