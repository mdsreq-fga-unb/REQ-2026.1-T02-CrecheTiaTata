import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveAuthToken } from '../utils/authStorage';
import {
  ContribuicaoApiError,
  listarDoacoes,
  listarDoadores,
  registrarDoacao,
  registrarDoador,
} from './contribuicoesService';

function response(status, data) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(data),
  };
}

describe('contribuicoesService', () => {
  beforeEach(() => {
    localStorage.clear();
    saveAuthToken('jwt-valido');
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it.each([
    ['/doacoes', listarDoacoes],
    ['/doadores?incluir_historico=true', listarDoadores],
  ])('lista %s com JWT e normaliza a resposta do backend', async (url, fn) => {
    const item = { id: '1' };
    fetch.mockResolvedValue(response(200, { data: [item], count: 1 }));

    await expect(fn()).resolves.toEqual([item]);
    expect(fetch).toHaveBeenCalledWith(url, {
      headers: expect.objectContaining({
        Authorization: 'Bearer jwt-valido',
      }),
    });
  });

  it('envia os dados da doação e retorna o objeto criado', async () => {
    const payload = {
      tipo: 'alimento',
      descricao: 'Cestas básicas',
      quantidade: 2,
    };
    const criada = { id: 'doacao-1', ...payload };
    fetch.mockResolvedValue(
      response(201, { registrada: true, doacao: criada }),
    );

    await expect(registrarDoacao(payload)).resolves.toEqual(criada);
    expect(fetch).toHaveBeenCalledWith('/doacoes', {
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        Authorization: 'Bearer jwt-valido',
      }),
      body: JSON.stringify(payload),
    });
  });

  it('envia os dados do doador e retorna o objeto criado', async () => {
    const payload = {
      nome: 'Ana',
      tipo: 'pessoa_fisica',
      email: 'ana@gmail.com',
    };
    const criado = { id: 'doador-1', ...payload };
    fetch.mockResolvedValue(
      response(201, { registrado: true, doador: criado }),
    );

    await expect(registrarDoador(payload)).resolves.toEqual(criado);
    expect(fetch).toHaveBeenCalledWith('/doadores', {
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        Authorization: 'Bearer jwt-valido',
      }),
      body: JSON.stringify(payload),
    });
  });

  it.each([400, 401, 422])(
    'preserva mensagem e status do erro HTTP %s',
    async (status) => {
      fetch.mockResolvedValue(
        response(status, { error: `Falha HTTP ${status}` }),
      );

      const promise = registrarDoador({
        nome: 'Ana',
        tipo: 'pessoa_fisica',
      });

      await expect(promise).rejects.toBeInstanceOf(ContribuicaoApiError);
      await expect(promise).rejects.toMatchObject({
        message: `Falha HTTP ${status}`,
        status,
      });
    },
  );

  it('bloqueia requisições quando o token não é válido', async () => {
    localStorage.clear();

    await expect(
      registrarDoacao({
        tipo: 'roupa',
        descricao: 'Roupas infantis',
        quantidade: 1,
      }),
    ).rejects.toMatchObject({ status: 401 });
    expect(fetch).not.toHaveBeenCalled();
  });
});
