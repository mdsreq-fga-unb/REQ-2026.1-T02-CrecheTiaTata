import { useState } from 'react';
import crecheTiaTata from '../assets/creche-tia-tata.jpg';
import { DEFAULT_LOGIN } from '../config/auth';
import { LOGIN_ERROR_MESSAGES, loginUser } from '../services/authService';
import { saveAuthToken } from '../utils/authStorage';
import { navigateTo } from '../utils/navigation';

export default function LoginPage() {
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get('redirect') || '/';
  const initialMode = params.get('modo') === 'cadastro' ? 'signup' : 'signin';
  const [authMode, setAuthMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignupMode = authMode === 'signup';

  function handleAccountCreated(event) {
    event.preventDefault();
    setErrorMessage('');
    saveAuthToken('local-signup-jwt-token');
    navigateTo(redirectTo);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const { token } = await loginUser({ email, password });
      saveAuthToken(token);
      navigateTo(redirectTo);
    } catch (error) {
      setErrorMessage(error?.message || LOGIN_ERROR_MESSAGES.unexpected);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-stone-50 px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto grid min-h-[calc(100vh-11rem)] max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-full overflow-hidden bg-emerald-950 lg:block">
          <img
            className="h-full w-full object-cover opacity-45"
            src={crecheTiaTata}
            alt=""
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950/85 to-slate-950/40" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <span className="text-sm font-bold uppercase tracking-wide text-emerald-100">Área de doadores e voluntários</span>
            <h1 className="mt-3 text-4xl font-black leading-tight">Entrar ou criar conta</h1>
            <p className="mt-4 max-w-md leading-8 text-emerald-50">
              Identifique-se para registrar sua intenção de doar ou participar como voluntário.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden">
              <span className="text-sm font-bold uppercase tracking-wide text-emerald-700">Área de doadores e voluntários</span>
              <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                Entrar ou criar conta
              </h1>
              <p className="mt-4 leading-7 text-slate-600">
                Identifique-se para registrar sua intenção de doar ou participar como voluntário.
              </p>
            </div>

            <form className="mt-8 grid gap-5 lg:mt-0" onSubmit={isSignupMode ? handleAccountCreated : handleLogin}>
              <header>
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Acesso de doadores e voluntários</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {isSignupMode ? 'Criar conta' : 'Bem-vindo de volta'}
                </h2>
                <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-900">
                  Acesso padrão: {DEFAULT_LOGIN.email} / {DEFAULT_LOGIN.password}
                </p>
              </header>

              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-stone-100 p-1 text-sm font-bold">
                <button
                  aria-label="Mostrar formulário de login"
                  className={`rounded-xl px-4 py-3 transition ${!isSignupMode ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}
                  onClick={() => setAuthMode('signin')}
                  type="button"
                >
                  Entrar
                </button>
                <button
                  aria-label="Mostrar formulário de criação de conta"
                  className={`rounded-xl px-4 py-3 transition ${isSignupMode ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}
                  onClick={() => setAuthMode('signup')}
                  type="button"
                >
                  Criar conta
                </button>
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700" role="alert">
                  {errorMessage}
                </div>
              )}

              {isSignupMode && (
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Nome
                  <input
                    autoComplete="name"
                    className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    name="name"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Digite seu nome completo"
                    required
                    type="text"
                    value={name}
                  />
                </label>
              )}

              <label className="grid gap-2 text-sm font-bold text-slate-700">
                E-mail
                <input
                  autoComplete="email"
                  className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seuemail@exemplo.com"
                  required
                  type="email"
                  value={email}
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Senha
                <input
                  autoComplete="current-password"
                  className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  required
                  type="password"
                  value={password}
                />
              </label>

              <button
                className="rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Entrando...' : isSignupMode ? 'Criar conta e continuar' : 'Entrar'}
              </button>

              <button
                className="text-center text-sm font-bold text-emerald-700 transition hover:text-emerald-900"
                onClick={() => navigateTo('/recuperar-senha')}
                type="button"
              >
                Esqueci minha senha
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
