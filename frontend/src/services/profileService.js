import { API_BASE_URL } from '../config/api';
import { getAuthToken } from '../utils/authStorage';

const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function buildHeaders() {
  return {
    'Content-Type': 'application/json',
    apikey: ANON_KEY,
    Authorization: `Bearer ${getAuthToken()}`,
  };
}

function buildUrl(email) {
  return `${API_BASE_URL}/functions/v1/usuarios?email=${encodeURIComponent(email)}`;
}

export async function updateProfile(email, changes) {
  const response = await fetch(buildUrl(email), {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(changes),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error || 'Falha ao atualizar os dados.');
  }

  return data;
}

export async function deleteAccount(email) {
  const response = await fetch(buildUrl(email), {
    method: 'DELETE',
    headers: buildHeaders(),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || 'Falha ao apagar a conta.');
  }
}
