// Validação de e-mail compartilhada entre as funções.
// Exige formato válido (com "@") e domínio na lista de provedores conhecidos.

export const DOMINIOS_PERMITIDOS = [
  "gmail.com",
  "outlook.com",
  "outlook.com.br",
  "hotmail.com",
  "hotmail.com.br",
  "live.com",
  "yahoo.com",
  "yahoo.com.br",
  "icloud.com",
  "proton.me",
  "protonmail.com",
];

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  const normalizado = email.trim().toLowerCase();
  if (!FORMATO_EMAIL.test(normalizado)) return false;

  const dominio = normalizado.split("@")[1];
  return DOMINIOS_PERMITIDOS.includes(dominio);
}
