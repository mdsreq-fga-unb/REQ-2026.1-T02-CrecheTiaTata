import { buildApiUrl } from '../config/api';
import { getAuthToken } from '../utils/authStorage';

export const TIPOS_DOACAO = [
  'dinheiro',
  'alimento',
  'roupa',
  'brinquedo',
  'material',
  'outro',
];

export const TIPOS_DOADOR = ['pessoa_fisica', 'pessoa_juridica'];

export class ContribuicaoApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ContribuicaoApiError';
    this.status = status;
  }
}

function buildHeaders() {
  const token = getAuthToken();
  if (!token) {
    throw new ContribuicaoApiError(
      'Sua sessão expirou. Entre novamente para continuar.',
      401,
    );
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (anonKey) {
    headers.apikey = anonKey;
  }

  return headers;
}

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ContribuicaoApiError(
      data?.error || fallbackMessage,
      response.status,
    );
  }

  return data;
}

async function listar(endpoint) {
  const response = await fetch(buildApiUrl(endpoint), {
    headers: buildHeaders(),
  });
  const data = await parseResponse(response, 'Não foi possível carregar os dados.');

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.data) ? data.data : [];
}

export function listarDoacoes() {
  return listar('/doacoes');
}

export function listarDoadores() {
  return listar('/doadores?incluir_historico=true');
}

export async function registrarDoacao(doacao) {
  const response = await fetch(buildApiUrl('/doacoes'), {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(doacao),
  });
  const data = await parseResponse(
    response,
    'Não foi possível registrar a doação.',
  );

  return data.doacao;
}

export async function registrarDoador(doador) {
  const response = await fetch(buildApiUrl('/doadores'), {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(doador),
  });
  const data = await parseResponse(
    response,
    'Não foi possível registrar o doador.',
  );

  return data.doador;
}

async function atualizar(endpoint, id, changes, fallbackMessage) {
  const response = await fetch(
    buildApiUrl(`${endpoint}?id=${encodeURIComponent(id)}`),
    {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(changes),
    },
  );
  const data = await parseResponse(response, fallbackMessage);

  return data.doacao ?? data.doador ?? data;
}

export function atualizarDoacao(id, changes) {
  return atualizar(
    '/doacoes',
    id,
    changes,
    'Não foi possível atualizar a doação.',
  );
}

export function atualizarDoador(id, changes) {
  return atualizar(
    '/doadores',
    id,
    changes,
    'Não foi possível atualizar o doador.',
  );
}
