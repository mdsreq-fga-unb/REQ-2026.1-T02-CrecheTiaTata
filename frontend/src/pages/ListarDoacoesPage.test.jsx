import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveAuthToken } from '../utils/authStorage';
import {
  validarDoacao,
  validarDoador,
} from '../utils/contribuicaoValidation';
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
    await screen.findByRole('heading', { name: data[0].descricao });
  } else {
    await screen.findByText('Nenhuma doação registrada');
  }
}

describe('ListarDoacoesPage — RF-02 e RF-05', () => {
  beforeEach(() => {
    localStorage.clear();
    saveAuthToken('jwt-valido');
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('lista as doações usando o contrato real do backend', async () => {
    await renderDoacoes([doacaoExistente]);

    expect(screen.getByText('Alimento')).toBeInTheDocument();
    expect(screen.getByText(/10 unidades/i)).toBeInTheDocument();
    expect(screen.getByText(/Maria/)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/doacoes',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-valido',
        }),
      }),
    );
  });

  it('alterna para a lista de doadores e interpreta { data, count }', async () => {
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
    expect(screen.getByText(doadorExistente.email)).toBeInTheDocument();
    expect(fetch).toHaveBeenLastCalledWith(
      '/doadores',
      expect.any(Object),
    );
  });

  it('abre, valida e fecha o formulário de doação', async () => {
    const user = userEvent.setup();
    await renderDoacoes();

    await user.click(
      screen.getByRole('button', { name: /\+ registrar doação/i }),
    );
    expect(
      screen.getByRole('dialog', { name: 'Registrar nova doação' }),
    ).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/quantidade/i));
    await user.click(
      screen.getByRole('button', { name: /^registrar doação$/i }),
    );

    expect(screen.getByText('Selecione o tipo da doação.')).toBeInTheDocument();
    expect(
      screen.getByText('Informe a descrição da doação.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'A quantidade deve ser um número inteiro maior que zero.',
      ),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('registra uma doação com JWT, confirma e atualiza a lista', async () => {
    const user = userEvent.setup();
    const novaDoacao = {
      id: 'doacao-2',
      doador_nome: 'João',
      tipo: 'material',
      descricao: 'Cadernos e lápis',
      quantidade: 5,
      data_doacao: '2026-07-02',
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
      'Cadernos e lápis',
    );
    await user.clear(screen.getByLabelText(/quantidade/i));
    await user.type(screen.getByLabelText(/quantidade/i), '5');
    await user.type(screen.getByLabelText(/data da doação/i), '2026-07-02');
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
    expect(fetch).toHaveBeenCalledTimes(3);

    const [, postOptions] = fetch.mock.calls[1];
    expect(postOptions).toEqual(
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-valido',
        }),
        body: JSON.stringify({
          tipo: 'material',
          descricao: 'Cadernos e lápis',
          quantidade: 5,
          doador_nome: 'João',
          data_doacao: '2026-07-02',
        }),
      }),
    );
  });

  it('exibe erro da API ao registrar uma doação', async () => {
    const user = userEvent.setup();
    fetch
      .mockResolvedValueOnce(response(200, { data: [], count: 0 }))
      .mockResolvedValueOnce(
        response(422, { error: 'Quantidade deve ser maior que zero' }),
      );

    render(<ListarDoacoesPage />);
    await screen.findByText('Nenhuma doação registrada');
    await user.click(
      screen.getByRole('button', { name: /\+ registrar doação/i }),
    );
    await user.selectOptions(screen.getByLabelText(/^tipo/i), 'alimento');
    await user.type(screen.getByLabelText(/descrição/i), 'Alimentos');
    await user.click(
      screen.getByRole('button', { name: /^registrar doação$/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Quantidade deve ser maior que zero',
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('valida o nome e o e-mail antes de registrar um doador', async () => {
    const user = userEvent.setup();
    fetch
      .mockResolvedValueOnce(response(200, { data: [], count: 0 }))
      .mockResolvedValueOnce(response(200, { data: [], count: 0 }));

    render(<ListarDoacoesPage />);
    await screen.findByText('Nenhuma doação registrada');
    await user.click(screen.getByRole('button', { name: 'Doadores' }));
    await screen.findByText('Nenhum doador registrado');
    await user.click(
      screen.getByRole('button', { name: /\+ registrar doador/i }),
    );
    await user.type(screen.getByLabelText(/e-mail/i), 'email@invalido.com');
    await user.click(
      screen.getByRole('button', { name: /^registrar doador$/i }),
    );

    expect(
      screen.getByText('Informe o nome do doador.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Informe um e-mail válido de um provedor reconhecido.',
      ),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('registra um doador com JWT, confirma e atualiza a lista', async () => {
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
    await user.type(screen.getByLabelText(/^nome/i), novoDoador.nome);
    await user.selectOptions(
      screen.getByLabelText(/^tipo/i),
      'pessoa_juridica',
    );
    await user.type(screen.getByLabelText(/e-mail/i), novoDoador.email);
    await user.type(screen.getByLabelText(/telefone/i), novoDoador.telefone);
    await user.click(
      screen.getByRole('button', { name: /^registrar doador$/i }),
    );

    expect(
      await screen.findByText('Doador registrado com sucesso.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: novoDoador.nome }),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(4);

    const [, postOptions] = fetch.mock.calls[2];
    expect(postOptions).toEqual(
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-valido',
        }),
        body: JSON.stringify({
          nome: novoDoador.nome,
          tipo: novoDoador.tipo,
          email: novoDoador.email,
          telefone: novoDoador.telefone,
        }),
      }),
    );
  });

  it('mantém o modal aberto e exibe erro ao falhar o cadastro do doador', async () => {
    const user = userEvent.setup();
    fetch
      .mockResolvedValueOnce(response(200, { data: [], count: 0 }))
      .mockResolvedValueOnce(response(200, { data: [], count: 0 }))
      .mockResolvedValueOnce(
        response(400, { error: 'E-mail já cadastrado' }),
      );

    render(<ListarDoacoesPage />);
    await screen.findByText('Nenhuma doação registrada');
    await user.click(screen.getByRole('button', { name: 'Doadores' }));
    await screen.findByText('Nenhum doador registrado');
    await user.click(
      screen.getByRole('button', { name: /\+ registrar doador/i }),
    );
    await user.type(screen.getByLabelText(/^nome/i), 'Ana Silva');
    await user.type(screen.getByLabelText(/e-mail/i), 'ana@gmail.com');
    await user.click(
      screen.getByRole('button', { name: /^registrar doador$/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'E-mail já cadastrado',
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('impede tipos e quantidades inválidos nas validações de domínio', () => {
    expect(
      validarDoacao({
        tipo: 'veiculo',
        descricao: 'Doação',
        quantidade: '1.5',
      }),
    ).toEqual({
      tipo: 'Selecione um tipo de doação válido.',
      quantidade: 'A quantidade deve ser um número inteiro maior que zero.',
    });

    expect(
      validarDoador({
        nome: 'Ana',
        tipo: 'anonimo',
        email: '',
      }),
    ).toEqual({
      tipo: 'Selecione um tipo de doador válido.',
    });
  });

  it('exibe erro de sessão sem gerar logs críticos ou tentar o POST', async () => {
    const user = userEvent.setup();
    await renderDoacoes();
    localStorage.clear();

    await user.click(
      screen.getByRole('button', { name: /\+ registrar doação/i }),
    );
    await user.selectOptions(screen.getByLabelText(/^tipo/i), 'roupa');
    await user.type(screen.getByLabelText(/descrição/i), 'Roupas infantis');
    await user.click(
      screen.getByRole('button', { name: /^registrar doação$/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Sua sessão expirou ou não é válida',
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });
});
