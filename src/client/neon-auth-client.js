import { createInternalNeonAuth } from "@neon/auth";

const authUrl = window.PICHUPAPER_AUTH_URL?.trim().replace(/\/+$/, "") || "";

export const authConfigured = Boolean(authUrl);
export const neonAuth = authConfigured ? createInternalNeonAuth(authUrl) : null;

export async function getAccessToken() {
  if (!neonAuth) {
    throw new Error("La autenticación no está configurada.");
  }
  const token = await neonAuth.getJWTToken();
  if (!token) throw new Error("Inicia sesión para continuar.");
  return token;
}
