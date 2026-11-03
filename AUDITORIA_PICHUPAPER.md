# Auditoría de usabilidad y accesibilidad — PichuPaper

**Alcance:** frontend estático y flujos conectados a Neon Auth/API. Se revisó navegación, cuenta, catálogo, carrito y estados de pedido; no se declara conformidad WCAG ni se sustituye una prueba con usuarios.

## Alcance funcional verificado

La tienda sirve 16 productos desde Neon; el catálogo incluye categorías, búsqueda, filtro combinado de ofertas, ficha, variantes y reseñas. Neon Auth proporciona registro, sesión persistente y cierre de sesión. El carrito se guarda por cuenta. El API calcula precios y persiste pedidos, direcciones y pagos como pendientes.

El pedido no se presenta como compra pagada o enviada: el envío está por coordinar, el formulario comprueba solo el formato de los datos de pago en el navegador y no se marcan pagos como aprobados. Los valores de tarjeta/cuenta se borran antes de revisar el pedido y no se envían ni guardan; no se verifican tarjetas ni cuentas reales. No se verificaron los procesos operativos del vendedor, logística, disponibilidad física ni cobros reales.

## Heurísticas de Nielsen

| # | Heurística | Evaluación | Evidencia actual | Pendiente |
|---:|---|---|---|---|
| 1 | Visibilidad del estado del sistema | Aplicada | Carga/error del catálogo, filtros `aria-pressed`, contador del carrito, progreso del checkout y confirmación de pedido pendiente. | Mostrar disponibilidad real cuando se configure inventario. |
| 2 | Relación entre sistema y mundo real | Aplicada | Etiquetas y formularios en español, moneda USD y formatos de contacto de Ecuador; pedido describe con claridad coordinación de entrega/pago. | Confirmar condiciones reales de venta con el operador. |
| 3 | Control y libertad | Aplicada | Navegación entre vistas, edición de pasos, variación de cantidades, confirmación y deshacer eliminación. | Añadir cancelación de pedido solo cuando exista una política de negocio. |
| 4 | Consistencia y estándares | Aplicada | Componentes y patrones consistentes; navegación con rutas internas; controles HTML nativos. | Prueba moderada con usuarios. |
| 5 | Prevención de errores | Aplicada | Validación de longitud y formato en entrega y pago, límites en cantidades, verificación JWT y precio recalculado en servidor. Los campos de pago se validan solo en el navegador y se borran antes de enviar el pedido. | Añadir reglas de inventario y una pasarela certificada si se habilitan cobros reales. |
| 6 | Reconocimiento antes que recuerdo | Aplicada | Variantes visibles, galería con estado seleccionado, carrito por cuenta y resumen del pedido. | Historial de pedidos en la cuenta. |
| 7 | Flexibilidad y eficiencia | Parcial | Búsqueda en vivo, ofertas combinables con categorías, variantes y carrito persistente. | Atajos, favoritos y preferencias de compra. |
| 8 | Diseño estético y minimalista | Aplicada | Jerarquía de catálogo y detalle, imágenes contenidas y mejoras de tipografía responsiva. | Optimizar peso de imágenes y validar en más dispositivos. |
| 9 | Reconocer, diagnosticar y recuperarse de errores | Parcial | Errores de campos/API, reintento de catálogo, fallos de sesión visibles y posibilidad de regresar entre pasos. | Recuperación y seguimiento de pedidos ante incidentes operativos. |
| 10 | Ayuda y documentación | Parcial | README, documentación del esquema, despliegue, auditoría y pruebas. | Centro de ayuda contextual y soporte del comercio. |

Las heurísticas 7, 9 y 10 quedan parciales; no se les atribuyen funcionalidades inexistentes.

## Accesibilidad: comprobaciones actuales

- Estructura semántica, idioma español, enlace para saltar al contenido, etiquetas accesibles, nombres para iconos, mensajes con `role`/`aria-live`, foco visible y botones nativos.
- Formularios de cuenta con `autocomplete`, restricciones de longitud y mensajes de error.
- Diálogo de checkout con pasos, foco, errores asociados y avisos claros de pago pendiente.
- En navegador local: catálogo con 16 tarjetas, cuenta y creación de cuenta visibles, cero desbordamiento horizontal en viewport de 390 px, campos de pago con validación solo de formato y redirección al login antes de añadir productos sin sesión.
- En API local: health check conectado a Neon, 16 productos, solicitudes de carrito/pedido sin autenticación rechazadas con HTTP 401 y preflight CORS para `PUT`.

## Pendiente antes de operación pública

Probar alta/verificación/inicio/cierre de sesión con una cuenta de prueba controlada; verificar persistencia del carrito, pedido y reseñas con JWT válido; ejecutar teclado/lector de pantalla y axe/Lighthouse; confirmar precio, stock, política de privacidad, contacto y logística; configurar dominios de confianza Neon Auth, Render y Netlify. No introducir datos financieros reales ni hacer transferencias durante las pruebas.

Documentos relacionados: [`docs/REVISION_10_HEURISTICAS.md`](./docs/REVISION_10_HEURISTICAS.md), [`docs/AUDITORIA_ACCESIBILIDAD.md`](./docs/AUDITORIA_ACCESIBILIDAD.md), [`docs/PRUEBAS_ACCESIBILIDAD.md`](./docs/PRUEBAS_ACCESIBILIDAD.md), [`DISENO_BASE_DATOS_PICHUPAPER.md`](./DISENO_BASE_DATOS_PICHUPAPER.md).
