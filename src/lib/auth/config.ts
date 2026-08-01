export const SESSION_COOKIE = "bianbi_session";

/** Sesión válida por 30 días */
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export function getAuthPassword(): string | undefined {
  const value = process.env.AUTH_PASSWORD?.trim();
  return value || undefined;
}

export function getAuthSecret(): string | undefined {
  const value = process.env.AUTH_SECRET?.trim();
  return value || undefined;
}
