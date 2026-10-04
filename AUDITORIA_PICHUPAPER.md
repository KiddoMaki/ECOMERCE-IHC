# Auditoría de usabilidad y accesibilidad — PichuPaper

## 1. Objetivo del prototipo
PichuPaper es un prototipo de baja fidelidad de un e-commerce de papelería y artículos de escritorio para Ecuador. La interfaz busca demostrar una compra guiada, clara y comprensible, con enfoque en usabilidad, accesibilidad y flujo lógico de interacción.

## 2. Heurísticas de Nielsen
Se documentan 10 heurísticas, de las cuales 7 pueden implementarse de forma funcional dentro de una demo estática y 3 quedan fuera del alcance por depender de backend, personalización avanzada o documentación real del sistema.

| # | Heurística | Estado | Evidencia en el prototipo | Observación |
|---|------------|--------|---------------------------|------------|
| 1 | Visibilidad del estado del sistema | Aplicada | El carrito actualiza su contador, los pasos del checkout muestran progreso y se emiten mensajes tipo toast. | Se comunica con feedback inmediato al usuario. |
| 2 | Relación entre el sistema y el mundo real | Aplicada | El idioma, términos de compra, categorías y mensajes usan lenguaje cotidiano del usuario. | Coincide con el contexto de compra local. |
| 3 | Control y libertad del usuario | Aplicada | El usuario puede modificar cantidades, eliminar productos, volver atrás y cancelar el flujo de compra. | El usuario no queda atrapado en una acción sin salida. |
| 4 | Consistencia y estándares | Aplicada | Se repite la misma estructura visual para tarjetas, navegación, carrito y botónes. | Reduce la carga cognitiva. |
| 5 | Prevención de errores | Aplicada | Los formularios de entrega y pago validan formatos antes de continuar. | El sistema detecta errores antes de avanzar. |
| 6 | Reconocimiento antes que recuerdo | Aplicada | Los productos tienen etiquetas, categorías, iconos y textos claros, con la información visible en cada paso. | El usuario no necesita recordar datos previos. |
| 7 | Flexibilidad y eficiencia de uso | No aplicable en esta demo | No hay perfiles, guardado persistente, historial ni personalización avanzada. | Requiere backend y sistema de usuario real. |
| 8 | Diseño estético y minimalista | Aplicada | La interfaz prioriza información relevante, sin saturar la vista. | Mantiene la atención en la compra. |
| 9 | Ayuda al usuario para reconocer, diagnosticar y recuperarse de errores | No aplicable en esta demo | La validación se presenta localmente, pero no hay un sistema de soporte real ni recuperación avanzada. | Requiere flujo de soporte y backend. |
| 10 | Ayuda y documentación | No aplicable en esta demo | No existe un centro de ayuda completo ni documentación real para usuarios finales. | Es una demo prototipada, no un producto final. |

## 3. Principios de accesibilidad WCAG 2.2
Se evidencia el cumplimiento funcional de los cuatro principios principales.

| Principio | Cómo se cumple en PichuPaper | Evidencia técnica |
|-----------|-----------------------------|------------------|
| Perceptibilidad | Los iconos se usan como decoración, y la información importante está en texto visible; los contrastes mantienen una lectura clara. | `aria-hidden="true"` en iconos decorativos, textos visibles y contrastes definidos en CSS. |
| Operabilidad | El sitio es navegable con teclado; existen foco visible, modales con cierre por Escape y rutas con navegación clara. | `:focus-visible`, `tabindex`, `aria-expanded`, `aria-modal`, `aria-live`. |
| Comprensibilidad | Los mensajes, etiquetas y pasos son sencillos, con instrucciones claras y lenguaje cotidiano. | Formularios con textos de ayuda y mensajes de error. |
| Robustez | La estructura semántica y los atributos ARIA permiten una mejor interpretación por tecnologías asistivas. | Etiquetas, `role="dialog"`, `role="alert"`, `role="status"`, `aria-label` y `aria-controls`. |

## 4. Modelo mental y flujo de interacción
### 4.1 Flujo de navegación
El usuario recorre la aplicación como sigue:

1. Entra a la página principal.
2. Explora el catálogo y usa filtros o buscador.
3. Visualiza detalle del producto.
4. Añade al carrito.
5. Revisa el carrito y modifica cantidades.
6. Continúa al checkout.
7. Completa entrega y pago ficticio.
8. Revisa los datos y finaliza la simulación.

### 4.2 Secuencia de tareas
- Buscar producto
- Seleccionar variante
- Añadir al carrito
- Revisar resumen
- Confirmar compra de prueba

### 4.3 Respuesta del sistema
- Cuadro de productos actualiza el conteo.
- Toast indica que se añadió un producto.
- Carrito actualiza total y cantidades.
- Formularios muestran errores si faltan datos.
- Modal de checkout cambia de paso y confirma la simulación.

## 5. Conclusiones sobre el diseño de la interacción
- La interfaz mantiene un flujo de compra lógico y mínimo.
- La navegación resulta coherente para usuarios novatos.
- Los mensajes de retroalimentación reducen la incertidumbre.
- La estructura visual favorece la comprensión del proceso.
- La combinación entre color, texto e iconografía refuerza la identidad de la marca.
- La accesibilidad básica está presente, aunque limitada por ser una demo frontal estática.

## 6. Recomendaciones para subirlo a GitHub
- Mantener el proyecto como frontend estático sin dependencias.
- Usar `README.md` con instrucciones claras de ejecución.
- Añadir `.gitignore` para evitar archivos generados del entorno.
- Publicar como GitHub Pages o desplegar en un servidor simple con Node.

## 7. Estado final
El prototipo cumple con la finalidad del reto: ofrecer una experiencia de compra de baja fidelidad, funcional, amigable y documentada, con enfoque en usabilidad y accesibilidad básica, respetando el alcance de una demo sin backend.
