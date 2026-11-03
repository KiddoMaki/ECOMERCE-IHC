import { createRemoteJWKSet, jwtVerify } from "jose";
import { query } from "../database.js";

let jwks;

function getJwks() {
  const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
  if (!jwksUrl) return null;
  if (!jwks) jwks = createRemoteJWKSet(new URL(jwksUrl));
  return jwks;
}

export async function requireAuth(request, response, next) {
  if (!process.env.NEON_AUTH_JWKS_URL || !process.env.NEON_AUTH_BASE_URL) {
    response.status(503).json({ error: "La autenticación no está configurada en el servidor." });
    return;
  }

  const token = request.get("authorization")?.match(/^Bearer ([^\s]+)$/i)?.[1];
  if (!token) {
    response.status(401).json({ error: "Inicia sesión para continuar." });
    return;
  }

  try {
    const keys = getJwks();
    const issuer = new URL(process.env.NEON_AUTH_BASE_URL).origin;
    const { payload } = await jwtVerify(token, keys, { issuer });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      (payload.emailVerified !== true && payload.email_verified !== true) ||
      payload.email.length > 254
    ) {
      response.status(403).json({ error: "Verifica tu correo electrónico para continuar." });
      return;
    }

    const name = typeof payload.name === "string" && payload.name.trim()
      ? payload.name.trim().slice(0, 120)
      : payload.email;
    const { rows } = await query(
      `INSERT INTO users (auth_user_id, name, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (auth_user_id) DO UPDATE
         SET name = EXCLUDED.name, email = EXCLUDED.email
       RETURNING user_id, name, status`,
      [payload.sub, name, payload.email.trim().toLowerCase()]
    );
    if (!rows[0] || rows[0].status !== "active") {
      response.status(403).json({ error: "La cuenta no puede realizar esta operación." });
      return;
    }
    request.authUser = { id: rows[0].user_id, subject: payload.sub, email: payload.email, name: rows[0].name };
    next();
  } catch (error) {
    if (error.code === "ERR_JWT_EXPIRED" || error.code === "ERR_JWS_INVALID" ||
        error.code === "ERR_JWT_INVALID" || error.code === "ERR_JWT_CLAIM_VALIDATION_FAILED" ||
        error.code === "ERR_JWKS_NO_MATCHING_KEY" || error.code === "ERR_JWKS_TIMEOUT") {
      response.status(401).json({ error: "La sesión no es válida o expiró. Inicia sesión nuevamente." });
      return;
    }
    next(error);
  }
}
