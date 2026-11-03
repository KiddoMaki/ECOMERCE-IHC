# PichuPaper: negocio, aplicación y problema actual

**Actualizado:** 3 de noviembre de 2026

**Sitio público:** [pichupaper-tienda.netlify.app](https://pichupaper-tienda.netlify.app)

**API:** [pichupaper-api.onrender.com](https://pichupaper-api.onrender.com)

**PR de correcciones:** [KiddoMaki/ECOMERCE-IHC#4](https://github.com/KiddoMaki/ECOMERCE-IHC/pull/4)

## 1. Resumen del negocio

PichuPaper es una tienda web de artículos de papelería y escritorio, orientada a personas que estudian, trabajan o hacen actividades creativas. La propuesta de la tienda es ayudar a encontrar productos cotidianos para organizar tareas, tomar apuntes y crear.

El catálogo contempla cuatro categorías —cuadernos, bolígrafos, escritorio y arte— y actualmente contiene 16 productos, variantes, imágenes, precios y reseñas. La experiencia permite descubrir productos, consultar sus detalles y reunir una selección en un carrito.

El sitio está ambientado para atender pedidos con destino en Ecuador. El costo, la cobertura y la fecha de entrega se deben coordinar antes de confirmar el despacho. La aplicación registra pedidos como pendientes, pero no confirma que el comercio tenga stock físico, que haya recibido el pago o que el producto se haya enviado.

### Público y necesidad

- **Personas usuarias:** estudiantes, personal de oficina y personas que buscan útiles de papelería o materiales creativos.
- **Necesidad que atiende la interfaz:** encontrar y comparar artículos, revisar sus variantes y organizar una selección antes de solicitar un pedido.
- **Propuesta de valor de la experiencia:** catálogo accesible y adaptable, búsqueda, filtros, fichas de producto, carrito y un proceso guiado de revisión.

Este es el planteamiento del proyecto digital; no se han verificado como hechos comerciales la operación de un vendedor, el inventario real, los precios vigentes, la política de cambios, la logística ni la recepción de pagos.

## 2. Modelo de operación que sí existe en el sistema

1. La persona explora el catálogo y puede buscar, filtrar por categoría/oferta y consultar las fichas y variantes.
2. Para guardar el carrito y registrar un pedido debe iniciar sesión. La autenticación y las cuentas se gestionan con Neon Auth.
3. La persona revisa productos y datos de entrega en el checkout.
4. El servidor obtiene los precios de la base de datos, vincula el pedido con la cuenta y lo registra junto con su estado de pago pendiente.
5. El equipo/comercio tendría que coordinar el pago y la entrega fuera del flujo automatizado para que el pedido avance.

### Pagos: límite importante

No hay pasarela de pago ni integración para cobrar tarjetas o verificar transferencias. El formulario del checkout solo comprueba formatos para la interfaz. Los datos ingresados se borran antes de revisar el pedido y no se envían ni guardan. No se deben ingresar datos financieros reales. La aplicación no debe presentarse como prueba de que un pago fue realizado.

## 3. Qué está construido

| Área | Estado funcional |
|---|---|
| Inicio y catálogo | Interfaz responsiva; catálogo servido por la API; búsqueda, categorías, filtro de ofertas y fichas de producto. |
| Productos | Variantes, imágenes y reseñas visibles en cada ficha. |
| Cuenta | Registro, inicio y cierre de sesión a través de Neon Auth. |
| Carrito | Interfaz de cantidades y eliminación; persistencia remota asociada a la cuenta cuando el API acepta la sesión. |
| Checkout | Datos de entrega, selección de método, resumen y confirmación de pedido pendiente. No cobra ni envía datos financieros. |
| Ayuda | Contacto y página independiente de preguntas frecuentes. |
| Accesibilidad y adaptación | Navegación interna, controles semánticos, estados accesibles y estilos para pantallas pequeñas. |
| Datos | Neon PostgreSQL para catálogo, perfiles, carrito, reseñas y registros de pedido/pago. |

La aplicación es de baja fidelidad académica en su alcance visual y de interacción; que el frontend esté conectado a servicios de backend no significa que exista una operación comercial completa.

## 4. Arquitectura y despliegue

- **Frontend:** HTML, CSS y JavaScript; despliegue de producción en Netlify.
- **API:** Express en Render.
- **Autenticación:** Neon Auth.
- **Base de datos:** Neon PostgreSQL.
- **Repositorio:** [KiddoMaki/ECOMERCE-IHC](https://github.com/KiddoMaki/ECOMERCE-IHC).
- **Producción:** se publica desde `main`. El trabajo de corrección actual está en `feat/accessibility-api-neon-netlify`, PR #4; mientras el PR no se integre, su código no se debe asumir publicado en producción.

## 5. Problema actual de sesión

### Síntoma observado en producción

Al cargar la tienda, la cuenta puede seguir apareciendo como iniciada, pero operaciones que requieren autenticación —por ejemplo restaurar o guardar el carrito y publicar una reseña— reciben HTTP `401` del API. La interfaz llegó a mostrar un mensaje de sesión inválida y el carrito de la cuenta no se restauró.

### Evidencia comprobada el 3 de noviembre de 2026

- El endpoint de sesión de Neon Auth respondió HTTP `200` y devolvió una sesión.
- El token que el navegador tenía guardado podía estar vencido, aunque la sesión general de Neon continuara vigente.
- Al consultar directamente la sesión de Neon se obtuvo un JWT nuevo, con expiración futura, emisor en el dominio raíz de Neon Auth y un identificador de clave presente en el JWKS publicado por Neon.
- Aun con ese JWT nuevo, una llamada autenticada al API público respondió HTTP `401` con el mensaje genérico de token inválido o expirado.
- La cuenta de prueba aparece autenticada en la interfaz, pero el claim de Neon `emailVerified` observado estaba en `false`. Las operaciones protegidas requieren correo verificado; esto debe corregirse/verificarse para poder usar reseñas y otras acciones autenticadas.
- El PR #4 está abierto y tiene vista previa de Netlify reportada como exitosa. El API y el sitio de producción todavía no deben considerarse actualizados con las correcciones de esa rama.

### Diagnóstico: qué sabemos y qué falta

Hay dos problemas relacionados, pero distintos:

1. **Token obsoleto en el cliente:** el SDK puede devolver una sesión cacheada cuyo JWT ya venció. La sesión de Neon sigue viva, por lo que mostrar directamente “sesión borrada” es confuso.
2. **Rechazo del API incluso con un JWT recién emitido:** el `401` genérico no permite distinguir si Render está usando un `NEON_AUTH_BASE_URL`/`NEON_AUTH_JWKS_URL` que no corresponde, si el API desplegado aún valida el emisor de forma incorrecta o si hay otra discrepancia del verificador. El error requiere una comprobación posterior al despliegue; no se debe afirmar que ya está solucionado solo porque el token se renueve.

El claim `emailVerified: false` es además un bloqueo independiente para las operaciones que exigen correo verificado. Normalmente se debería comunicar como una cuenta pendiente de verificación, no como una sesión inexistente.

### Cambios preparados en PR #4

- Renovar el JWT consultando la sesión vigente de Neon antes de usarlo, compartiendo una única solicitud de renovación entre peticiones concurrentes.
- No borrar el estado visual de la cuenta cuando el API devuelve `401`.
- Validar el `issuer` usando el origen de la URL pública de Neon Auth.
- Reconocer el claim de verificación `emailVerified` usado por Neon Auth.
- Mejorar el tamaño, contraste y duración de las alertas en escritorio y móvil.
- Añadir y enlazar la página de preguntas frecuentes.

Estos cambios están en la rama del PR y **todavía necesitan integración y verificación contra el API de producción**.

## 6. Próximos pasos para cerrar el incidente

1. Revisar e integrar el PR #4 en `main`; confirmar la vista previa y el despliegue de Netlify.
2. Confirmar en Render que `NEON_AUTH_BASE_URL` apunta al proyecto correcto de Neon Auth y que `NEON_AUTH_JWKS_URL` apunta al JWKS de ese mismo proyecto. No publicar los valores privados.
3. Esperar el despliegue del API en Render con el middleware actualizado.
4. Verificar el correo de la cuenta desde el enlace de Neon Auth y volver a iniciar sesión para obtener una sesión limpia.
5. Probar restauración del carrito y, después, una reseña de prueba controlada. Para probar autenticación sin escribir datos, una petición de reseña con un cuerpo vacío debe avanzar a la validación del cuerpo (`400`); si sigue respondiendo `401`, el API todavía no valida el token.
6. Confirmar en producción que la cuenta conserva la sesión, el carrito se restaura y las alertas explican el error sin indicar falsamente que la sesión fue borrada.

## 7. Documentación relacionada

- [README del proyecto](../README.md)
- [Guía de despliegue](../DEPLOY.md)
- [Estado de despliegue](../ESTADO_DESPLIEGUE.md)
- [Auditoría de usabilidad y accesibilidad](../AUDITORIA_PICHUPAPER.md)
- [Diseño de base de datos](../DISENO_BASE_DATOS_PICHUPAPER.md)
