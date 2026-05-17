export const DEFAULT_LOGIN = {
  email: import.meta.env.VITE_DEFAULT_LOGIN_EMAIL ?? 'admin@crechetiatata.com',
  password: import.meta.env.VITE_DEFAULT_LOGIN_PASSWORD ?? 'admin123',
};

export const DEFAULT_LOGIN_TOKEN = 'local-dev-jwt-token';
