import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SolicitacoesVoluntariosPage from './solicitacoes';

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
      <button onClick={onLogout}>Sair</button>
      <button onClick={onPublicPage}>Página pública</button>
    </nav>
  ),
}));

// ─── Imports após os mocks ─────────────────────────────────────────────────────

import { clearAuthToken } from '../utils/authStorage';
import { navigateTo } from '../utils/navigation';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderPage = () => render(<SolicitacoesVoluntariosPage />);

/** Avança os timers e aguarda o React processar as atualizações de estado. */
const advance = async (ms: number) => {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
};

/** Renderiza e aguarda o carregamento inicial (500 ms). */
const renderLoaded = async () => {
  renderPage();
  await advance(500);
};

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('SolicitacoesVoluntariosPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Estado de carregamento ────────────────────────────────────────────────

  describe('Estado de carregamento', () => {
    it('exibe 3 skeleton cards enquanto carrega', () => {
      renderPage();
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(3);
    });

    it('não exibe nomes de voluntários durante o carregamento', () => {
      renderPage();
      expect(screen.queryByText('Maria Silva')).not.toBeInTheDocument();
      expect(screen.queryByText('João Santos')).not.toBeInTheDocument();
      expect(screen.queryByText('Ana Costa')).not.toBeInTheDocument();
    });

    it('remove os skeletons após 500 ms', async () => {
      await renderLoaded();
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(0);
    });
  });

  // ── Dados carregados ──────────────────────────────────────────────────────

  describe('Solicitações carregadas', () => {
    beforeEach(renderLoaded);

    it('exibe os três voluntários', () => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
      expect(screen.getByText('João Santos')).toBeInTheDocument();
      expect(screen.getByText('Ana Costa')).toBeInTheDocument();
    });

    it('exibe os detalhes da primeira solicitação', () => {
      expect(screen.getByText('Educação Infantil')).toBeInTheDocument();
      expect(screen.getByText('Segunda a Quinta')).toBeInTheDocument();
      expect(screen.getByText('09:00 - 12:00')).toBeInTheDocument();
    });

    it('exibe um par Aceitar/Recusar para cada solicitação', () => {
      expect(screen.getAllByRole('button', { name: 'Aceitar' })).toHaveLength(3);
      expect(screen.getAllByRole('button', { name: 'Recusar' })).toHaveLength(3);
    });

    it('não exibe a seção "Histórico" inicialmente', () => {
      expect(screen.queryByText('Histórico de solicitações')).not.toBeInTheDocument();
    });
  });

  // ── Ação: Aceitar ─────────────────────────────────────────────────────────

  describe('Aceitar solicitação', () => {
    beforeEach(renderLoaded);

    it('exibe "Aguarde..." nos dois botões do card durante o processamento', async () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);

      // Ambos os botões do card em loading ficam com "Aguarde..."
      expect(screen.getAllByRole('button', { name: 'Aguarde...' })).toHaveLength(2);
    });

    it('desabilita os botões do card durante o processamento', () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);

      screen
        .getAllByRole('button', { name: 'Aguarde...' })
        .forEach((btn) => expect(btn).toBeDisabled());
    });

    it('exibe badge "✓ Aceito" após os 600 ms de processamento', async () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);
      await advance(600);

      expect(screen.getByText('✓ Aceito')).toBeInTheDocument();
    });

    it('move o card para a seção "Histórico de solicitações"', async () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);
      await advance(600);

      expect(screen.getByText('Histórico de solicitações')).toBeInTheDocument();
    });

    it('reduz a lista de pendentes de 3 para 2 após aceitar', async () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);
      await advance(600);

      expect(screen.getAllByRole('button', { name: 'Aceitar' })).toHaveLength(2);
    });
  });

  // ── Ação: Recusar ─────────────────────────────────────────────────────────

  describe('Recusar solicitação', () => {
    beforeEach(renderLoaded);

    it('exibe badge "✗ Recusado" após os 600 ms de processamento', async () => {
      const [primeiroRecusar] = screen.getAllByRole('button', { name: 'Recusar' });
      fireEvent.click(primeiroRecusar);
      await advance(600);

      expect(screen.getByText('✗ Recusado')).toBeInTheDocument();
    });

    it('move o card para a seção "Histórico de solicitações"', async () => {
      const [primeiroRecusar] = screen.getAllByRole('button', { name: 'Recusar' });
      fireEvent.click(primeiroRecusar);
      await advance(600);

      expect(screen.getByText('Histórico de solicitações')).toBeInTheDocument();
    });

    it('reduz a lista de pendentes de 3 para 2 após recusar', async () => {
      const [primeiroRecusar] = screen.getAllByRole('button', { name: 'Recusar' });
      fireEvent.click(primeiroRecusar);
      await advance(600);

      expect(screen.getAllByRole('button', { name: 'Recusar' })).toHaveLength(2);
    });
  });

  // ── Ação: Reverter ────────────────────────────────────────────────────────

  describe('Reverter solicitação', () => {
    /** Aceita a primeira solicitação antes de cada teste. */
    beforeEach(async () => {
      await renderLoaded();
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);
      await advance(600);
    });

    it('exibe o botão "Reverter" na seção de histórico', () => {
      expect(screen.getByRole('button', { name: 'Reverter' })).toBeInTheDocument();
    });

    it('retorna o card para a lista de pendentes ao reverter', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
      expect(screen.getAllByRole('button', { name: 'Aceitar' })).toHaveLength(3);
    });

    it('remove a seção "Histórico" quando não há mais itens processados', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
      expect(screen.queryByText('Histórico de solicitações')).not.toBeInTheDocument();
    });

    it('remove o badge "✓ Aceito" após reverter', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
      expect(screen.queryByText('✓ Aceito')).not.toBeInTheDocument();
    });
  });

  // ── Múltiplas ações simultâneas ───────────────────────────────────────────

  describe('Múltiplas ações independentes', () => {
    beforeEach(renderLoaded);

    it('permite aceitar e recusar cards diferentes de forma independente', async () => {
      const aceitarButtons = screen.getAllByRole('button', { name: 'Aceitar' });
      const recusarButtons = screen.getAllByRole('button', { name: 'Recusar' });

      fireEvent.click(aceitarButtons[0]); // Aceita Maria Silva
      fireEvent.click(recusarButtons[1]); // Recusa João Santos
      await advance(600);

      expect(screen.getByText('✓ Aceito')).toBeInTheDocument();
      expect(screen.getByText('✗ Recusado')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'Aceitar' })).toHaveLength(1);
    });
  });

  // ── Cabeçalho e navegação ─────────────────────────────────────────────────

  describe('Cabeçalho', () => {
    beforeEach(renderLoaded);

    it('exibe o título "Solicitações"', () => {
      expect(screen.getByRole('heading', { name: 'Solicitações' })).toBeInTheDocument();
    });

    it('exibe o botão de voltar ao painel', () => {
      expect(screen.getByRole('button', { name: /voltar ao painel/i })).toBeInTheDocument();
    });

    it('botão "Voltar ao painel" navega para /gerenciamento', () => {
      fireEvent.click(screen.getByRole('button', { name: /voltar ao painel/i }));
      expect(navigateTo).toHaveBeenCalledWith('/gerenciamento');
    });

    it('navbar tem activeTab fixo como "voluntarios"', () => {
      expect(screen.getByTestId('active-tab')).toHaveTextContent('voluntarios');
    });

    it('seleção de aba no navbar navega para /gerenciamento', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Início' }));
      expect(navigateTo).toHaveBeenCalledWith('/gerenciamento');
    });

    it('navega para "/" ao clicar em "Página pública"', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Página pública' }));
      expect(navigateTo).toHaveBeenCalledWith('/');
    });
  });

  // ── Logout ────────────────────────────────────────────────────────────────

  describe('Logout', () => {
    beforeEach(renderLoaded);

    it('chama clearAuthToken ao fazer logout', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
      expect(clearAuthToken).toHaveBeenCalledTimes(1);
    });

    it('navega para /login ao fazer logout', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
      expect(navigateTo).toHaveBeenCalledWith('/login');
    });
  });
});