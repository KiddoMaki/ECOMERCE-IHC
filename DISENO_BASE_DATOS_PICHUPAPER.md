# Diseño de base de datos — PichuPaper

## Estado

El esquema canónico está en [`sql/pichupaper_schema.sql`](./sql/pichupaper_schema.sql), aplicado a Neon `production`. La migración [`sql/migrations/001_neon_auth_profiles.sql`](./sql/migrations/001_neon_auth_profiles.sql) vincula los perfiles con Neon Auth. El catálogo inicial ya está cargado mediante [`sql/catalog_seed.sql`](./sql/catalog_seed.sql).

La base cuenta con 13 tablas y la vista `product_offers`. Las contraseñas las gestiona Neon Auth; `public.users` solo conserva el perfil y `auth_user_id`. No se guarda número de tarjeta, CVV ni credenciales de conexión.

## Tablas y relaciones

| Tabla | Propósito | PK y FKs principales |
|---|---|---|
| `users` | Perfil local relacionado con identidad verificada de Neon Auth. | PK `user_id`; `auth_user_id` único, referido al `sub` JWT (no hay FK entre esquemas). |
| `categories` | Categorías visibles del catálogo. | PK `category_id`; `slug` único. |
| `products` | Datos y precios del catálogo. | PK `product_id`; FK `category_id → categories`. |
| `product_variants` | SKU, nombre y precio opcional por variante. | PK `variant_id`; FK `product_id → products`; `sku` único. |
| `product_images` | Fotos y texto alternativo del producto. | PK `image_id`; FK `product_id → products`; URL única por producto. |
| `variant_images` | Asociación ordenada de imágenes con variantes. | PK compuesta `(variant_id, image_id)`; FKs compuestas garantizan que ambas pertenezcan al mismo `product_id`. |
| `reviews` | Calificación y opinión por cuenta/producto. | PK `review_id`; FKs `product_id → products`, `user_id → users`; único `(user_id, product_id)`. |
| `user_addresses` | Direcciones de entrega de cada cuenta. | PK `address_id`; FK `user_id → users`; único compuesto `(address_id, user_id)`. |
| `carts` | Carritos por cuenta y ciclo de vida. | PK `cart_id`; FK `user_id → users`; índice parcial limita a un carrito activo por usuario. |
| `cart_items` | Variantes y cantidades del carrito. | PK compuesta `(cart_id, variant_id)`; FKs a `carts` y `product_variants`. |
| `orders` | Pedido y copia inmutable de los datos de entrega. | PK `order_id`; FK `user_id → users`; FK compuesta `(address_id, user_id) → user_addresses`. |
| `order_items` | Líneas del pedido con nombre, variante, precio y cantidad capturados al comprar. | PK `order_item_id`; FKs `order_id → orders`, `variant_id → product_variants`. |
| `payments` | Método y estado de cada intento de pago. | PK `payment_id`; FK `order_id → orders`; no contiene datos de tarjeta. |

`product_offers` es una vista de productos activos cuyo precio anterior supera el actual.

## Flujo y consistencia

1. Neon Auth autentica al usuario y el API verifica el JWT con `NEON_AUTH_JWKS_URL`. El API requiere correo verificado y asocia el `sub` con `users.auth_user_id`.
2. El carrito persistente guarda solo la variante/SKU y cantidad. Al leer o guardar, el API valida que el producto y la variante estén activos.
3. Al registrar un pedido, el API vuelve a consultar los precios en la base; nunca confía en el subtotal enviado por el navegador. Guarda dirección, líneas y pago dentro de una transacción.
4. El pedido y el pago empiezan en estado `pending`. El envío se deja sin cotizar y se coordina después. No existe pasarela ni confirmación de transferencia.
5. Las reseñas se asocian al usuario autenticado y al producto. Se permite una reseña por usuario/producto; una nueva publicación actualiza la existente.

## Ejecutar en Neon

- En una base nueva: aplicar `sql/pichupaper_schema.sql` y luego `sql/catalog_seed.sql`.
- En la rama `production` ya preparada: no repetir el esquema; aplicar `sql/migrations/001_neon_auth_profiles.sql` y ejecutar `sql/catalog_seed.sql` (idempotente).
- `database/schema.sql` es un esquema anterior. La semilla canónica para el proyecto es `sql/catalog_seed.sql`.
