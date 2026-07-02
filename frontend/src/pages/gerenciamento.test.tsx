import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GerenciamentoPage from './gerenciamento';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../utils/authStorage', () => ({
  clearAuthToken: vi.fn(),
}));

vi.mock('../utils/navigation', () => ({
  navigateTo: vi.fn(),
}));

vi.mock('../components/layout/AdminNavbar', () => ({
  default: ({
    activeTab,
    onTabSelect,
    onLogout,
    onPublicPage,
  }: {
    activeTab: string;
    onTabSelect: (tab: string) => void;
    onLogout: () => void;
    onPublicPage: () => void;
  }) => (
    <nav data-testid="admin-navbar">
      <span data-testid="active-tab">{activeTab}</span>
      <button onClick={() => onTabSelect('inicio')}>Início</button>
      <button onClick={() => onTabSelect('voluntarios')}>Voluntários</button>
      <button onClick={() => onTabSelect('pedidos')}>Pedidos</button>
      <button onClick={() => onTabSelect('doacoes')}>Doações</button>
      <button onClick={onLogout}>Sair</button>
      <button onClick={onPublicPage}>Página pública</button>
    </nav>
  ),
}));

// ─── Imports após os mocks ─────────────────────────────────────────────────────

import { clearAuthToken } from '../utils/authStorage';
import { navigateTo } from '../utils/navigation';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderPage = () => render(<GerenciamentoPage />);

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('GerenciamentoPage', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Renderização inicial ──────────────────────────────────────────────────

  describe('Renderização inicial', () => {
    it('renderiza sem erros', () => {
      expect(() => renderPage()).not.toThrow();
    });

    it('exibe o AdminNavbar', () => {
      renderPage();
      expect(screen.getByTestId('admin-navbar')).toBeInTheDocument();
    });

    it('começa com a aba "inicio" ativa', () => {
      renderPage();
      expect(screen.getByTestId('active-tab')).toHaveTextContent('inicio');
    });

    it('exibe o título do painel inicial', () => {
      renderPage();
      expect(screen.getByText('Painel inicial')).toBeInTheDocument();
    });

    it('exibe a descrição do painel inicial', () => {
      renderPage();
      expect(
        screen.getByText('Visão geral das principais ações da creche.')
      ).toBeInTheDocument();
    });

    it('exibe os cards de detalhes do painel inicial', () => {
      renderPage();
      expect(screen.getByText('Solicitações de voluntários')).toBeInTheDocument();
      expect(screen.getByText('Pedidos pendentes')).toBeInTheDocument();
      expect(screen.getByText('Doações recebidas')).toBeInTheDocument();
    });

    it('não exibe botões de ação na aba início', () => {
      renderPage();
      expect(screen.queryByRole('button', { name: /ver solicitações/i })).not.toBeInTheDocument();
    });
  });

  // ── Navegação entre abas ──────────────────────────────────────────────────

  describe('Navegação entre abas', () => {
    it('muda para a aba Voluntários ao clicar', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: 'Voluntários' }));

      expect(screen.getByTestId('active-tab')).toHaveTextContent('voluntarios');
      expect(screen.getByRole('heading', { name: 'Voluntários' })).toBeInTheDocument();
      expect(
        screen.getByText('Gerencie as inscrições, disponibilidade e preferências dos voluntários da creche.')
      ).toBeInTheDocument();
    });

    it('muda para a aba Pedidos ao clicar', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: 'Pedidos' }));

      expect(screen.getByTestId('active-tab')).toHaveTextContent('pedidos');
      expect(
        screen.getByText('Acompanhe pedidos de materiais, roupas e itens urgentes que a creche precisa.')
      ).toBeInTheDocument();
    });

    it('muda para a aba Doações ao clicar', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: 'Doações' }));

      expect(screen.getByTestId('active-tab')).toHaveTextContent('doacoes');
      expect(
        screen.getByText('Controle os recebimentos de doações e direcione os pontos de entrega para o que mais importa.')
      ).toBeInTheDocument();
    });

    it('retorna para a aba Início ao clicar nela novamente', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: 'Pedidos' }));
      fireEvent.click(screen.getByRole('button', { name: 'Início' }));

      expect(screen.getByTestId('active-tab')).toHaveTextContent('inicio');
      expect(screen.getByText('Painel inicial')).toBeInTheDocument();
    });
  });

  // ── Conteúdo por aba ──────────────────────────────────────────────────────

  describe('Conteúdo da aba Voluntários', () => {
    beforeEach(() => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: 'Voluntários' }));
    });

    it('exibe os cards de detalhes de voluntários', () => {
      expect(screen.getByText('Novas solicitações de voluntários')).toBeInTheDocument();
      expect(screen.getByText('Disponíveis nesta semana')).toBeInTheDocument();
      expect(screen.getByText('Todos os voluntários')).toBeInTheDocument();
    });

    it('exibe o botão "Ver solicitações"', () => {
      expect(screen.getByRole('button', { name: 'Ver solicitações' })).toBeInTheDocument();
    });

    it('botão "Ver solicitações" navega para /solicitacoes', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Ver solicitações' }));
      expect(navigateTo).toHaveBeenCalledWith('/solicitacoes');
    });

    it('exibe o botão "Listar voluntarios"', () => {
      expect(screen.getByRole('button', { name: 'Listar voluntarios' })).toBeInTheDocument();
    });
  });

  describe('Conteúdo da aba Pedidos', () => {
    beforeEach(() => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: 'Pedidos' }));
    });

    it('exibe os cards de detalhes de pedidos', () => {
      expect(screen.getByText('Pedidos pendentes')).toBeInTheDocument();
      expect(screen.getByText('Entregas marcadas')).toBeInTheDocument();
      expect(screen.getByText('Pedidos concluídos')).toBeInTheDocument();
    });

    it('exibe o botão "Acessar pedidos"', () => {
      expect(screen.getByRole('button', { name: 'Acessar pedidos' })).toBeInTheDocument();
    });
  });

  describe('Conteúdo da aba Doações', () => {
    beforeEach(() => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: 'Doações' }));
    });

    it('exibe os cards de detalhes de doações', () => {
      expect(screen.getByText('Histórico de doações')).toBeInTheDocument();
      expect(screen.getByText('Doações agendadas')).toBeInTheDocument();
    });

    it('exibe o botão "Acessar Doações"', () => {
      expect(screen.getByRole('button', { name: 'Acessar Doações' })).toBeInTheDocument();
    });
  });

  // ── Autenticação ──────────────────────────────────────────────────────────

  describe('Logout', () => {
    it('chama clearAuthToken ao fazer logout', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
      expect(clearAuthToken).toHaveBeenCalledTimes(1);
    });

    it('navega para /login ao fazer logout', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
      expect(navigateTo).toHaveBeenCalledWith('/login');
    });
  });

  // ── Navegação para página pública ─────────────────────────────────────────

  describe('Página pública', () => {
    it('navega para "/" ao clicar em "Página pública"', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: 'Página pública' }));
      expect(navigateTo).toHaveBeenCalledWith('/');
    });
  });

});