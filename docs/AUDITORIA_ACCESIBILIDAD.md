# Auditoría de accesibilidad — PichuPaper

## Alcance y método

Este documento separa el diagnóstico histórico del informe académico (AIM/TAW, 21 de octubre de 2026) de las verificaciones realizadas sobre el código de esta rama. Las cifras históricas no son resultados de una medición actual. El objetivo técnico es WCAG 2.2 AA; esta revisión no constituye certificación ni sustituye pruebas con personas usuarias y tecnologías asistivas.

La inspección de código cubrió `index.html`, `style.css`, `script.js` y las vistas MVC. Se verificaron contrastes de tokens con la fórmula relativa de WCAG y se hicieron pruebas funcionales en navegador cuando se indica más abajo. AIM, TAW, axe y lectores de pantalla no están disponibles en esta ejecución.

## Hallazgos anteriores y correcciones

| Ubicación | Problema o riesgo | WCAG | Antes | Cambio | Estado / método |
|---|---|---|---|---|---|
| Tokens `--secondary-text` y `--mint-ink` en `style.css` | Texto secundario en el límite de contraste y verde de marca insuficiente como texto sobre blanco. | 1.4.3 | El informe previo registró `#64748B` sobre `#F8FAFC` (4.55:1). El verde `#10B981` sobre blanco es 2.54:1. | Texto secundario `#475569` y verde de texto `#047857`; el verde de fondo conserva texto marino. | Medición de tokens realizada; verificar combinaciones visuales completas antes de afirmar conformidad. |
| Tipografía de tienda y formularios en `style.css` | Algunos textos de tarjetas, botones, pie de página y formularios eran de 8–14 px; algunos controles no heredaban la tipografía de la página. | 1.4.4, 1.4.10 | La captura de revisión confirmó texto pequeño en metadatos, acciones y pie de página. | Texto de lectura y controles subidos a 16–17 px en escritorio y 15–16 px en móvil; textos auxiliares a 14 px; `select` y `textarea` heredan la fuente. | Verificado en navegador a 800, 390 y 320 px; sin overflow horizontal; zoom 200% pendiente. |
| Checkout en `index.html` | Los errores se mostraban junto al campo, pero no todos tenían relación programática con el control. | 3.3.1, 3.3.2, 4.1.3 | `small.field-error` carecía de `id` y `aria-describedby`. | Cada campo tiene un mensaje identificable y `aria-describedby`; la validación marca `aria-invalid`. | Verificación de asociaciones HTML; probar cada error en lector de pantalla pendiente. |
| Foco en `style.css` | La regla general no incluía selectores ni áreas de texto. | 2.4.7 | Foco general declarado para botones, enlaces e inputs. | Se añadieron `select:focus-visible` y `textarea:focus-visible`; siguen las reglas específicas existentes. | Inspección de CSS; recorrido de teclado aún requerido. |
| Consumo del catálogo en `src/client/api-client.js` y renderizado de `script.js` | Datos remotos podían estar incompletos o contener texto/URLs insertados en plantillas HTML. | 4.1.1, robustez | Validación superficial del objeto recibido. | Validación de campos, categorías, clases, variantes, índices y rutas de imagen; escape contextual de contenido insertado. | Inspección de código; probar con respuesta API real pendiente de despliegue. |
| Imágenes de catálogo y galerías en `script.js` | Debía mantenerse la alternativa adecuada según el contexto y evitar descripciones duplicadas. | 1.1.1 | Imágenes de tarjetas y miniaturas son decorativas dentro de controles/enlaces con nombre; la foto principal tiene alt contextual. | Se conserva `alt=""` para imágenes duplicadas/decorativas y alt informativo en la foto principal; se actualiza al cambiar foto/variante. | Inspección del flujo de galería; lector de pantalla pendiente. |

### Contraste de tokens medido

| Texto / primer plano | Fondo | Ratio | Criterio mínimo de texto normal | Resultado |
|---|---|---:|---:|---|
| `#1E293B` | `#F8FAFC` | 13.98:1 | 4.5:1 | Pasa |
| `#475569` | `#F8FAFC` | 7.24:1 | 4.5:1 | Pasa |
| `#047857` | `#FFFFFF` | 5.48:1 | 4.5:1 | Pasa |
| `#047857` | `#F8FAFC` | 5.24:1 | 4.5:1 | Pasa |
| `#1E293B` | `#10B981` | 5.77:1 | 4.5:1 | Pasa |
| `#FFFFFF` | `#10B981` | 2.54:1 | 4.5:1 | No usar para texto normal |

Son mediciones de pares de tokens, no una auditoría de cada estado, transparencia, fotografía, sombra o componente. El verde claro `#10B981` se mantiene como superficie con texto marino, no como color de texto sobre blanco.

## Diagnóstico histórico del PDF

Las siguientes cifras proceden del resumen proporcionado del informe académico del 21/10/2026; no son mediciones de esta rama. El PDF original no se pudo abrir desde la carpeta protegida durante esta ejecución.

| Herramienta / alcance histórico | Resultado referido | Interpretación |
|---|---|---|
| AIM | 5.3/10, 1 error general, 21 referencias de contraste y 92 alertas. | Línea base anterior; no equivale a puntuación actual. |
| AIM — recuentos estructurales | 32 características, 37 elementos de estructura y 168 referencias ARIA. | Recuentos de elementos, no fallos automáticos. |
| TAW — WCAG 2.0 AA | 25 referencias a controles sin etiqueta, 18 imágenes con alt vacío, 73 incidencias sobre presentación y 41 sobre contenido/jerarquía de encabezados. | Las referencias pueden repetirse en distintos criterios; no sumarlas como incidencias únicas. Requieren verificación contextual. |

Un `alt=""`, un `h1` o un atributo ARIA no son fallos por sí mismos: dependen de su función y contexto.

## Pendientes de auditoría

- Medir colores de cada componente y estado hover, focus, active y disabled, incluyendo transparencias y fondos reales.
- Verificar zoom 200% sin pérdida de contenido o función (reflow de 320 CSS px ya comprobado manualmente).
- Completar un recorrido de teclado en catálogo, detalle, carrito, diálogo de eliminación, checkout y reseñas.
- Comprobar nombres, errores, anuncios y orden de foco con al menos un lector de pantalla.
- Ejecutar una herramienta automática (axe/Lighthouse) y AIM/TAW si están disponibles; guardar versión, fecha y resultados.
- Validar con usuarios y no presentar la revisión como certificación WCAG.

Los pasos y el estado de ejecución se mantienen en [`PRUEBAS_ACCESIBILIDAD.md`](./PRUEBAS_ACCESIBILIDAD.md).
