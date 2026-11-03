import { createInternalNeonAuth } from "@neon/auth";

const authUrl = window.PICHUPAPER_AUTH_URL?.trim().replace(/\/+$/, "") || "";

export const authConfigured = Boolean(authUrl);
export const neonAuth = authConfigured ? createInternalNeonAuth(authUrl) : null;

let cachedAccessToken = "";
let cachedAccessTokenExpiresAt = 0;
let accessTokenRequest = null;

function getTokenExpiration(token) {
  try {
    const encodedPayload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=")));
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function refreshAccessToken() {
  const response = await fetch(`${authUrl}/get-session`, {
    cache: "no-store",
    credentials: "include",
    headers: { Accept: "application/json" }
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || "No se pudo comprobar la sesión con el servidor de autenticación.");
  }
  if (!payload?.session) {
    cachedAccessToken = "";
    cachedAccessTokenExpiresAt = 0;
    throw new Error("Inicia sesión para continuar.");
  }

  const token = response.headers.get("set-auth-jwt") || payload.session.token;
  const expiresAt = typeof token === "string" ? getTokenExpiration(token) : 0;
  if (!token || expiresAt <= Date.now()) {
    cachedAccessToken = "";
    cachedAccessTokenExpiresAt = 0;
    throw new Error("La sesión no entregó un token vigente. Vuelve a iniciar sesión.");
  }
  cachedAccessToken = token;
  cachedAccessTokenExpiresAt = expiresAt;
  return token;
}

export function invalidateAccessToken() {
  cachedAccessToken = "";
  cachedAccessTokenExpiresAt = 0;
}

window.addEventListener("storage", (event) => {
  if (!event.key || event.key === "better-auth.message") invalidateAccessToken();
});

export async function getAccessToken() {
  if (!neonAuth) {
    throw new Error("La autenticación no está configurada.");
  }
  if (cachedAccessToken && cachedAccessTokenExpiresAt > Date.now() + 30_000) {
    return cachedAccessToken;
  }
  if (!accessTokenRequest) {
    accessTokenRequest = refreshAccessToken().finally(() => {
      accessTokenRequest = null;
    });
  }
  return accessTokenRequest;
}
