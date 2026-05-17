import { navigateTo } from '../utils/navigation';

export default function PasswordRecoveryPage() {
  return (
    <section className="bg-stone-50 px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <span className="text-sm font-bold uppercase tracking-wide text-emerald-700">Recuperação de senha</span>
        <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
          Esqueci minha senha
        </h1>
        <p className="mt-5 leading-8 text-slate-600">
          A recuperação de senha ainda precisa ser conectada ao fluxo definitivo do backend. Por enquanto, entre em
          contato com a coordenação para solicitar a redefinição de acesso.
        </p>
        <button
          className="mt-8 rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700"
          onClick={() => navigateTo('/login')}
          type="button"
        >
          Voltar para o login
        </button>
      </div>
    </section>
  );
}
