import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveAuthToken } from '../utils/authStorage';
import { validarSolicitacao } from '../utils/solicitacaoValidation';
import ListarSolicitacoesPage from './ListarSolicitacoesPage';

const solicitacaoExistente = {
  id: '1',
  titulo: 'Fraldas infantis',
  descricao: 'Precisamos de fraldas tamanho P.',
  categoria: 'material',
  status: 'pendente',
};

const novaSolicitacao = {
  id: '2',
  titulo: 'Alimentos não perecíveis',
  descricao: 'Precisamos reforçar o estoque da cozinha.',
  categoria: 'alimentacao',
  status: 'pendente',
};

function response(status, data) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(data),
  };
}

async function renderLoaded(data = [solicitacaoExistente]) {
  fetch.mockResolvedValueOnce(response(200, data));
  render(<ListarSolicitacoesPage />);
  await screen.findByRole('heading', { name: /fraldas infantis/i });
}

async function preencherFormulario(user) {
  await user.type(
    screen.getByLabelText(/título/i),
    novaSolicitacao.titulo,
  );
  await user.type(
    screen.getByLabelText(/descrição/i),
    novaSolicitacao.descricao,
  );
  await user.selectOptions(
    screen.getByLabelText(/categoria/i),
    'alimentacao',
  );
}

describe('ListarSolicitacoesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('lista as solicitações retornadas pelo endpoint', async () => {
    await renderLoaded();

    expect(screen.getByText(solicitacaoExistente.descricao)).toBeInTheDocument();
    expect(screen.getByText('Material')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/solicitacoes', expect.any(Object));
  });

  it('abre e fecha o modal corretamente', async () => {
    const user = userEvent.setup();
    await renderLoaded();

    await user.click(
      screen.getByRole('button', { name: /nova solicitação/i }),
    );
    expect(
      screen.getByRole('dialog', { name: /publicar solicitação de apoio/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('valida os campos obrigatórios antes de enviar', async () => {
    const user = userEvent.setup();
    await renderLoaded();

    await user.click(
      screen.getByRole('button', { name: /nova solicitação/i }),
    );
    await user.click(
      screen.getByRole('button', { name: /^publicar solicitação$/i }),
    );

    expect(screen.getByText('Informe o título.')).toBeInTheDocument();
    expect(screen.getByText('Informe a descrição.')).toBeInTheDocument();
    expect(screen.getByText('Selecione uma categoria.')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('impede categoria e status fora dos valores permitidos', () => {
    const errors = validarSolicitacao({
      titulo: 'Pedido',
      descricao: 'Descrição do pedido',
      categoria: 'invalida',
      status: 'arquivada',
    });

    expect(errors.categoria).toBe('Selecione uma categoria válida.');
    expect(errors.status).toBe('Selecione um status válido.');
  });

  it('envia com JWT, fecha o modal e refaz a listagem após o status 201', async () => {
    const user = userEvent.setup();
    saveAuthToken('jwt-valido');
    fetch
      .mockResolvedValueOnce(response(200, [solicitacaoExistente]))
      .mockResolvedValueOnce(
        response(201, {
          publicada: true,
          solicitacao: novaSolicitacao,
        }),
      )
      .mockResolvedValueOnce(
        response(200, [novaSolicitacao, solicitacaoExistente]),
      );

    render(<ListarSolicitacoesPage />);
    await screen.findByRole('heading', { name: /fraldas infantis/i });

    await user.click(
      screen.getByRole('button', { name: /nova solicitação/i }),
    );
    await preencherFormulario(user);
    await user.click(
      screen.getByRole('button', { name: /^publicar solicitação$/i }),
    );

    expect(
      await screen.findByText('Solicitação publicada com sucesso.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: novaSolicitacao.titulo }),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(3);

    const [, postOptions] = fetch.mock.calls[1];
    expect(postOptions).toEqual(
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-valido',
        }),
        body: JSON.stringify({
          titulo: novaSolicitacao.titulo,
          descricao: novaSolicitacao.descricao,
          categoria: novaSolicitacao.categoria,
          status: 'pendente',
        }),
      }),
    );
  });

  it('exibe feedback de processamento durante o envio', async () => {
    const user = userEvent.setup();
    saveAuthToken('jwt-valido');
    let resolvePost;
    const pendingPost = new Promise((resolve) => {
      resolvePost = resolve;
    });

    fetch
      .mockResolvedValueOnce(response(200, [solicitacaoExistente]))
      .mockReturnValueOnce(pendingPost)
      .mockResolvedValueOnce(response(200, [novaSolicitacao]));

    render(<ListarSolicitacoesPage />);
    await screen.findByRole('heading', { name: /fraldas infantis/i });
    await user.click(
      screen.getByRole('button', { name: /nova solicitação/i }),
    );
    await preencherFormulario(user);
    await user.click(
      screen.getByRole('button', { name: /^publicar solicitação$/i }),
    );

    expect(
      screen.getByRole('button', { name: /publicando/i }),
    ).toBeDisabled();

    resolvePost(
      response(201, {
        publicada: true,
        solicitacao: novaSolicitacao,
      }),
    );

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it.each([
    [401, 'não é válida'],
    [422, 'Categoria inválida'],
    [400, 'Falha ao salvar no banco'],
  ])('exibe o erro HTTP %s sem fechar o modal', async (status, message) => {
    const user = userEvent.setup();
    saveAuthToken('jwt-valido');
    const apiMessage =
      status === 401
        ? 'Não autorizado'
        : status === 422
          ? 'Categoria inválida'
          : 'Falha ao salvar no banco';

    fetch
      .mockResolvedValueOnce(response(200, [solicitacaoExistente]))
      .mockResolvedValueOnce(response(status, { error: apiMessage }));

    render(<ListarSolicitacoesPage />);
    await screen.findByRole('heading', { name: /fraldas infantis/i });
    await user.click(
      screen.getByRole('button', { name: /nova solicitação/i }),
    );
    await preencherFormulario(user);
    await user.click(
      screen.getByRole('button', { name: /^publicar solicitação$/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(message);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
