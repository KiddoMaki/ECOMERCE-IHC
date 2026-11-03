# Resumen del estado de PichuPaper

## Aplicación actual

Proyecto de comercio electrónico con frontend HTML/CSS/JavaScript, API Node.js y PostgreSQL en Neon. No es una demo con datos simulados en el flujo principal.

- Catálogo, categorías, variantes, imágenes, ofertas y reseñas leídos desde la base.
- Registro e inicio de sesión mediante Neon Auth; API protege operaciones con JWT.
- Carrito persistente por usuario.
- Pedidos con precio recalculado en servidor, direcciones y pago registrados como `pending`.
- La interfaz no solicita datos de tarjeta ni afirma que se haya cobrado o despachado el pedido.
- Construcción de frontend estático para despliegue separada del servicio API.

## Datos actualmente cargados en Neon

Verificación más reciente del seed: 4 categorías, 16 productos, 25 variantes, 40 imágenes y 51 vínculos entre variantes e imágenes. El catálogo seed es idempotente.

## Validación conocida

`npm run build`, `node --check` y `git diff --check` pasaron en la revisión previa. La API respondió `ok/connected`, devolvió 16 productos y rechazó carrito/pedidos sin autenticación. La vista local no tuvo overflow horizontal a 390 px.

El alta/login con una cuenta real verificada y los flujos autenticados de carrito, reseña y pedido aún deben probarse. También están pendientes la configuración de producción en Render/Netlify y validar los dominios de confianza de Neon Auth.

## Límites deliberados

- No hay cobro, pasarela, conciliación de transferencia ni guardado de información de tarjetas.
- El pago queda pendiente y el costo/envío se coordina; todavía no hay inventario ni logística operativa.
- No confundir la aceptación técnica de un pedido pendiente con compra confirmada.

## Documentación

- [`../README.md`](../README.md): instalación y comandos.
- [`../DEPLOY.md`](../DEPLOY.md): despliegue.
- [`../ESTADO_DESPLIEGUE.md`](../ESTADO_DESPLIEGUE.md): configuración pendiente.
- [`../DISENO_BASE_DATOS_PICHUPAPER.md`](../DISENO_BASE_DATOS_PICHUPAPER.md): tablas y relaciones.
- [`../AUDITORIA_PICHUPAPER.md`](../AUDITORIA_PICHUPAPER.md): evaluación de heurísticas y accesibilidad.
