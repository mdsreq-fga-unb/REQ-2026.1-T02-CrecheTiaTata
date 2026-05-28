const TOKEN_KEY = 'creche_tia_tata_auth_token';
const TOKEN_EXPIRATION_KEY = 'creche_tia_tata_auth_expires_at';
export const AUTH_SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function saveAuthToken(token, now = Date.now()) {
  const expiresAt = now + AUTH_SESSION_DURATION_MS;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRATION_KEY, String(expiresAt));

  return expiresAt;
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRATION_KEY);
}

export function getAuthToken() {
  if (!isAuthTokenValid()) {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthExpiration() {
  const expiration = Number(localStorage.getItem(TOKEN_EXPIRATION_KEY));
  return Number.isFinite(expiration) ? expiration : null;
}

export function getUserEmailFromToken() {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email ?? null;
  } catch {
    return null;
  }
}

export function isAuthTokenValid(now = Date.now()) {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiresAt = getAuthExpiration();

  if (!token || !expiresAt || expiresAt <= now) {
    clearAuthToken();
    return false;
  }

  return true;
}
