import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveAuthToken } from '../utils/authStorage';
import {
  listarSolicitacoes,
  publicarSolicitacao,
  SolicitacaoApiError,
} from './solicitacoesService';

describe('solicitacoesService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('lista solicitações sem exigir autenticação', async () => {
    const solicitacoes = [{ id: '1', titulo: 'Fraldas' }];
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(solicitacoes),
    });

    await expect(listarSolicitacoes()).resolves.toEqual(solicitacoes);
    expect(fetch).toHaveBeenCalledWith(
      '/solicitacoes',
      expect.objectContaining({
        headers: expect.not.objectContaining({ Authorization: expect.anything() }),
      }),
    );
  });

  it('publica com JWT e retorna a solicitação criada no status 201', async () => {
    saveAuthToken('jwt-valido');
    const payload = {
      titulo: 'Material escolar',
      descricao: 'Precisamos de lápis e cadernos.',
      categoria: 'material',
      status: 'pendente',
    };
    const criada = { id: '2', ...payload };

    fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: vi.fn().mockResolvedValue({
        publicada: true,
        solicitacao: criada,
      }),
    });

    await expect(publicarSolicitacao(payload)).resolves.toEqual(criada);
    expect(fetch).toHaveBeenCalledWith('/solicitacoes', {
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        Authorization: 'Bearer jwt-valido',
      }),
      body: JSON.stringify(payload),
    });
  });

  it('impede o POST quando não existe um token válido', async () => {
    await expect(
      publicarSolicitacao({
        titulo: 'Fraldas',
        descricao: 'Fraldas infantis.',
        categoria: 'material',
        status: 'pendente',
      }),
    ).rejects.toMatchObject({
      status: 401,
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([400, 401, 422])(
    'preserva a mensagem e o status de erro HTTP %s',
    async (status) => {
      saveAuthToken('jwt-valido');
      fetch.mockResolvedValue({
        ok: false,
        status,
        json: vi.fn().mockResolvedValue({ error: `Erro ${status}` }),
      });

      const promise = publicarSolicitacao({
        titulo: 'Fraldas',
        descricao: 'Fraldas infantis.',
        categoria: 'material',
        status: 'pendente',
      });

      await expect(promise).rejects.toEqual(
        expect.objectContaining({
          message: `Erro ${status}`,
          status,
        }),
      );
      await expect(promise).rejects.toBeInstanceOf(SolicitacaoApiError);
    },
  );
});
