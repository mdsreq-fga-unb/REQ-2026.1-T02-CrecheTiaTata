import { buildApiUrl } from '../config/api';
import { getAuthToken } from '../utils/authStorage';

export const CATEGORIAS_SOLICITACAO = [
  'alimentacao',
  'material',
  'voluntario',
  'financeiro',
  'outro',
];

export const STATUS_SOLICITACAO = [
  'pendente',
  'em_andamento',
  'concluida',
];

export class SolicitacaoApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'SolicitacaoApiError';
    this.status = status;
  }
}

function buildHeaders(authenticated = false) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (anonKey) {
    headers.apikey = anonKey;
  }

  if (authenticated) {
    const token = getAuthToken();
    if (!token) {
      throw new SolicitacaoApiError(
        'Sua sessão expirou. Entre novamente para publicar uma solicitação.',
        401,
      );
    }

    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function readResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new SolicitacaoApiError(
      data?.error || fallbackMessage,
      response.status,
    );
  }

  return data;
}

export async function listarSolicitacoes() {
  const response = await fetch(buildApiUrl('/solicitacoes'), {
    headers: buildHeaders(),
  });

  const data = await readResponse(
    response,
    'Não foi possível carregar as solicitações.',
  );

  return Array.isArray(data) ? data : [];
}

export async function publicarSolicitacao(solicitacao) {
  const response = await fetch(buildApiUrl('/solicitacoes'), {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(solicitacao),
  });

  const data = await readResponse(
    response,
    'Não foi possível publicar a solicitação.',
  );

  return data.solicitacao;
}
