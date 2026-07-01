import { API_ENDPOINTS, buildApiUrl } from '../config/api';
import { DEFAULT_LOGIN, DEFAULT_LOGIN_TOKEN } from '../config/auth';

export const LOGIN_ERROR_MESSAGES = {
  userNotFound: 'Usuário inexistente. Verifique o e-mail informado.',
  incorrectPassword: 'Senha incorreta. Tente novamente.',
  unexpected: 'Não foi possível entrar agora. Tente novamente em alguns instantes.',
};

function getLoginErrorMessage(status, data) {
  const errorCode = data?.code ?? data?.error;
  const message = String(data?.message ?? '').toLowerCase();

  if (status === 404 || errorCode === 'USER_NOT_FOUND' || message.includes('usuário') || message.includes('usuario')) {
    return LOGIN_ERROR_MESSAGES.userNotFound;
  }

  if (status === 401 || errorCode === 'INVALID_PASSWORD' || message.includes('senha')) {
    return LOGIN_ERROR_MESSAGES.incorrectPassword;
  }

  return LOGIN_ERROR_MESSAGES.unexpected;
}

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function loginUser({ email, password }) {
  if (email === DEFAULT_LOGIN.email && password === DEFAULT_LOGIN.password) {
    return {
      token: DEFAULT_LOGIN_TOKEN,
      user: {
        email: DEFAULT_LOGIN.email,
        name: 'Administrador',
      },
    };
  }

  const response = await fetch(buildApiUrl(API_ENDPOINTS.login), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(getLoginErrorMessage(response.status, data));
  }

  const token = data.token ?? data.accessToken ?? data.jwt;

  if (!token) {
    throw new Error(LOGIN_ERROR_MESSAGES.unexpected);
  }

  return { token, user: data.user ?? null };
}
