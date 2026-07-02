import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage';
import { AUTH_SESSION_DURATION_MS, isAuthTokenValid } from '../utils/authStorage';

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/login');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renderiza campos de email, senha e botão de entrar', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /esqueci minha senha/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar ao início/i })).toBeInTheDocument();
  });

  it('volta para a página inicial ao clicar em voltar ao início', async () => {
    render(<LoginPage />);

    await userEvent.click(screen.getByRole('button', { name: /voltar ao início/i }));

    expect(window.location.pathname).toBe('/');
  });

  it('renderiza modo de criação de conta quando solicitado pela ação protegida', () => {
    window.history.pushState({}, '', `/login?modo=cadastro&redirect=${encodeURIComponent('/contato?acao=doar')}`);

    render(<LoginPage />);

    expect(screen.getByRole('heading', { level: 2, name: /criar conta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('cria conta e volta para a ação solicitada', async () => {
    window.history.pushState({}, '', `/login?modo=cadastro&redirect=${encodeURIComponent('/contato?acao=doar')}`);

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ criado: true, token: 'jwt-token' }),
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/nome/i), 'Maria Silva');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'maria@email.com');
    await userEvent.type(screen.getByLabelText(/^Senha$/i), 'senha123');
    await userEvent.type(screen.getByLabelText(/confirmar senha/i), 'senha123');
    await userEvent.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Maria Silva', email: 'maria@email.com', password: 'senha123' }),
      });
      expect(localStorage.getItem('creche_tia_tata_auth_token')).toBe('jwt-token');
      expect(window.location.pathname).toBe('/contato');
      expect(window.location.search).toBe('?acao=doar');
    });
  });

  it('envia a requisição de login ao clicar em entrar', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'jwt-token' }),
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'usuario@email.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'senha123');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'usuario@email.com', password: 'senha123' }),
      });
    });
  });

  it('permite entrar com o login padrão sem backend', async () => {
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'admin@crechetiatata.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'admin123');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(localStorage.getItem('creche_tia_tata_auth_token')).toBe('local-dev-jwt-token');
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/');
  });

  it('exibe erro para usuário inexistente', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ code: 'USER_NOT_FOUND' }),
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'naoexiste@email.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'senha123');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/usuário inexistente/i);
  });

  it('exibe erro para senha incorreta', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ code: 'INVALID_PASSWORD' }),
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'usuario@email.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'errada123');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/senha incorreta/i);
  });

  it('exibe erro genérico em falha inesperada', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'usuario@email.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'senha123');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível entrar agora/i);
  });

  it('armazena o JWT por uma semana e redireciona para a página principal', async () => {
    const now = 1_800_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'jwt-token' }),
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'usuario@email.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'senha123');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(localStorage.getItem('creche_tia_tata_auth_token')).toBe('jwt-token');
    });
    expect(localStorage.getItem('creche_tia_tata_auth_expires_at')).toBe(String(now + AUTH_SESSION_DURATION_MS));
    expect(isAuthTokenValid(now + AUTH_SESSION_DURATION_MS - 1)).toBe(true);
    expect(window.location.pathname).toBe('/');
  });

  it('redireciona para a ação solicitada depois do login', async () => {
    window.history.pushState({}, '', `/login?redirect=${encodeURIComponent('/contato?acao=voluntario')}`);
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'jwt-token' }),
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'usuario@email.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'senha123');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/contato');
    });
    expect(window.location.search).toBe('?acao=voluntario');
  });
});
