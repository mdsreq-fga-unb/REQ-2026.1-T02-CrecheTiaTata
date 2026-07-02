import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DoarPage from './DoarPage';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../utils/navigation', () => ({
  navigateTo: vi.fn(),
}));


import { navigateTo } from '../utils/navigation';


const DEFAULT_SEARCH =
  '?id=1' +
  '&nome=Fraldas%20tamanho%20P' +
  '&urgencia=Alta' +
  '&descricao=Fraldas%20descart%C3%A1veis%20para%20beb%C3%AAs%20de%20at%C3%A9%204%20kg.';

/** Define window.location.search antes de renderizar o componente. */
const renderPage = (search = DEFAULT_SEARCH) => {
  Object.defineProperty(window, 'location', {
    value: { search },
    configurable: true,
    writable: true,
  });
  return render(<DoarPage />);
};

/** Avança os timers e aguarda o React processar as atualizações de estado. */
const advance = async (ms) => {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
};

/** Preenche todos os campos obrigatórios do formulário. */
const fillForm = () => {
  fireEvent.change(screen.getByPlaceholderText('Ex: 5 pacotes'), {
    target: { value: '5' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Rua das Flores/), {
    target: { value: 'Rua Teste, 123 — Centro, São Paulo' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Seg a Sex das 14h/), {
    target: { value: 'Seg a Sex das 9h às 18h' },
  });
};

/** Renderiza, preenche o formulário e submete, aguardando o envio (800 ms). */
const renderSubmitted = async () => {
  renderPage();
  fillForm();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }));
  await advance(800);
};

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('DoarPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Renderização inicial ──────────────────────────────────────────────────

  describe('Renderização inicial', () => {
    beforeEach(() => renderPage());

    it('exibe o título "Confirme sua doação"', () => {
      expect(
        screen.getByRole('heading', { name: 'Confirme sua doação' })
      ).toBeInTheDocument();
    });

    it('exibe o nome do item vindo da URL', () => {
      expect(screen.getByText('Fraldas tamanho P')).toBeInTheDocument();
    });

    it('exibe o badge de urgência do item', () => {
      expect(screen.getByText('Alta')).toBeInTheDocument();
    });

    it('exibe a descrição do item vinda da URL', () => {
      expect(
        screen.getByText(/Fraldas descartáveis para bebês de até 4 kg/)
      ).toBeInTheDocument();
    });

    it('exibe o campo de quantidade', () => {
      expect(screen.getByPlaceholderText('Ex: 5 pacotes')).toBeInTheDocument();
    });

    it('exibe o campo de endereço', () => {
      expect(screen.getByPlaceholderText(/Rua das Flores/)).toBeInTheDocument();
    });

    it('exibe o campo de horário', () => {
      expect(
        screen.getByPlaceholderText(/Seg a Sex das 14h/)
      ).toBeInTheDocument();
    });

    it('exibe o botão "Confirmar doação" habilitado', () => {
      const btn = screen.getByRole('button', { name: 'Confirmar doação' });
      expect(btn).toBeInTheDocument();
      expect(btn).not.toBeDisabled();
    });

    it('não exibe mensagem de erro inicialmente', () => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('exibe o botão "Voltar às solicitações"', () => {
      expect(
        screen.getByRole('button', { name: /voltar às solicitações/i })
      ).toBeInTheDocument();
    });
  });

  // ── Parâmetros da URL ─────────────────────────────────────────────────────

  describe('Parâmetros da URL', () => {
    it('usa "Item solicitado" como nome padrão quando o parâmetro está ausente', () => {
      renderPage('');
      expect(screen.getByText('Item solicitado')).toBeInTheDocument();
    });

    it('usa urgência "Baixa" como padrão quando o parâmetro está ausente', () => {
      renderPage('?nome=Teste');
      expect(screen.getByText('Baixa')).toBeInTheDocument();
    });

    it('não exibe descrição quando o parâmetro está ausente', () => {
      renderPage('?nome=Teste&urgencia=Média');
      // descricao fica vazia e o bloco condicional não renderiza nada
      expect(screen.queryByText(/descricao/i)).not.toBeInTheDocument();
    });

    it('exibe corretamente urgência Média com o badge correspondente', () => {
      renderPage('?nome=Cobertores&urgencia=M%C3%A9dia');
      expect(screen.getByText('Média')).toBeInTheDocument();
    });
  });

  // ── Validação ─────────────────────────────────────────────────────────────

  describe('Validação do formulário', () => {
    beforeEach(() => renderPage());

    it('exibe alerta ao submeter com todos os campos vazios', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }));
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('a mensagem de erro orienta o preenchimento de todos os campos', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }));
      expect(screen.getByRole('alert')).toHaveTextContent(
        /preencha todos os campos/i
      );
    });

    it('exibe erro ao submeter somente com quantidade preenchida', () => {
      fireEvent.change(screen.getByPlaceholderText('Ex: 5 pacotes'), {
        target: { value: '3' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }));
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('não exibe erro ao preencher todos os campos e submeter', async () => {
      fillForm();
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('não inicia o envio quando há campos vazios', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }));
      // Botão permanece com o texto original, sem entrar em estado de envio
      expect(
        screen.getByRole('button', { name: 'Confirmar doação' })
      ).toBeInTheDocument();
    });

    it('não chama navigateTo quando a validação falha', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }));
      expect(navigateTo).not.toHaveBeenCalled();
    });
  });

  // ── Fluxo de envio ────────────────────────────────────────────────────────

  describe('Fluxo de envio', () => {
    beforeEach(() => renderPage());

    it('exibe "Enviando..." no botão durante o processamento', () => {
      fillForm();
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }));
      expect(
        screen.getByRole('button', { name: 'Enviando...' })
      ).toBeInTheDocument();
    });

    it('desabilita o botão durante o processamento', () => {
      fillForm();
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }));
      expect(screen.getByRole('button', { name: 'Enviando...' })).toBeDisabled();
    });

    it('exibe a tela de sucesso após os 800 ms de processamento', async () => {
      fillForm();
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }));
      await advance(800);
      expect(
        screen.getByRole('heading', { name: 'Doação registrada!' })
      ).toBeInTheDocument();
    });

    it('não exibe mais o formulário após o envio ser concluído', async () => {
      fillForm();
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar doação' }));
      await advance(800);
      expect(
        screen.queryByRole('button', { name: 'Confirmar doação' })
      ).not.toBeInTheDocument();
    });
  });

  // ── Tela de sucesso ───────────────────────────────────────────────────────

  describe('Tela de sucesso', () => {
    beforeEach(renderSubmitted);

    it('exibe o título "Doação registrada!"', () => {
      expect(
        screen.getByRole('heading', { name: 'Doação registrada!' })
      ).toBeInTheDocument();
    });

    it('menciona o nome do item doado na mensagem de confirmação', () => {
      expect(screen.getByText(/Fraldas tamanho P/)).toBeInTheDocument();
    });

    it('exibe o botão "Ver outras solicitações"', () => {
      expect(
        screen.getByRole('button', { name: 'Ver outras solicitações' })
      ).toBeInTheDocument();
    });

    it('exibe o botão "Voltar ao início"', () => {
      expect(
        screen.getByRole('button', { name: 'Voltar ao início' })
      ).toBeInTheDocument();
    });

    it('"Ver outras solicitações" navega para /necessidades', () => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Ver outras solicitações' })
      );
      expect(navigateTo).toHaveBeenCalledWith('/necessidades');
    });

    it('"Voltar ao início" navega para "/"', () => {
      fireEvent.click(screen.getByRole('button', { name: 'Voltar ao início' }));
      expect(navigateTo).toHaveBeenCalledWith('/');
    });
  });

  // ── Navegação ─────────────────────────────────────────────────────────────

  describe('Navegação', () => {
    beforeEach(() => renderPage());

    it('"Voltar às solicitações" navega para /necessidades', () => {
      fireEvent.click(
        screen.getByRole('button', { name: /voltar às solicitações/i })
      );
      expect(navigateTo).toHaveBeenCalledWith('/necessidades');
    });

    it('"Voltar às solicitações" não inicia envio do formulário', () => {
      fireEvent.click(
        screen.getByRole('button', { name: /voltar às solicitações/i })
      );
      expect(
        screen.queryByRole('button', { name: 'Enviando...' })
      ).not.toBeInTheDocument();
    });
  });
});