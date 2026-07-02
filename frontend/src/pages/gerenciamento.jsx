import { useState } from 'react';
import { clearAuthToken } from '../utils/authStorage';
import { navigateTo } from '../utils/navigation';
import AdminNavbar from '../components/layout/AdminNavbar';

const tabs = [
  { key: 'inicio', label: 'Início' },
  { key: 'voluntarios', label: 'Voluntários' },
  { key: 'pedidos', label: 'Pedidos' },
  { key: 'doacoes', label: 'Doações' },
];


// dxei com uns valores pra testa, mas vai ter a requisição
const getTabContent = (setActiveTab) => ({
  inicio: {
    label: 'Início',
    title: 'Painel inicial',
    description: 'Visão geral das principais ações da creche.',
    details: [
      { label: 'Solicitações de voluntários', value: '1' },
      { label: 'Pedidos pendentes', value: '1' },
      { label: 'Doações recebidas', value: '1' },
    ],
    acoes: [],
  },
  voluntarios: {
    label: 'Voluntários',
    title: 'Voluntários',
    description: 'Gerencie as inscrições, disponibilidade e preferências dos voluntários da creche.',
    details: [
      { label: 'Novas solicitações de voluntários', value: '1' },
      { label: 'Disponíveis nesta semana', value: '1' },
      { label: 'Todos os voluntários', value: '1' },
    ],
    acoes: [
        { label: 'Ver solicitações', onClick: () =>  {navigateTo('/solicitacoes')} },
        { label: 'Listar voluntarios', onClick: () => { navigateTo('/voluntarios'); } },
    ],
  },
  pedidos: {
    label: 'Pedidos',
    title: 'Pedidos',
    description: 'Acompanhe pedidos de materiais, roupas e itens urgentes que a creche precisa.',
    details: [
      { label: 'Pedidos pendentes', value: '1' },
      { label: 'Entregas marcadas', value: '1' },
      { label: 'Pedidos concluídos', value: '1' },
    ],
    acoes: [
        { label: 'Acessar pedidos', onClick: () => {} },

    ],
  },
  doacoes: {
    label: 'Doações',
    title: 'Doações',
    description: 'Controle os recebimentos de doações e direcione os pontos de entrega para o que mais importa.',
    details: [
      { label: 'Histórico de doações', value: '1' },
      { label: 'Doações agendadas', value: '1' },
    ],
    acoes: [
      { label: 'Acessar Doações', onClick: () => {} },
    ],
  },
});

export default function GerenciamentoPage() {
  const [activeTab, setActiveTab] = useState('inicio');
  const tabContent = getTabContent(setActiveTab);
  const active = tabContent[activeTab];

  const handleLogout = () => {
    clearAuthToken();
    navigateTo('/login');
  };

  return (
    <div className="min-h-screen bg-stone-50">

      <AdminNavbar
        activeTab={activeTab}
        onTabSelect={setActiveTab}
        onLogout={handleLogout}
        onPublicPage={() => navigateTo('/')}
      />

      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <header className="mb-6">
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">{active.label}</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">{active.title}</h2>
                <p className="mt-3 text-slate-600">{active.description}</p>
              </header>

              <div className="grid gap-4 sm:grid-cols-2">
                {active.details.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-stone-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                    <p className="mt-3 text-3xl font-black text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>

              {active.acoes && active.acoes.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-4">
                  {active.acoes.map((acao) => (
                    <button
                      key={acao.label}
                      onClick={acao.onClick}
                      className="rounded-3xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                      {acao.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}