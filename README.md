# PichuPaper

Tienda web de papelería con frontend estático y API Express. Neon PostgreSQL almacena catálogo, cuentas de perfil, direcciones, reseñas, pedidos y estados de pago. La autenticación de cuentas usa Neon Auth.

## Funcionalidad

- Catálogo, filtros combinables, detalle de producto, galería y variantes cargados desde la API.
- Registro, inicio y cierre de sesión con Neon Auth; las cuentas se recuperan al volver a abrir el sitio.
- Carrito persistente por cuenta; requiere sesión para añadir productos y registrar pedidos.
- Pedidos con precios y variantes recalculados en el servidor, vinculados a la cuenta y guardados como pendientes.
- Reseñas persistentes asociadas a la cuenta.
- El checkout valida localmente el formato de tarjeta o cuenta para la interfaz, pero no procesa ni verifica pagos. Los valores ingresados se borran antes de revisar el pedido y nunca se envían ni guardan; no ingreses datos financieros reales. El costo de envío queda por coordinar.
- Diseño adaptable, controles accesibles y navegación interna con rutas de fragmento (`#/...`).

## Estructura

- `index.html`, `style.css`, `script.js`: aplicación del navegador.
- `src/models/`, `src/views/`, `src/controllers/`: modelos y vistas MVC para cuenta y contacto; `src/client/` conecta Neon Auth y el API.
- `api/`: Express, verificación JWT con las claves públicas de Neon Auth, consultas PostgreSQL y endpoints de catálogo, reseñas y pedidos.
- `sql/pichupaper_schema.sql`: esquema canónico.
- `sql/migrations/001_neon_auth_profiles.sql`: vincula perfiles existentes con IDs de Neon Auth.
- `sql/catalog_seed.sql`: carga idempotente del catálogo inicial.
- `scripts/build-static.mjs`: copia recursos públicos y compila el JavaScript del navegador a `dist/`.
- `DEPLOY.md`: configuración local, Neon, Render y Netlify.

## Configuración

1. Crea `.env.local` en la raíz y configura `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL` y, para la compilación, `PICHUPAPER_API_URL`. Usa `.env.example` como referencia; nunca publiques los valores privados.
2. En la base Neon que ya tiene el esquema anterior, aplica una vez `sql/migrations/001_neon_auth_profiles.sql` y luego `sql/catalog_seed.sql`. No vuelvas a ejecutar el esquema completo sobre una base con datos.
3. En una base nueva, ejecuta `sql/pichupaper_schema.sql` y después `sql/catalog_seed.sql`; no ejecutes la migración de perfiles adicional.
4. En Neon Auth, registra como dominio de confianza el dominio local y el de Netlify. Configura un proveedor de correo para la verificación de cuentas en producción.
5. Inicia el API en `api/` con `npm install` y `npm start`.
6. Desde la raíz, ejecuta `npm install`, configura las variables requeridas y `npm start` para compilar e iniciar la aplicación local. La compilación de despliegue usa `npm run build` y publica `dist/`.

El API debe recibir `DATABASE_URL`, `NEON_AUTH_BASE_URL` y `NEON_AUTH_JWKS_URL`. Netlify requiere `PICHUPAPER_API_URL` (origen HTTPS del API) y `NEON_AUTH_BASE_URL` (URL pública de Neon Auth). Configura el origen exacto del sitio en `ALLOWED_ORIGINS` del API.

## Despliegue

- Netlify: base del proyecto en la raíz, comando `npm run build`, directorio de publicación `dist`.
- Render: Root Directory `api`, Build Command `npm install`, Start Command `npm start`.
- No se suben archivos `.env.local`, credenciales, URLs de conexión ni secretos del API.

El estado pendiente del pago y la coordinación del envío se muestran deliberadamente: la aplicación registra pedidos, pero no cuenta con pasarela de pago ni confirmación operativa del vendedor.
