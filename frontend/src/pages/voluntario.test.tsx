import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import VoluntariosPage from './voluntarios';

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

import { clearAuthToken } from '../utils/authStorage';
import { navigateTo } from '../utils/navigation';

const renderPage = () => render(<VoluntariosPage />);

/** Clica no botão "Remover" do primeiro voluntário ainda não marcado da lista. */
const clickFirstRemover = () => {
  const [firstRemover] = screen.getAllByRole('button', { name: 'Remover' });
  fireEvent.click(firstRemover);
};

/** Abre o modal de confirmação de remoções a partir do banner. */
const openConfirmModal = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar remoções' }));
};

/** Confirma a remoção dentro do modal e avança o timer da chamada assíncrona simulada. */
const confirmRemoval = async () => {
  fireEvent.click(screen.getByRole('button', { name: /^Remover \d+ voluntário/ }));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(800);
  });
};

/** Fluxo completo: marca o primeiro voluntário, abre o modal e confirma a remoção. */
const removeFirstVoluntario = async () => {
  clickFirstRemover();
  openConfirmModal();
  await confirmRemoval();
};

/** Clica em "Reverter" e avança o timer da chamada assíncrona simulada. */
const clickReverter = async () => {
  fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(600);
  });
};

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('VoluntariosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Renderização inicial ──────────────────────────────────────────────────

  describe('Renderização inicial', () => {
    it('renderiza sem erros', () => {
      expect(() => renderPage()).not.toThrow();
    });

    it('exibe o título "Lista de voluntários"', () => {
      renderPage();
      expect(screen.getByRole('heading', { name: 'Lista de voluntários' })).toBeInTheDocument();
    });

    it('exibe os três voluntários mockados', () => {
      renderPage();
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
      expect(screen.getByText('João Santos')).toBeInTheDocument();
      expect(screen.getByText('Ana Costa')).toBeInTheDocument();
    });

    it('exibe os detalhes de cada voluntário', () => {
      renderPage();
      expect(screen.getByText('Educação Infantil')).toBeInTheDocument();
      expect(screen.getByText('Segunda a Quinta')).toBeInTheDocument();
      expect(screen.getByText('09:00 - 12:00')).toBeInTheDocument();
    });

    it('exibe um botão "Remover" para cada voluntário', () => {
      renderPage();
      expect(screen.getAllByRole('button', { name: 'Remover' })).toHaveLength(3);
    });

    it('não exibe o banner de remoções pendentes inicialmente', () => {
      renderPage();
      expect(screen.queryByRole('button', { name: 'Confirmar remoções' })).not.toBeInTheDocument();
    });

    it('não exibe a seção "Histórico" inicialmente', () => {
      renderPage();
      expect(screen.queryByText('Histórico de voluntários removidos')).not.toBeInTheDocument();
    });

    it('navbar tem activeTab fixo como "voluntarios"', () => {
      renderPage();
      expect(screen.getByTestId('active-tab')).toHaveTextContent('voluntarios');
    });
  });

  // ── Marcar para remoção (staging) ─────────────────────────────────────────

  describe('Marcar voluntário para remoção', () => {
    beforeEach(() => {
      renderPage();
      clickFirstRemover();
    });

    it('troca o botão do voluntário marcado para "✗ Desmarcar"', () => {
      expect(screen.getByRole('button', { name: '✗ Desmarcar' })).toBeInTheDocument();
    });

    it('exibe o badge "Marcado para remover" no card do voluntário', () => {
      expect(screen.getByText('Marcado para remover')).toBeInTheDocument();
    });

    it('exibe o botão "Confirmar remoções" no banner', () => {
      expect(screen.getByRole('button', { name: 'Confirmar remoções' })).toBeInTheDocument();
    });

    it('mantém o voluntário visível na lista (ainda não removido)', () => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    it('reduz a contagem de botões "Remover" disponíveis para 2', () => {
      expect(screen.getAllByRole('button', { name: 'Remover' })).toHaveLength(2);
    });

    it('cancela a marcação ao clicar em "Cancelar" no banner', () => {
      // Aqui só existe um botão "Cancelar" (o do banner), pois o modal está fechado.
      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
      expect(screen.queryByRole('button', { name: 'Confirmar remoções' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'Remover' })).toHaveLength(3);
    });
  });

  // ── Modal de confirmação ──────────────────────────────────────────────────

  describe('Modal de confirmação', () => {
    beforeEach(() => {
      renderPage();
      clickFirstRemover();
      openConfirmModal();
    });

    it('exibe o modal ao clicar em "Confirmar remoções"', () => {
      expect(screen.getByRole('heading', { name: 'Confirmar remoções' })).toBeInTheDocument();
    });

    it('lista o voluntário marcado dentro do modal', () => {
      const modalCard = screen.getByRole('heading', { name: 'Confirmar remoções' }).parentElement!;
      expect(within(modalCard).getByText('Maria Silva')).toBeInTheDocument();
    });

    it('exibe os botões "Cancelar" e "Remover 1 voluntário" no modal', () => {
      const modalCard = screen.getByRole('heading', { name: 'Confirmar remoções' }).parentElement!;
      expect(within(modalCard).getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
      expect(within(modalCard).getByRole('button', { name: 'Remover 1 voluntário' })).toBeInTheDocument();
    });

    it('fecha o modal ao clicar em "Cancelar" sem remover nada', () => {
      const modalCard = screen.getByRole('heading', { name: 'Confirmar remoções' }).parentElement!;
      fireEvent.click(within(modalCard).getByRole('button', { name: 'Cancelar' }));
      expect(screen.queryByRole('heading', { name: 'Confirmar remoções' })).not.toBeInTheDocument();
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    it('mantém o staging após cancelar o modal (banner continua visível)', () => {
      const modalCard = screen.getByRole('heading', { name: 'Confirmar remoções' }).parentElement!;
      fireEvent.click(within(modalCard).getByRole('button', { name: 'Cancelar' }));
      expect(screen.getByRole('button', { name: 'Confirmar remoções' })).toBeInTheDocument();
    });
  });

  // ── Remoção confirmada ────────────────────────────────────────────────────

  describe('Confirmar remoção', () => {
    beforeEach(async () => {
      renderPage();
      await removeFirstVoluntario();
    });

    it('fecha o modal após confirmar a remoção', () => {
      expect(screen.queryByRole('heading', { name: 'Confirmar remoções' })).not.toBeInTheDocument();
    });

    it('remove o voluntário da lista ativa', () => {
      expect(screen.queryByRole('heading', { name: 'Maria Silva' })).not.toBeInTheDocument();
    });

    it('reduz a lista de voluntários de 3 para 2', () => {
      expect(screen.getAllByRole('button', { name: 'Remover' })).toHaveLength(2);
    });

    it('exibe a seção "Histórico de voluntários removidos"', () => {
      expect(screen.getByText('Histórico de voluntários removidos')).toBeInTheDocument();
    });

    it('exibe o badge "✗ Removido" na seção processadas', () => {
      expect(screen.getByText('✗ Removido')).toBeInTheDocument();
    });

    it('exibe o botão "Reverter" na seção processadas', () => {
      expect(screen.getByRole('button', { name: 'Reverter' })).toBeInTheDocument();
    });

    it('limpa o banner de marcação após confirmar', () => {
      expect(screen.queryByRole('button', { name: 'Confirmar remoções' })).not.toBeInTheDocument();
    });
  });

  // ── Estado vazio ──────────────────────────────────────────────────────────

  describe('Estado vazio', () => {
    /** Remove todos os voluntários um a um, repetindo o fluxo completo de staging/confirmação. */
    const removeAll = async () => {
      for (let i = 0; i < 3; i++) {
        await removeFirstVoluntario();
      }
    };

    it('exibe mensagem de lista vazia após remover todos os voluntários', async () => {
      renderPage();
      await removeAll();
      expect(screen.getByText('Nenhum voluntário cadastrado')).toBeInTheDocument();
    });

    it('não exibe nenhum botão "Remover" na lista vazia', async () => {
      renderPage();
      await removeAll();
      expect(screen.queryAllByRole('button', { name: 'Remover' })).toHaveLength(0);
    });

    it('exibe 3 badges "✗ Removido" após remover todos', async () => {
      renderPage();
      await removeAll();
      expect(screen.getAllByText('✗ Removido')).toHaveLength(3);
    });
  });

  // ── Reverter remoção ──────────────────────────────────────────────────────

  describe('Reverter remoção', () => {
    beforeEach(async () => {
      renderPage();
      await removeFirstVoluntario();
    });

    it('restaura o voluntário para a lista ativa', async () => {
      await clickReverter();
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    it('volta a exibir 3 botões "Remover" após reverter', async () => {
      await clickReverter();
      expect(screen.getAllByRole('button', { name: 'Remover' })).toHaveLength(3);
    });

    it('remove a seção "Histórico" após reverter o único item processado', async () => {
      await clickReverter();
      expect(screen.queryByText('Histórico de voluntários removidos')).not.toBeInTheDocument();
    });

    it('remove o badge "✗ Removido" após reverter', async () => {
      await clickReverter();
      expect(screen.queryByText('✗ Removido')).not.toBeInTheDocument();
    });

    it('exibe "Revertendo..." enquanto a reversão está em andamento', async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
      expect(screen.getByRole('button', { name: 'Revertendo...' })).toBeInTheDocument();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(600);
      });
    });
  });

  // ── Navegação ─────────────────────────────────────────────────────────────

  describe('Navegação', () => {
    beforeEach(() => renderPage());

    it('botão "Voltar ao painel" navega para /gerenciamento', () => {
      fireEvent.click(screen.getByRole('button', { name: /voltar ao painel/i }));
      expect(navigateTo).toHaveBeenCalledWith('/gerenciamento');
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
    beforeEach(() => renderPage());

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