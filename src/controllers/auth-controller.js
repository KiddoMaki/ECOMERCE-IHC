import { sessionModel } from "../models/session-model.js";
import { authConfigured, invalidateAccessToken, neonAuth } from "../client/neon-auth-client.js";

export function createAuthController(onAuthenticated) {
  return {
    async restoreSession() {
      if (!authConfigured) {
        sessionModel.setUser(null);
        return;
      }
      const { data, error } = await neonAuth.adapter.getSession();
      if (error) throw new Error(error.message || "No se pudo recuperar la sesión.");
      sessionModel.setUser(data?.user || data?.session?.user || null);
    },
    async signIn(form) {
      if (!form.reportValidity()) return false;
      if (!authConfigured) throw new Error("La autenticación no está configurada.");
      invalidateAccessToken();
      const { email, password } = Object.fromEntries(new FormData(form));
      const result = await neonAuth.adapter.signIn.email({
        email: String(email).trim(),
        password: String(password)
      });
      if (result.error) throw new Error(result.error.message || "No se pudo iniciar sesión.");
      await this.restoreSession();
      if (!sessionModel.isSignedIn()) throw new Error("La sesión no quedó iniciada. Verifica tu correo e inténtalo de nuevo.");
      onAuthenticated();
      return true;
    },
    async signUp(form) {
      if (!form.reportValidity()) return false;
      if (!authConfigured) throw new Error("La autenticación no está configurada.");
      invalidateAccessToken();
      const { name, email, password } = Object.fromEntries(new FormData(form));
      const result = await neonAuth.adapter.signUp.email({
        name: String(name).trim(),
        email: String(email).trim(),
        password: String(password)
      });
      if (result.error) throw new Error(result.error.message || "No se pudo crear la cuenta.");
      await this.restoreSession();
      if (sessionModel.isSignedIn()) onAuthenticated();
      return sessionModel.isSignedIn();
    },
    async signOut() {
      if (!neonAuth) {
        sessionModel.setUser(null);
        return;
      }
      const { error } = await neonAuth.adapter.signOut();
      if (error) throw new Error(error.message || "No se pudo cerrar la sesión.");
      invalidateAccessToken();
      sessionModel.setUser(null);
    }
  };
}
