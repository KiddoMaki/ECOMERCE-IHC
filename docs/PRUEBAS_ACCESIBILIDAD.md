# Pruebas de accesibilidad y validación funcional

Este registro separa comprobaciones ejecutadas de las que siguen pendientes. Una revisión manual no equivale a certificar WCAG.

## Ejecutado localmente

| Comprobación | Resultado |
|---|---|
| Ancho del documento a viewport de 390 px | 375 px; no se observó desbordamiento horizontal. |
| Catálogo desde API/Neon | API conectada; 16 productos visibles. |
| Navegación de cuenta | Login y registro disponibles; el acceso requiere correo verificado. |
| Alta al carrito sin sesión | Redirige a la página de login. |
| Solicitud de carrito y pedidos sin JWT | API responde HTTP 401. |
| CORS | Preflight `PUT` permitido para el origen local probado. |
| Pago | No hay campos de tarjeta/CVV; pedido y pago quedan pendientes. |
| Build y sintaxis | `npm run build`, `node --check` y `git diff --check` pasaron en la revisión anterior a esta actualización documental. |

## Revisión manual que debe conservarse

- Navegar toda la interfaz usando solo teclado y verificar orden lógico, foco visible y ausencia de trampas.
- Revisar estructura de encabezados, enlace para saltar al contenido, nombres accesibles de controles y enlaces.
- Comprobar lectura de mensajes de carga, error y éxito con lector de pantalla.
- Verificar contraste, ampliación de texto al 200 %, orientación y ventanas estrechas.
- Comprobar que los campos obligatorios y errores estén asociados programáticamente y sean entendibles.

## Pendiente antes de publicar

- Probar alta, verificación de correo, inicio y cierre de sesión con una cuenta Neon Auth de prueba.
- Con JWT válido, comprobar carrito persistente, envío de reseña y creación/consulta del pedido.
- Ejecutar axe/Lighthouse y pruebas manuales con NVDA u otro lector de pantalla; registrar navegador, versión y resultados.
- Probar dispositivos y navegadores adicionales y verificar configuración de dominios de confianza.
- Confirmar políticas reales de envío, pago, privacidad y disponibilidad.

No usar tarjetas reales ni realizar transferencias durante estas pruebas. El sistema aún no procesa ni confirma pagos.
