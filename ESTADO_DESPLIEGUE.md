# Estado de despliegue — PichuPaper

## Implementado en la rama local

- Frontend estático compilado y aislado en `dist/`; la configuración pública se inyecta al compilar.
- Registro, inicio, restauración y cierre de sesión conectados al cliente de Neon Auth.
- API con validación JWT/JWKS, origen CORS explícito y verificación de correo.
- Catálogo, variantes y reseñas desde Neon; altas y modificaciones de reseña persistentes.
- Carrito persistente por cuenta en Neon, con control de variantes activas.
- Pedidos con usuario autenticado, dirección, productos/variantes verificados desde la base, subtotal recalculado y registros de pedido/pago en estado pendiente.
- No se piden datos de tarjeta ni CVV; no se confirma un pago o envío que el sistema no pueda verificar.
- Esquema actualizado, migración para la tabla ya desplegada y semilla de catálogo idempotente.

## Pendiente antes de publicar

| Tarea | Estado |
|---|---|
| Compilar y comprobar la aplicación local | Completado: build, navegación, registro y catálogo |
| Ejecutar migración de perfil en la rama Neon existente | Completado |
| Cargar semilla de catálogo y verificar API con productos | Completado: 4 categorías, 16 productos, 25 variantes, 40 imágenes |
| Configurar `DATABASE_URL`, `NEON_AUTH_BASE_URL` y `NEON_AUTH_JWKS_URL` en Render | Pendiente |
| Definir dominio Netlify, registrarlo en Neon Auth y agregarlo a `ALLOWED_ORIGINS` | Pendiente |
| Configurar variables públicas de build de Netlify | Pendiente |
| Verificar alta, verificación de correo, sesión, pedidos y reseñas con una cuenta real | Pendiente |
| Confirmar precios, stock, política de privacidad, contacto y logística del vendedor | Pendiente |
| Revisar cambios completos y publicar en GitHub | Pendiente |

El esquema y la migración ya están aplicados en Neon `production`; el catálogo se cargó mediante la semilla idempotente. La API local respondió `ok/connected`, devolvió 16 productos y rechazó solicitudes de pedido sin token. No repitas el esquema completo sobre esa base. La API no cobrará, no verificará transferencias y mantendrá el estado de pago pendiente hasta que exista una integración autorizada.

Guía: [`DEPLOY.md`](./DEPLOY.md).
