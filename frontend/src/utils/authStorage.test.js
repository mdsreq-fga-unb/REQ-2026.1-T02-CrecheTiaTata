import { beforeEach, describe, expect, it } from 'vitest';
import {
  AUTH_SESSION_DURATION_MS,
  clearAuthToken,
  getAuthToken,
  isAuthTokenValid,
  saveAuthToken,
} from './authStorage';

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retorna o token enquanto a sessão está válida', () => {
    const now = 1_800_000_000_000;

    saveAuthToken('jwt-token', now);

    expect(getAuthToken()).toBe('jwt-token');
    expect(isAuthTokenValid(now + AUTH_SESSION_DURATION_MS - 1)).toBe(true);
  });

  it('remove o token quando a sessão expira', () => {
    const now = 1_800_000_000_000;

    saveAuthToken('jwt-token', now);

    expect(isAuthTokenValid(now + AUTH_SESSION_DURATION_MS)).toBe(false);
    expect(getAuthToken()).toBeNull();
  });

  it('limpa token e data de expiração', () => {
    saveAuthToken('jwt-token');

    clearAuthToken();

    expect(getAuthToken()).toBeNull();
  });
});
