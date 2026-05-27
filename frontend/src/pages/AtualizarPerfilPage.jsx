import { useState } from 'react';
import { navigateTo } from '../utils/navigation';

export default function AtualizarPerfilPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [disponibilidade, setDisponibilidade] = useState('');
  const [acoes, setAcoes] = useState('');
  const [erroAtualizacao, setErroAtualizacao] = useState('');
  const [sucessoAtualizacao, setSucessoAtualizacao] = useState('');

  const [senhaDelete, setSenhaDelete] = useState('');
  const [confirmaSenhaDelete, setConfirmaSenhaDelete] = useState('');
  const [confirmacaoCheckbox, setConfirmacaoCheckbox] = useState(false);
  const [erroDelete, setErroDelete] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validarEmailRegex = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleAtualizarDados = async (event) => {
    event.preventDefault();
    setErroAtualizacao('');
    setSucessoAtualizacao('');
    setIsSubmitting(true);

    if (email && !validarEmailRegex(email)) {
      setErroAtualizacao('Formato de e-mail inválido!');
      setIsSubmitting(false);
      return;
    }

    try {
      // Mock da requisição PUT
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSucessoAtualizacao('Dados atualizados com sucesso!');
    } catch (error) {
      setErroAtualizacao('Falha ao conectar com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletarConta = async (event) => {
    event.preventDefault();
    setErroDelete('');
    setIsSubmitting(true);

    if (senhaDelete !== confirmaSenhaDelete) {
      setErroDelete('As senhas não coincidem!');
      setIsSubmitting(false);
      return;
    }

    if (!confirmacaoCheckbox) {
      setErroDelete('Você precisa confirmar que deseja apagar a conta permanentemente.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Mock da requisição DELETE
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Conta deletada com sucesso.');
      navigateTo('/');
    } catch (error) {
      setErroDelete('Erro ao apagar conta. Verifique sua senha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-stone-50 px-5 py-12 lg:px-8 lg:py-16 min-h-[calc(100vh-11rem)]">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 sm:p-10">
        <header className="mb-10 text-center">
          <span className="text-sm font-bold uppercase tracking-wide text-emerald-700">Área do Usuário</span>
          <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Meu Perfil</h1>
          <p className="mt-4 text-slate-600">Atualize suas disponibilidades ou gerencie sua conta.</p>
        </header>

        {/* --- FORMULÁRIO DE ATUALIZAÇÃO --- */}
        <form className="grid gap-6" onSubmit={handleAtualizarDados}>
          <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Informações de Contato</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              E-mail
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="novoemail@exemplo.com"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Nova Senha
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Deixe em branco para não alterar"
              />
            </label>
          </div>

          <h2 className="text-xl font-bold text-slate-900 border-b pb-2 mt-4">Ações e Voluntariado</h2>
          
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Disponibilidade
            <input
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              type="text"
              value={disponibilidade}
              onChange={(e) => setDisponibilidade(e.target.value)}
              placeholder="Ex: Segundas e Quartas (Tarde)"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Ações Específicas
            <textarea
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 min-h-[100px]"
              value={acoes}
              onChange={(e) => setAcoes(e.target.value)}
              placeholder="Ex: Dar aulas de reforço, realizar triagem de roupas..."
            />
          </label>

          {erroAtualizacao && (
            <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              {erroAtualizacao}
            </div>
          )}
          {sucessoAtualizacao && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700"
            >
              {sucessoAtualizacao}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>

        <hr className="my-12 border-slate-200" />

        {/* --- ZONA DE PERIGO (DELETE) --- */}
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 sm:p-8">
          <h3 className="text-lg font-black text-red-700">Zona de Perigo: Apagar Conta</h3>
          <p className="mt-2 text-sm text-red-600/80 mb-6">Atenção: Esta ação é irreversível.</p>

          <form className="grid gap-5" onSubmit={handleDeletarConta}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Digite sua senha
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  type="password"
                  value={senhaDelete}
                  onChange={(e) => setSenhaDelete(e.target.value)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Confirme sua senha
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  type="password"
                  value={confirmaSenhaDelete}
                  onChange={(e) => setConfirmaSenhaDelete(e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                checked={confirmacaoCheckbox}
                onChange={(e) => setConfirmacaoCheckbox(e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-700">
                Sim, tenho certeza que desejo deletar minha conta permanentemente.
              </span>
            </label>

            {erroDelete && (
              <div className="rounded-xl bg-white p-3 text-sm font-semibold text-red-700 border border-red-200">
                {erroDelete}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 w-full sm:w-auto sm:place-self-start"
            >
              Apagar Minha Conta
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}