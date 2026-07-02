import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveAuthToken } from '../utils/authStorage';
import ListarDoacoesPage from './ListarDoacoesPage';

const doacaoExistente = {
  id: 'doacao-1',
  doador_nome: 'Maria',
  tipo: 'alimento',
  descricao: 'Cestas básicas',
  quantidade: 10,
  data_doacao: '2026-07-01',
};

const doadorExistente = {
  id: 'doador-1',
  nome: 'Ana Silva',
  tipo: 'pessoa_fisica',
  email: 'ana@gmail.com',
  telefone: '61999999999',
  historico_contribuicoes: [
    {
      id: 'historico-1',
      descricao: 'Cobertores',
      quantidade: 2,
      data_doacao: '2026-06-10',
    },
  ],
};

function response(status, data) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(data),
  };
}

async function renderDoacoes(data = []) {
  fetch.mockResolvedValueOnce(response(200, { data, count: data.length }));
  render(<ListarDoacoesPage />);

  if (data.length > 0) {
    await screen.findByRole('heading', {
      name: data[0].descricao ?? data[0].item,
    });
  } else {
    await screen.findByText('Nenhuma doação registrada');
  }
}

describe('ListarDoacoesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    saveAuthToken('jwt-valido');
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('lista doações usando o contrato real e preserva dados legados', async () => {
    await renderDoacoes([doacaoExistente]);

    expect(screen.getByText('Alimento')).toBeInTheDocument();
    expect(screen.getByText(/10 unidades/i)).toBeInTheDocument();
    expect(screen.getByText(/Maria/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quero Doar' })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/doacoes',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-valido',
        }),
      }),
    );
  });

  it('mostra edição para admin e oculta quando a simulação é desativada', async () => {
    const user = userEvent.setup();
    const legado = {
      id: 'legado-1',
      item: 'Leite em pó',
      categoria: 'Alimentação',
      urgencia: 'Alta',
      quantidade: 5,
    };
    await renderDoacoes([legado]);

    expect(screen.getByText('Alimentação')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();

    await user.click(
      screen.getByRole('checkbox', { name: 'Simular visão de Admin' }),
    );
    expect(
      screen.queryByRole('button', { name: 'Editar' }),
    ).not.toBeInTheDocument();
  });

  it('abre o modal de edição de uma doação', async () => {
    const user = userEvent.setup();
    await renderDoacoes([doacaoExistente]);

    await user.click(screen.getByRole('button', { name: 'Editar' }));
    expect(
      screen.getByRole('dialog', { name: 'Editar doação' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toHaveValue('Cestas básicas');
  });

  it('alterna para doadores e exibe o histórico de contribuições', async () => {
    const user = userEvent.setup();
    fetch
      .mockResolvedValueOnce(response(200, { data: [], count: 0 }))
      .mockResolvedValueOnce(
        response(200, { data: [doadorExistente], count: 1 }),
      );

    render(<ListarDoacoesPage />);
    await screen.findByText('Nenhuma doação registrada');
    await user.click(screen.getByRole('button', { name: 'Doadores' }));

    expect(
      await screen.findByRole('heading', { name: doadorExistente.nome }),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenLastCalledWith(
      '/doadores?incluir_historico=true',
      expect.any(Object),
    );

    await user.click(screen.getByRole('button', { name: 'Ver Doações' }));
    expect(
      screen.getByRole('dialog', { name: 'Histórico de doações' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Cobertores')).toBeInTheDocument();
  });

  it('valida os campos obrigatórios antes de registrar uma doação', async () => {
    const user = userEvent.setup();
    await renderDoacoes();

    await user.click(
      screen.getByRole('button', { name: /\+ registrar doação/i }),
    );
    await user.clear(screen.getByLabelText(/quantidade/i));
    await user.click(
      screen.getByRole('button', { name: /^registrar doação$/i }),
    );

    expect(screen.getByText('Selecione o tipo da doação.')).toBeInTheDocument();
    expect(
      screen.getByText('Informe a descrição da doação.'),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('registra uma doação com JWT e atualiza a lista', async () => {
    const user = userEvent.setup();
    const novaDoacao = {
      id: 'doacao-2',
      doador_nome: 'João',
      tipo: 'material',
      descricao: 'Cadernos e lápis',
      quantidade: 5,
    };

    fetch
      .mockResolvedValueOnce(response(200, { data: [], count: 0 }))
      .mockResolvedValueOnce(
        response(201, { registrada: true, doacao: novaDoacao }),
      )
      .mockResolvedValueOnce(
        response(200, { data: [novaDoacao], count: 1 }),
      );

    render(<ListarDoacoesPage />);
    await screen.findByText('Nenhuma doação registrada');
    await user.click(
      screen.getByRole('button', { name: /\+ registrar doação/i }),
    );
    await user.type(screen.getByLabelText(/nome do doador/i), 'João');
    await user.selectOptions(screen.getByLabelText(/^tipo/i), 'material');
    await user.type(
      screen.getByLabelText(/descrição/i),
      novaDoacao.descricao,
    );
    await user.clear(screen.getByLabelText(/quantidade/i));
    await user.type(screen.getByLabelText(/quantidade/i), '5');
    await user.click(
      screen.getByRole('button', { name: /^registrar doação$/i }),
    );

    expect(
      await screen.findByText('Doação registrada com sucesso.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: novaDoacao.descricao }),
    ).toBeInTheDocument();
    expect(fetch.mock.calls[1][1]).toEqual(
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-valido',
        }),
      }),
    );
  });

  it('valida e registra um doador com JWT', async () => {
    const user = userEvent.setup();
    const novoDoador = {
      id: 'doador-2',
      nome: 'Empresa Solidária',
      tipo: 'pessoa_juridica',
      email: 'contato@gmail.com',
      telefone: '6133334444',
    };

    fetch
      .mockResolvedValueOnce(response(200, { data: [], count: 0 }))
      .mockResolvedValueOnce(response(200, { data: [], count: 0 }))
      .mockResolvedValueOnce(
        response(201, { registrado: true, doador: novoDoador }),
      )
      .mockResolvedValueOnce(
        response(200, { data: [novoDoador], count: 1 }),
      );

    render(<ListarDoacoesPage />);
    await screen.findByText('Nenhuma doação registrada');
    await user.click(screen.getByRole('button', { name: 'Doadores' }));
    await screen.findByText('Nenhum doador registrado');
    await user.click(
      screen.getByRole('button', { name: /\+ registrar doador/i }),
    );

    await user.click(
      screen.getByRole('button', { name: /^registrar doador$/i }),
    );
    expect(
      screen.getByText('Informe o nome do doador.'),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^nome/i), novoDoador.nome);
    await user.selectOptions(
      screen.getByLabelText(/^tipo/i),
      novoDoador.tipo,
    );
    await user.type(screen.getByLabelText(/e-mail/i), novoDoador.email);
    await user.type(screen.getByLabelText(/telefone/i), novoDoador.telefone);
    await user.click(
      screen.getByRole('button', { name: /^registrar doador$/i }),
    );

    expect(
      await screen.findByText('Doador registrado com sucesso.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: novoDoador.nome }),
    ).toBeInTheDocument();
  });

  it('exibe erros de API sem quebrar a interface', async () => {
    const user = userEvent.setup();
    fetch.mockRejectedValueOnce(new Error('Servidor offline'));

    render(<ListarDoacoesPage />);

    expect(
      await screen.findByText('Ops! Tivemos um problema.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Itens Disponíveis')).toBeInTheDocument();

    localStorage.clear();
    await user.click(
      screen.getByRole('button', { name: /\+ registrar doação/i }),
    );
    await user.selectOptions(screen.getByLabelText(/^tipo/i), 'roupa');
    await user.type(screen.getByLabelText(/descrição/i), 'Roupas infantis');
    await user.click(
      screen.getByRole('button', { name: /^registrar doação$/i }),
    );
    expect(
      await screen.findByText(
        'Sua sessão expirou ou não é válida. Entre novamente.',
      ),
    ).toBeInTheDocument();
  });
});
