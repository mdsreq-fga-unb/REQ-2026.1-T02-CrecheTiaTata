import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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

/** Clica no botão "Remover" do primeiro voluntário da lista ativa. */
const clickFirstRemover = () => {
  const [firstRemover] = screen.getAllByRole('button', { name: 'Remover' });
  fireEvent.click(firstRemover);
};

/**
 * Confirma a remoção clicando em "Remover" dentro do modal.
 * Usa o botão "Cancelar" como âncora para isolar o container do modal
 * e evitar ambiguidade com os botões "Remover" da lista.
 */
const confirmModal = () => {
  const cancelBtn = screen.getByRole('button', { name: 'Cancelar' });
  const modalButtonGroup = cancelBtn.parentElement!;
  fireEvent.click(within(modalButtonGroup).getByRole('button', { name: 'Remover' }));
};

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('VoluntariosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    it('não exibe o modal de confirmação inicialmente', () => {
      renderPage();
      expect(screen.queryByRole('heading', { name: 'Remover voluntário' })).not.toBeInTheDocument();
    });

    it('não exibe a seção "Processadas" inicialmente', () => {
      renderPage();
      expect(screen.queryByText('Histórico de voluntários removidos')).not.toBeInTheDocument();
    });

    it('navbar tem activeTab fixo como "voluntarios"', () => {
      renderPage();
      expect(screen.getByTestId('active-tab')).toHaveTextContent('voluntarios');
    });
  });

  // ── Modal de confirmação ──────────────────────────────────────────────────

  describe('Modal de confirmação', () => {
    beforeEach(() => {
      renderPage();
      clickFirstRemover();
    });

    it('exibe o modal ao clicar em "Remover"', () => {
      expect(screen.getByRole('heading', { name: 'Remover voluntário' })).toBeInTheDocument();
    });

    it('exibe o nome do voluntário selecionado no texto do modal', () => {
      // para focar no modal pra evitar nome duplicado
      const modalCard = screen.getByRole('heading', { name: 'Remover voluntário' }).parentElement!;
      expect(within(modalCard).getByText('Maria Silva')).toBeInTheDocument();
    });

    it('exibe os botões "Cancelar" e "Remover" no modal', () => {
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
      // Modal tem seu próprio "Remover"; ao menos um deve existir
      expect(screen.getAllByRole('button', { name: 'Remover' }).length).toBeGreaterThanOrEqual(1);
    });

    it('fecha o modal ao clicar em "Cancelar"', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
      expect(screen.queryByRole('heading', { name: 'Remover voluntário' })).not.toBeInTheDocument();
    });

    it('mantém o voluntário na lista após cancelar', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'Remover' })).toHaveLength(3);
    });

    it('não remove nenhum voluntário ao cancelar', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
      expect(screen.queryByText('Histórico de voluntários removidos')).not.toBeInTheDocument();
    });
  });

  // ── Remoção confirmada ────────────────────────────────────────────────────

  describe('Confirmar remoção', () => {
    beforeEach(() => {
      renderPage();
      clickFirstRemover();
      confirmModal();
    });

    it('fecha o modal após confirmar a remoção', () => {
      expect(screen.queryByRole('heading', { name: 'Remover voluntário' })).not.toBeInTheDocument();
    });

    it('remove o voluntário da lista ativa', () => {
      // A lista ativa usa <h2>; a seção processadas usa <p>.
      // queryByRole('heading') garante que verificamos apenas o card ativo.
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
  });

  // ── Estado vazio ──────────────────────────────────────────────────────────

  describe('Estado vazio', () => {
    /** Remove todos os voluntários um a um. */
    const removeAll = () => {
      for (let i = 0; i < 3; i++) {
        clickFirstRemover();
        confirmModal();
      }
    };

    it('exibe mensagem de lista vazia após remover todos os voluntários', () => {
      renderPage();
      removeAll();
      expect(screen.getByText('Nenhum voluntário cadastrado')).toBeInTheDocument();
    });

    it('não exibe nenhum botão "Remover" na lista vazia', () => {
      renderPage();
      removeAll();
      // Os únicos botões presentes devem ser os "Reverter" da seção processadas
      expect(screen.queryAllByRole('button', { name: 'Remover' })).toHaveLength(0);
    });

    it('exibe 3 badges "✗ Removido" após remover todos', () => {
      renderPage();
      removeAll();
      expect(screen.getAllByText('✗ Removido')).toHaveLength(3);
    });
  });

  // ── Reverter remoção ──────────────────────────────────────────────────────

  describe('Reverter remoção', () => {
    beforeEach(() => {
      renderPage();
      clickFirstRemover();
      confirmModal();
    });

    it('restaura o voluntário para a lista ativa', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    it('volta a exibir 3 botões "Remover" após reverter', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
      expect(screen.getAllByRole('button', { name: 'Remover' })).toHaveLength(3);
    });

    it('remove o item da seção "Processadas" após reverter', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
      expect(screen.queryByText('Histórico de voluntários removidos')).not.toBeInTheDocument();
    });

    it('remove o badge "✗ Removido" após reverter', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
      expect(screen.queryByText('✗ Removido')).not.toBeInTheDocument();
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