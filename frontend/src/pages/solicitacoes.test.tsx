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

/**
 * O banner de alterações pendentes renderiza a contagem em um <span> separado
 * do restante do texto (ex.: <span>2</span> "alterações pendentes"), então um
 * único matcher de texto não encontra a frase inteira. Esta função verifica o
 * textContent combinado do elemento que contém a frase.
 */
const getBannerPendente = (count: number) => {
  const sufixo = count === 1 ? 'alteração pendente' : 'alterações pendentes';
  const esperado = `${count} ${sufixo}`;
  return screen.getByText((_, element) => {
    if (!element || element.tagName.toLowerCase() !== 'p') return false;
    const texto = element.textContent?.replace(/\s+/g, ' ').trim();
    return texto === esperado;
  });
};

/**
 * Executa o fluxo completo de confirmação de uma decisão staged:
 * abre o modal pelo banner e clica no botão de confirmar do modal.
 * O delay de 800 ms do mock NÃO é avançado — chame `advance(800)` no teste
 * quando precisar verificar o estado final.
 */
const confirmarAlteracoes = (stagedCount: number) => {
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar alterações' }));
  const label =
    stagedCount === 1
      ? 'Confirmar 1 alteração'
      : `Confirmar ${stagedCount} alterações`;
  fireEvent.click(screen.getByRole('button', { name: label }));
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

    it('não exibe o banner de alterações pendentes inicialmente', () => {
      expect(screen.queryByText(/alteraç(ão|ões) pendente/)).not.toBeInTheDocument();
    });
  });

  // ── Ação: Aceitar ─────────────────────────────────────────────────────────
  //
  // O componente usa fluxo de dois passos:
  //   1. Clique em "Aceitar" → marca o item como staged (badge "Marcado para aceitar",
  //      botão passa a exibir "✓ Aceitar", banner de alterações pendentes aparece).
  //   2. Clique em "Confirmar alterações" (banner) → modal abre.
  //      Clique em "Confirmar 1 alteração" (modal) → delay de 800 ms → item vai
  //      para o histórico com badge "✓ Aceito".

  describe('Aceitar solicitação', () => {
    beforeEach(renderLoaded);

    it('altera o texto do botão para "✓ Aceitar" ao clicar', () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);

      expect(screen.getByRole('button', { name: '✓ Aceitar' })).toBeInTheDocument();
    });

    it('exibe badge "Marcado para aceitar" no card', () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);

      expect(screen.getByText('Marcado para aceitar')).toBeInTheDocument();
    });

    it('exibe o banner de alterações pendentes após marcar', () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);

      expect(getBannerPendente(1)).toBeInTheDocument();
    });

    it('exibe "Confirmando..." no botão do modal durante o processamento', () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);
      confirmarAlteracoes(1);

      expect(screen.getByRole('button', { name: 'Confirmando...' })).toBeInTheDocument();
    });

    it('desabilita os botões do modal durante o processamento', () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);
      confirmarAlteracoes(1);

      // "Cancelar" e "Confirmando..." ficam desabilitados durante o processamento
      screen
        .getAllByRole('button', { name: /Cancelar|Confirmando\.\.\./ })
        .filter((btn) => btn.closest('[class*="max-w-md"]')) // apenas botões do modal
        .forEach((btn) => expect(btn).toBeDisabled());
    });

    it('exibe badge "✓ Aceito" após os 800 ms de processamento', async () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);
      confirmarAlteracoes(1);
      await advance(800);

      expect(screen.getByText('✓ Aceito')).toBeInTheDocument();
    });

    it('move o card para a seção "Histórico de solicitações"', async () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);
      confirmarAlteracoes(1);
      await advance(800);

      expect(screen.getByText('Histórico de solicitações')).toBeInTheDocument();
    });

    it('reduz a lista de pendentes de 3 para 2 após confirmar', async () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);
      confirmarAlteracoes(1);
      await advance(800);

      expect(screen.getAllByRole('button', { name: 'Aceitar' })).toHaveLength(2);
    });
  });

  // ── Ação: Recusar ─────────────────────────────────────────────────────────

  describe('Recusar solicitação', () => {
    beforeEach(renderLoaded);

    it('altera o texto do botão para "✗ Recusar" ao clicar', () => {
      const [primeiroRecusar] = screen.getAllByRole('button', { name: 'Recusar' });
      fireEvent.click(primeiroRecusar);

      expect(screen.getByRole('button', { name: '✗ Recusar' })).toBeInTheDocument();
    });

    it('exibe badge "Marcado para recusar" no card', () => {
      const [primeiroRecusar] = screen.getAllByRole('button', { name: 'Recusar' });
      fireEvent.click(primeiroRecusar);

      expect(screen.getByText('Marcado para recusar')).toBeInTheDocument();
    });

    it('exibe badge "✗ Recusado" após os 800 ms de processamento', async () => {
      const [primeiroRecusar] = screen.getAllByRole('button', { name: 'Recusar' });
      fireEvent.click(primeiroRecusar);
      confirmarAlteracoes(1);
      await advance(800);

      expect(screen.getByText('✗ Recusado')).toBeInTheDocument();
    });

    it('move o card para a seção "Histórico de solicitações"', async () => {
      const [primeiroRecusar] = screen.getAllByRole('button', { name: 'Recusar' });
      fireEvent.click(primeiroRecusar);
      confirmarAlteracoes(1);
      await advance(800);

      expect(screen.getByText('Histórico de solicitações')).toBeInTheDocument();
    });

    it('reduz a lista de pendentes de 3 para 2 após confirmar', async () => {
      const [primeiroRecusar] = screen.getAllByRole('button', { name: 'Recusar' });
      fireEvent.click(primeiroRecusar);
      confirmarAlteracoes(1);
      await advance(800);

      expect(screen.getAllByRole('button', { name: 'Recusar' })).toHaveLength(2);
    });
  });

  // ── Ação: Reverter ────────────────────────────────────────────────────────

  describe('Reverter solicitação', () => {
    /** Aceita a primeira solicitação pelo fluxo completo antes de cada teste. */
    beforeEach(async () => {
      await renderLoaded();
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar);
      confirmarAlteracoes(1);
      await advance(800);
    });

    it('exibe o botão "Reverter" na seção de histórico', () => {
      expect(screen.getByRole('button', { name: 'Reverter' })).toBeInTheDocument();
    });

    it('exibe "Revertendo..." durante o processamento', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));

      expect(screen.getByRole('button', { name: 'Revertendo...' })).toBeInTheDocument();
    });

    it('retorna o card para a lista de pendentes ao reverter', async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
      await advance(600);

      expect(screen.getAllByRole('button', { name: 'Aceitar' })).toHaveLength(3);
    });

    it('remove a seção "Histórico" quando não há mais itens processados', async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
      await advance(600);

      expect(screen.queryByText('Histórico de solicitações')).not.toBeInTheDocument();
    });

    it('remove o badge "✓ Aceito" após reverter', async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reverter' }));
      await advance(600);

      expect(screen.queryByText('✓ Aceito')).not.toBeInTheDocument();
    });
  });

  // ── Múltiplas ações simultâneas ───────────────────────────────────────────

  describe('Múltiplas ações independentes', () => {
    beforeEach(renderLoaded);

    it('permite aceitar e recusar cards diferentes de forma independente', async () => {
      const aceitarButtons = screen.getAllByRole('button', { name: 'Aceitar' });
      const recusarButtons = screen.getAllByRole('button', { name: 'Recusar' });

      fireEvent.click(aceitarButtons[0]); // Marca Maria Silva para aceitar
      fireEvent.click(recusarButtons[1]); // Marca João Santos para recusar

      // Confirma as 2 alterações staged de uma só vez
      confirmarAlteracoes(2);
      await advance(800);

      expect(screen.getByText('✓ Aceito')).toBeInTheDocument();
      expect(screen.getByText('✗ Recusado')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'Aceitar' })).toHaveLength(1);
    });

    it('exibe contagem correta no banner ao marcar múltiplos cards', () => {
      const aceitarButtons = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(aceitarButtons[0]);
      fireEvent.click(aceitarButtons[1]);

      expect(getBannerPendente(2)).toBeInTheDocument();
    });

    it('toggle: clicar no mesmo botão duas vezes remove a decisão staged', () => {
      const [primeiroAceitar] = screen.getAllByRole('button', { name: 'Aceitar' });
      fireEvent.click(primeiroAceitar); // marca
      fireEvent.click(screen.getByRole('button', { name: '✓ Aceitar' })); // desmarca

      expect(screen.queryByText('Marcado para aceitar')).not.toBeInTheDocument();
      expect(screen.queryByText(/alteração pendente/)).not.toBeInTheDocument();
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