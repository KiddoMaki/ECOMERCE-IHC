# Revisión de las 10 heurísticas de Nielsen

## Contexto

Evaluación de la versión conectada a Neon Auth y a la API de PichuPaper. La aplicación ofrece catálogo, cuenta, reseñas, carrito persistente y registro de pedidos pendientes. La evaluación es una inspección heurística, no una prueba con usuarios ni una certificación.

| # | Heurística | Estado | Implementación / observación |
|---:|---|---|---|
| 1 | Visibilidad del estado del sistema | Aplicada | Estados de carga y error, filtros activos, contador del carrito, paso actual y confirmación de pedido pendiente. |
| 2 | Relación entre sistema y mundo real | Aplicada | Lenguaje y moneda apropiados para el público; la interfaz explica que pago y envío se coordinan y no están confirmados. |
| 3 | Control y libertad | Aplicada | Navegación entre vistas y pasos, actualización de cantidades y deshacer eliminación del carrito. |
| 4 | Consistencia y estándares | Aplicada | Patrones compartidos de navegación, botones, campos, etiquetas y comportamiento de filtros. |
| 5 | Prevención de errores | Aplicada | Validación de campos y cantidades; API autentica y recalcula importes; el frontend no solicita tarjetas/CVV. |
| 6 | Reconocimiento antes que recuerdo | Aplicada | Galería y variantes visibles, resumen del carrito y datos guardados por cuenta. |
| 7 | Flexibilidad y eficiencia de uso | Parcial | Búsqueda en vivo, filtros combinables, selección de variantes y carrito persistente; no hay atajos ni favoritos. |
| 8 | Diseño estético y minimalista | Aplicada | Jerarquía clara, contenido de producto priorizado y diseño adaptable; falta optimizar todas las imágenes y validar más dispositivos. |
| 9 | Ayudar a reconocer, diagnosticar y recuperarse de errores | Parcial | Mensajes en formularios/API y reintento de catálogo; soporte y recuperación operativa de pedidos aún no están disponibles. |
| 10 | Ayuda y documentación | Parcial | README y guías de auditoría, base de datos, accesibilidad y despliegue; falta ayuda contextual y soporte del comercio. |

### Las tres heurísticas no completamente cubiertas

No se consideran imposibles: están parcialmente cubiertas y pueden completarse. Las limitaciones dependen de decisiones o servicios de negocio que aún no están disponibles:

1. **Flexibilidad/eficiencia:** no hay favoritos ni atajos de usuario.
2. **Recuperación ante errores:** aún no existe flujo operativo para investigar o recuperar pedidos.
3. **Ayuda/documentación:** no hay centro de ayuda contextual ni canal de soporte integrado.

### Riesgos y límites

- Los pedidos quedan `pending`; no existe pasarela, conciliación de transferencias, inventario ni cálculo de envío.
- No afirmar que una orden fue pagada o enviada hasta integrar y verificar esos procesos.
- No se ha realizado una prueba moderada ni una revisión de conformidad WCAG completa.
- Alta e inicio de sesión reales, sesión autenticada y operaciones de cuenta deben verificarse con una cuenta Neon Auth de prueba antes del lanzamiento.

La auditoría principal y los casos de accesibilidad están en [`../AUDITORIA_PICHUPAPER.md`](../AUDITORIA_PICHUPAPER.md) y [`PRUEBAS_ACCESIBILIDAD.md`](./PRUEBAS_ACCESIBILIDAD.md).
