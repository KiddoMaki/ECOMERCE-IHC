# Auditoría de usabilidad y accesibilidad — PichuPaper

**Fecha de actualización:** 4 de octubre de 2026  
**Alcance revisado:** aplicación estática publicada en GitHub Pages, implementada con HTML, CSS y JavaScript vanilla, sin backend.

## 1. Objetivo y alcance

PichuPaper es un prototipo de baja fidelidad de una tienda ecuatoriana de papelería. Incluye un catálogo de 16 productos en cuatro categorías, búsqueda, filtros, fotos múltiples en cuatro fichas, carrito, confirmación visual de eliminación con opción de deshacer y checkout ficticio de tres pasos.

El prototipo no autentica usuarios, no persiste el carrito, no crea pedidos, no se conecta a un inventario ni procesa pagos. El checkout solo acepta valores de prueba y sus datos no se envían ni se guardan. La auditoría documenta tanto las mejoras existentes como los límites que aún dependen de servicios o pruebas fuera del alcance de esta demo.

## 2. Evaluación de las 10 heurísticas de Nielsen

Las siete heurísticas marcadas **Aplicada** tienen evidencia funcional en el frontend. Las tres marcadas **Parcial** tienen una implementación de demostración, pero no pueden considerarse resueltas de manera exhaustiva sin servicios, persistencia o contenido de soporte completo.

| # | Heurística | Estado | Evidencia observada | Límite / mejora pendiente |
|---|------------|--------|---------------------|---------------------------|
| 1 | Visibilidad del estado del sistema | Aplicada | Contador y subtotal del carrito; toast al añadir; progreso Entrega/Pago/Revisión; estado seleccionado de filtros, ofertas y miniaturas de fotos. | Los cambios del carrito se pierden al recargar porque no hay persistencia. |
| 2 | Relación entre el sistema y el mundo real | Aplicada | Interfaz en español, categorías familiares, precios en USD, teléfono ecuatoriano, provincias y lenguaje cotidiano. | Envíos, precios y pagos se presentan explícitamente como ejemplos. |
| 3 | Control y libertad del usuario | Aplicada | Navegación atrás/cerrar, edición de entrega y pago, cambio de cantidades, cancelación de eliminación, confirmación visual y acción “Deshacer”. | “Deshacer” solo está disponible por cinco segundos y mientras la página permanece abierta. |
| 4 | Consistencia y estándares | Aplicada | Paleta y componentes coherentes entre catálogo, fichas, carrito, formularios y ventanas de diálogo; enlaces y controles mantienen patrones reconocibles. | Una revisión de usabilidad con participantes reales podría descubrir inconsistencias no detectadas en inspección. |
| 5 | Prevención de errores | Aplicada | Validaciones antes de avanzar en checkout; la eliminación requiere confirmación; provincia personalizada tiene límite de 40 caracteres y formato validado. | No hay validación remota de dirección, stock ni datos de una compra real. |
| 6 | Reconocimiento antes que recuerdo | Aplicada | Nombre, precio, categoría, etiquetas y variante quedan visibles; la ficha muestra miniaturas y cuál imagen está seleccionada; el resumen permite revisar el pedido. | No se conserva información del carrito entre sesiones. |
| 7 | Flexibilidad y eficiencia de uso | Parcial | Hay búsqueda en tiempo real, filtros por categoría/ofertas y selección directa de variantes. | No existen favoritos, historial, compras rápidas, preferencias ni atajos personalizados; algunos dependen de perfiles o datos persistentes. |
| 8 | Diseño estético y minimalista | Aplicada | Catálogo con jerarquía visual, tarjetas limpias, vistas adaptables y fotos completas mediante `object-fit: contain`, sin cortar el producto. | Las imágenes originales son PNG pesados; conviene optimizarlas para mejorar carga y consumo móvil. |
| 9 | Ayuda para reconocer, diagnosticar y recuperarse de errores | Parcial | Los campos inválidos reciben mensajes junto al control; los errores generales se anuncian; el usuario puede volver a pasos previos y deshacer una eliminación. | No hay recuperación de sesión, ayuda contextual completa ni soporte para fallos de pago/servidor, pues no existen backend ni pagos reales. |
| 10 | Ayuda y documentación | Parcial | El README explica el prototipo, su ejecución, publicación y cómo añadir productos e imágenes; `assets/products/README.md` documenta nombres de archivo. | No hay centro de ayuda dentro de la tienda, preguntas frecuentes desarrolladas ni soporte en vivo. La guía del proyecto es principalmente técnica. |

**Interpretación del alcance:** “Parcial” no significa que no exista ninguna evidencia. Las heurísticas 7, 9 y 10 tienen mecanismos básicos en el prototipo, pero su aplicación exhaustiva requeriría capacidades no incluidas en la demo estática.

## 3. Accesibilidad: principios POUR de WCAG 2.2

La interfaz incorpora medidas de accesibilidad, pero esta inspección no equivale a una certificación WCAG ni sustituye pruebas con lectores de pantalla, usuarios o herramientas automatizadas especializadas.

| Principio | Evidencia implementada | Evaluación y pendientes |
|-----------|------------------------|-------------------------|
| Perceptible | Contenido textual para acciones; etiquetas accesibles en búsqueda, navegación, controles e imágenes; mensajes anunciados con `aria-live`; iconos decorativos con `aria-hidden`; galerías mantienen la imagen completa en su marco. | Confirmar contraste de todos los estados de interacción y probar ampliación/zoom y tecnologías asistivas. |
| Operable | Controles HTML nativos; estilos de `:focus-visible`; enlace para saltar al contenido; menú con `aria-expanded`; diálogo de confirmación con botones explícitos, cierre con Escape y ciclo de foco; checkout con gestión de foco y teclas. | Realizar un recorrido completo solo con teclado en distintos tamaños de pantalla; comprobar orden de foco en cada ruta y diálogo. |
| Comprensible | Idioma de página español; etiquetas y ayudas de formulario; errores asociados a campos; texto que advierte que el pago es ficticio; pasos secuenciales identificados. | Revisar comprensión del texto con personas usuarias y hacer explícitos los cambios de foco/estado si resultan inesperados. |
| Robusto | HTML semántico (`header`, `nav`, `main`, `section`, `footer`, formularios); roles y relaciones ARIA en diálogos, avisos y controles; botones de miniaturas con `aria-pressed`. | Validar con combinaciones reales de navegador y lector de pantalla; corregir cualquier anuncio redundante o incompatibilidad detectada. |

### Matriz breve de comprobación

| Elemento | Criterio comprobable | Resultado de inspección |
|----------|----------------------|-------------------------|
| Búsqueda y filtros | Se operan con controles de formulario/botones; el conteo refleja resultados. | Implementado |
| Imágenes de producto | Texto alternativo en foto principal; miniaturas tienen nombre accesible y estado presionado. | Implementado en las fichas con fotos |
| Eliminación del carrito | Diálogo HTML, no `window.confirm`; cancelar mantiene el producto; confirmar lo elimina y permite deshacer. | Implementado |
| Provincia “Otra provincia” | Campo aparece condicionalmente, máximo 40 caracteres, capitalización inicial y validación sin distinción de tildes. | Implementado |
| Foco visible | Reglas para botones, enlaces, entradas y miniaturas. | Implementado; requiere prueba manual amplia |
| Contraste y lector de pantalla | Cumplimiento cuantitativo/compatibilidad total. | Pendiente de auditoría especializada |

## 4. Modelo mental y flujo de interacción

### 4.1 Flujo de navegación

La navegación interna utiliza fragmentos para que las vistas funcionen desde el subdirectorio de GitHub Pages, sin rutas de servidor:

```text
Inicio / catálogo
  ├── buscar o filtrar ──────────────────────────────┐
  ├── detalle de producto → elegir variante → añadir │
  └──────────────────────────────────────────────────┘
                         ↓
                    carrito ↔ editar cantidades
                         ├── eliminar → confirmar o conservar
                         │                └→ eliminar → deshacer (5 s)
                         ↓
             entrega → pago de prueba → revisión → confirmación ficticia
```

Las fichas se visitan con rutas como `#/product/cuaderno-a5`; carrito y checkout usan `#/cart` y `#/payment`. No se carga una página de backend.

### 4.2 Secuencia de tarea: compra de demostración

1. Explorar los 16 productos con búsqueda o filtro de categoría.
2. Abrir una ficha; si hay varias fotos, elegir una miniatura.
3. Elegir variante y cantidad, y añadir al carrito.
4. Revisar el subtotal; cambiar cantidad o eliminar un artículo.
5. Si se elimina, confirmar en el diálogo HTML o conservarlo; tras confirmar se puede deshacer durante cinco segundos.
6. Introducir datos ficticios de entrega; seleccionar provincia o escribir una provincia personalizada.
7. Elegir el método de pago de demostración y los valores de prueba indicados.
8. Revisar el resumen y finalizar la simulación.

### 4.3 Respuesta del sistema

- Búsqueda y filtros actualizan tarjetas y conteo de resultados.
- Añadir artículos actualiza el contador/subtotal y muestra un toast.
- El diálogo de eliminación bloquea el fondo, permite cancelar y devuelve el foco al control anterior.
- Confirmar la eliminación actualiza el carrito y muestra “Deshacer”.
- Los pasos del checkout actualizan progreso, foco y validaciones.
- La pantalla final declara que no hubo pago ni pedido real.

## 5. Pruebas realizadas y pendientes

### Realizadas en navegador

- Se comprobaron catálogo, detalle de producto, carrito, cambio de miniaturas y visualización completa de fotografías con `object-fit: contain`.
- Se verificó el flujo de eliminar, cancelar, confirmar y deshacer.
- Se comprobó el formulario de provincia personalizada y la navegación hacia el checkout.
- Se verificó el despliegue de GitHub Pages y las rutas por fragmento.

### Pendientes para una evaluación completa

- Prueba con participantes representativos y registro de tareas/errores.
- Evaluación con teclado y lector de pantalla en más de un navegador.
- Auditoría automática/manual de contraste WCAG 2.2 AA.
- Optimización de las imágenes PNG grandes y comprobación en dispositivos de baja velocidad.
- Validar el informe académico exportado a PDF y contrastarlo con la rúbrica docente.

## 6. Conclusiones

1. El catálogo, detalle, carrito y checkout muestran un flujo de compra comprensible sin requerir backend.
2. Los estados visibles y los mensajes inmediatos ayudan a reducir incertidumbre durante la tarea.
3. La confirmación visual de borrado, cancelar y deshacer ofrece control y reduce errores destructivos.
4. Las galerías permiten revisar varias fotos y muestran imágenes horizontales completas, sin recorte.
5. Las medidas de teclado, foco, semántica y ARIA constituyen una base accesible, no una declaración de conformidad WCAG.
6. Sin persistencia, perfiles o soporte real, la flexibilidad, recuperación avanzada y ayuda integrada permanecen parciales.
7. La demo no representa una tienda transaccional: no recibe pagos, no crea pedidos y no almacena los datos del checkout.

## 7. Publicación y archivos relacionados

- Frontend estático: `index.html`, `style.css`, `script.js`.
- Imágenes: `assets/products/`; rutas registradas en el arreglo `products`.
- Instrucciones de uso y publicación: `README.md`.
- Convención de nombres para imágenes: `assets/products/README.md`.
- Publicación automática: workflow `.github/workflows/pages.yml` en cada push a `main`.
- URL pública: <https://kiddomaki.github.io/ECOMERCE-IHC/>.

El servidor local `server.mjs` es opcional para desarrollo; GitHub Pages sirve el sitio estático y no ejecuta ese servidor.
