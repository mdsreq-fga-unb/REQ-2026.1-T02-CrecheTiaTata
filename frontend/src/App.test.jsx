import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { saveAuthToken } from './utils/authStorage';

describe('App authentication routes', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it('mostra o site público quando não há token válido', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /ajudando crianças e famílias com amor/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar\/criar conta/i })).toBeInTheDocument();
  });

  it('exige login ao tentar doar sem token válido', async () => {
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: /fazer uma doação/i }));

    expect(window.location.pathname).toBe('/login');
    expect(window.location.search).toBe(`?modo=cadastro&redirect=${encodeURIComponent('/contato?acao=doar')}`);
  });

  it('leva a pessoa direto para a ação quando há token válido', async () => {
    saveAuthToken('jwt-token');
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: /fazer uma doação/i }));

    expect(window.location.pathname).toBe('/contato');
    expect(window.location.search).toBe('?acao=doar');
  });

  it('permite sair para testar novamente a tela de login', async () => {
    saveAuthToken('jwt-token');
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: /sair/i }));

    expect(window.location.pathname).toBe('/login');
    expect(window.location.search).toBe('?modo=cadastro');
  });
});
