# Despliegue de PichuPaper

El frontend estático se publica en Netlify, el API Express en Render y PostgreSQL se aloja en Neon. No compartas ni publiques variables de conexión o claves.

## Neon y Neon Auth

El esquema canónico es [`sql/pichupaper_schema.sql`](./sql/pichupaper_schema.sql). Para la rama existente `production`, aplica una sola vez [`sql/migrations/001_neon_auth_profiles.sql`](./sql/migrations/001_neon_auth_profiles.sql) para vincular los perfiles con el `sub` de Neon Auth y después carga [`sql/catalog_seed.sql`](./sql/catalog_seed.sql). La semilla es idempotente para categorías, productos, variantes e imágenes. En una base nueva ejecuta primero el esquema y luego la semilla; no apliques la migración de perfiles adicional.

Neon Auth está habilitado en el proyecto. Registra el dominio local (`localhost`) y el dominio asignado por Netlify en los dominios de confianza de Neon Auth. Para producción, configura el envío de correo de verificación con un proveedor propio.

Variables del API:

- `DATABASE_URL`: conexión pooled de Neon, como secreto de Render.
- `NEON_AUTH_BASE_URL`: URL de Neon Auth.
- `NEON_AUTH_JWKS_URL`: URL JWKS publicada por Neon Auth, usada para verificar tokens.
- `ALLOWED_ORIGINS`: origen HTTPS exacto del sitio, sin ruta ni `/` final.
- `NODE_ENV=production`; Render proporciona `PORT`.

El middleware del API valida la firma JWT, emisor, expiración e identidad con las claves remotas de Neon Auth; exige correo verificado y vincula la cuenta a `users.auth_user_id`. Nunca confía en un ID enviado por el navegador.

## API en Render

- **Root Directory:** `api`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

Comprueba `GET /api/health` y `GET /api/productos`. El carrito (`GET/PUT /api/carrito`), los pedidos y la escritura de reseñas requieren un token válido. El API calcula el subtotal usando precios de PostgreSQL, asocia el pedido al usuario y guarda pedido/pago como pendientes.

## Frontend en Netlify

- **Base directory:** raíz del repositorio.
- **Build command:** `npm run build`.
- **Publish directory:** `dist`.
- Variables de build:
  - `PICHUPAPER_API_URL`: origen HTTPS del API de Render, sin ruta ni `/` final.
  - `NEON_AUTH_BASE_URL`: URL pública de Neon Auth.

El bundle contiene solo estas URLs públicas y código cliente; no contiene credenciales de Neon ni variables privadas del API. El API debe permitir el dominio final de Netlify en `ALLOWED_ORIGINS`.

Si también se mantiene GitHub Pages, crea las variables de repositorio `PICHUPAPER_API_URL` y `NEON_AUTH_BASE_URL`; el workflow las utiliza al compilar. Añade el dominio de Pages a `ALLOWED_ORIGINS` y a los dominios de confianza de Neon Auth.

## Desarrollo local

En `.env.local` (ignorado por Git) configura `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL` y `PICHUPAPER_API_URL=http://localhost:3000`. Inicia el API desde `api/` y luego ejecuta `npm start` desde la raíz. El servidor compila `dist/` antes de servir el sitio en `http://127.0.0.1:4173`.

## Alcance de pago y entrega

No hay pasarela de pago ni integración para verificar transferencias. El checkout no solicita ni envía números de tarjeta/CVV, no marca pagos como aprobados y no fija un costo de envío. Los pedidos quedan pendientes y muestran explícitamente que ambos puntos deben coordinarse.

Antes de habilitar ventas reales, verifica los precios y disponibilidad del catálogo, el correo/datos del vendedor, las condiciones de entrega, la política de privacidad y los dominios de correo/Neon Auth. No publiques números de cuenta ni promesas de envío sin confirmarlos.
