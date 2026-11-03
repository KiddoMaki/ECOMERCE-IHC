# Estado de despliegue — PichuPaper

## Sitio publicado

- **Tienda:** [https://pichupaper-tienda.netlify.app](https://pichupaper-tienda.netlify.app)
- **API:** [https://pichupaper-api.onrender.com](https://pichupaper-api.onrender.com)
- **Rama desplegada:** `main`, commit `a08e5a5`.
- **Base de datos y autenticación:** Neon, rama `production`.
- El sitio de producción es público; las vistas previas de Netlify permanecen privadas.
- Render usa el plan gratuito; al reactivarse después de inactividad, el primer request puede tardar.

## Verificaciones ejecutadas en producción

| Comprobación | Resultado |
|---|---|
| Construcción y publicación en Netlify | Completada |
| API `GET /api/health` | `ok`, base de datos conectada |
| API `GET /api/productos` | 16 productos válidos |
| Catálogo renderizado desde la URL pública | 16 tarjetas |
| URL del API y Neon Auth en el bundle público | Configuradas |
| CORS para `https://pichupaper-tienda.netlify.app` | Permitido |
| Consulta pública de sesión Neon Auth | HTTP 200 |
| Carrito y pedidos sin autenticación | HTTP 401, como corresponde |
| Datos cargados en Neon | 4 categorías, 16 productos, 25 variantes, 40 imágenes y 51 vínculos variante-imagen |

Las variables privadas del API, incluida `DATABASE_URL`, se configuraron como variables de entorno de Render; no se guardan en el repositorio ni en el bundle público.

## Funcionalidad y límites

- Registro, inicio, restauración y cierre de sesión conectados a Neon Auth.
- Catálogo, variantes y reseñas desde Neon; altas y modificaciones de reseña persistentes.
- Carrito persistente por cuenta.
- Pedidos con usuario autenticado, dirección, productos/variantes verificados desde la base, subtotal recalculado y registros de pedido/pago en estado pendiente.
- No se piden datos de tarjeta ni CVV; no se confirma un pago o envío que el sistema no pueda verificar.
- Esquema actualizado, migración aplicada a la rama existente y semilla idempotente.

## Pendiente antes de operación comercial

| Tarea | Estado |
|---|---|
| Probar alta, verificación de correo, inicio/cierre de sesión y flujos autenticados con una cuenta real | Pendiente |
| Confirmar que Neon Auth entrega correo de verificación y revisar sus dominios de confianza | Pendiente de prueba de usuario |
| Confirmar precios, stock, política de privacidad, contacto y logística del vendedor | Pendiente |
| Integrar pago/envío si se requiere confirmar cobros o despachos | No implementado |

El esquema y la migración ya están aplicados en Neon `production`; el catálogo se cargó mediante la semilla idempotente. No repitas el esquema completo sobre esa base. La API no cobrará, no verificará transferencias y mantendrá el estado de pago pendiente hasta que exista una integración autorizada.

Guía: [`DEPLOY.md`](./DEPLOY.md).
