-- =====================================================================
-- PichuPaper - Esquema relacional para PostgreSQL
-- Basado en DISENO_BASE_DATOS_PICHUPAPER.md
-- Uso: psql -d pichupaper -f pichupaper_schema.sql
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Función de apoyo: mantiene updated_at al modificar un registro
-- ---------------------------------------------------------------------
CREATE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------
-- Cuentas
-- ---------------------------------------------------------------------
CREATE TABLE users (
    user_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name           VARCHAR(120) NOT NULL,
    email          VARCHAR(254) NOT NULL,
    auth_user_id   TEXT NOT NULL UNIQUE,
    status         VARCHAR(20)  NOT NULL DEFAULT 'active',
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT chk_users_status CHECK (status IN ('active', 'disabled'))
);

-- El correo es único sin distinguir mayúsculas de minúsculas
CREATE UNIQUE INDEX uq_users_email ON users (lower(email));

-- ---------------------------------------------------------------------
-- Catálogo
-- ---------------------------------------------------------------------
CREATE TABLE categories (
    category_id  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR(80)  NOT NULL UNIQUE,
    slug         VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE products (
    product_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id     BIGINT        NOT NULL REFERENCES categories (category_id) ON DELETE RESTRICT,
    name            VARCHAR(160)  NOT NULL,
    slug            VARCHAR(180)  NOT NULL UNIQUE,
    description     TEXT,
    price           DECIMAL(10,2) NOT NULL,
    original_price  DECIMAL(10,2),  -- Precio anterior cuando hay una oferta
    active          BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT chk_products_price CHECK (price >= 0),
    CONSTRAINT chk_products_original_price CHECK (original_price IS NULL OR original_price > price)  -- Una oferta siempre rebaja el precio
);

CREATE INDEX idx_products_category ON products (category_id);

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE product_variants (
    variant_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id      BIGINT        NOT NULL REFERENCES products (product_id) ON DELETE RESTRICT,
    name            VARCHAR(120)  NOT NULL,
    sku             VARCHAR(80)   NOT NULL UNIQUE,
    price_override  DECIMAL(10,2),  -- Precio alternativo si la variante cuesta distinto
    active          BOOLEAN       NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_variants_price_override CHECK (price_override IS NULL OR price_override >= 0),
    CONSTRAINT uq_variants_id_product UNIQUE (variant_id, product_id)  -- Destino de la clave compuesta de variant_images
);

CREATE INDEX idx_variants_product ON product_variants (product_id);

CREATE TABLE product_images (
    image_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id  BIGINT       NOT NULL REFERENCES products (product_id) ON DELETE CASCADE,
    image_url   VARCHAR(500) NOT NULL,
    alt_text    VARCHAR(250) NOT NULL,
    sort_order  INTEGER      NOT NULL DEFAULT 0,
    CONSTRAINT uq_images_id_product UNIQUE (image_id, product_id),  -- Destino de la clave compuesta de variant_images
    CONSTRAINT uq_product_images_product_url UNIQUE (product_id, image_url)
);

CREATE INDEX idx_images_product ON product_images (product_id, sort_order);

CREATE TABLE variant_images (
    variant_id  BIGINT  NOT NULL,
    image_id    BIGINT  NOT NULL,
    product_id  BIGINT  NOT NULL,  -- Obliga a que la variante y la foto sean del mismo producto
    sort_order  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (variant_id, image_id),
    CONSTRAINT fk_variant_images_variant FOREIGN KEY (variant_id, product_id)
        REFERENCES product_variants (variant_id, product_id) ON DELETE CASCADE,
    CONSTRAINT fk_variant_images_image FOREIGN KEY (image_id, product_id)
        REFERENCES product_images (image_id, product_id) ON DELETE CASCADE
);

CREATE INDEX idx_variant_images_image ON variant_images (image_id);

-- ---------------------------------------------------------------------
-- Reseñas
-- ---------------------------------------------------------------------
CREATE TABLE reviews (
    review_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id  BIGINT       NOT NULL REFERENCES products (product_id) ON DELETE CASCADE,
    user_id     BIGINT       NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    rating      SMALLINT     NOT NULL,
    comment     VARCHAR(600) NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'published',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT chk_reviews_status CHECK (status IN ('published', 'hidden')),
    CONSTRAINT uq_reviews_user_product UNIQUE (user_id, product_id)  -- Una reseña por cuenta y producto
);

CREATE INDEX idx_reviews_product ON reviews (product_id);

-- ---------------------------------------------------------------------
-- Direcciones de entrega
-- ---------------------------------------------------------------------
CREATE TABLE user_addresses (
    address_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    recipient_name  VARCHAR(120) NOT NULL,
    phone           VARCHAR(30)  NOT NULL,
    province        VARCHAR(100) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    address_line    VARCHAR(250) NOT NULL,
    is_default      BOOLEAN      NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_addresses_id_user UNIQUE (address_id, user_id),  -- Destino de la clave compuesta de orders
    -- Máximo una dirección predeterminada por usuario. Se comprueba al final de cada
    -- sentencia para poder cambiarla con un solo UPDATE.
    CONSTRAINT excl_addresses_one_default
        EXCLUDE USING btree (user_id WITH =) WHERE (is_default)
        DEFERRABLE INITIALLY IMMEDIATE
);

CREATE INDEX idx_addresses_user ON user_addresses (user_id);

-- ---------------------------------------------------------------------
-- Carritos
-- ---------------------------------------------------------------------
CREATE TABLE carts (
    cart_id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     BIGINT      NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    status      VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_carts_status CHECK (status IN ('active', 'converted', 'abandoned'))
);

CREATE INDEX idx_carts_user ON carts (user_id);

-- Cada usuario puede tener como máximo un carrito activo
CREATE UNIQUE INDEX uq_carts_one_active
    ON carts (user_id)
    WHERE status = 'active';

CREATE TRIGGER trg_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE cart_items (
    cart_id     BIGINT  NOT NULL REFERENCES carts (cart_id) ON DELETE CASCADE,
    variant_id  BIGINT  NOT NULL REFERENCES product_variants (variant_id) ON DELETE CASCADE,
    quantity    INTEGER NOT NULL,
    PRIMARY KEY (cart_id, variant_id),
    CONSTRAINT chk_cart_items_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_cart_items_variant ON cart_items (variant_id);

-- Cualquier cambio en los artículos cuenta como actividad del carrito
CREATE FUNCTION touch_cart()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE carts SET updated_at = now() WHERE cart_id = OLD.cart_id;
    ELSE
        UPDATE carts SET updated_at = now() WHERE cart_id = NEW.cart_id;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_cart_items_touch_cart
    AFTER INSERT OR UPDATE OR DELETE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION touch_cart();

-- ---------------------------------------------------------------------
-- Pedidos
-- ---------------------------------------------------------------------
CREATE TABLE orders (
    order_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id        BIGINT        NOT NULL REFERENCES users (user_id) ON DELETE RESTRICT,
    address_id     BIGINT        NOT NULL,
    -- Copia de la dirección en el momento de la compra: editarla después no cambia el pedido
    shipping_recipient_name  VARCHAR(120) NOT NULL,
    shipping_phone           VARCHAR(30)  NOT NULL,
    shipping_province        VARCHAR(100) NOT NULL,
    shipping_city            VARCHAR(100) NOT NULL,
    shipping_address_line    VARCHAR(250) NOT NULL,
    status         VARCHAR(30)   NOT NULL DEFAULT 'pending',
    subtotal       DECIMAL(10,2) NOT NULL,
    shipping_cost  DECIMAL(10,2) NOT NULL DEFAULT 0,
    total          DECIMAL(10,2) NOT NULL,
    currency       CHAR(3)       NOT NULL DEFAULT 'USD',
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    -- La dirección debe pertenecer al usuario del pedido
    CONSTRAINT fk_orders_address_user FOREIGN KEY (address_id, user_id)
        REFERENCES user_addresses (address_id, user_id) ON DELETE RESTRICT,
    CONSTRAINT chk_orders_status CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
    CONSTRAINT chk_orders_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_orders_shipping CHECK (shipping_cost >= 0),
    CONSTRAINT chk_orders_total CHECK (total = subtotal + shipping_cost),
    CONSTRAINT chk_orders_currency CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE INDEX idx_orders_user ON orders (user_id);
CREATE INDEX idx_orders_address ON orders (address_id);

CREATE TABLE order_items (
    order_item_id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id               BIGINT        NOT NULL REFERENCES orders (order_id) ON DELETE RESTRICT,
    variant_id             BIGINT        NOT NULL REFERENCES product_variants (variant_id) ON DELETE RESTRICT,
    product_name_snapshot  VARCHAR(160)  NOT NULL,  -- Nombre en el momento de la compra
    variant_snapshot       VARCHAR(120)  NOT NULL,  -- Variante en el momento de la compra
    unit_price             DECIMAL(10,2) NOT NULL,  -- Precio aplicado en el momento de la compra
    quantity               INTEGER       NOT NULL,
    CONSTRAINT chk_order_items_price CHECK (unit_price >= 0),
    CONSTRAINT chk_order_items_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_order_items_variant ON order_items (variant_id);

-- ---------------------------------------------------------------------
-- Pagos: un pedido puede tener varios intentos.
-- Nunca se guardan números de tarjeta ni CVV, solo la referencia del proveedor.
-- ---------------------------------------------------------------------
CREATE TABLE payments (
    payment_id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id            BIGINT        NOT NULL REFERENCES orders (order_id) ON DELETE RESTRICT,
    method              VARCHAR(30)   NOT NULL,
    status              VARCHAR(30)   NOT NULL DEFAULT 'pending',
    amount              DECIMAL(10,2) NOT NULL,
    provider_reference  VARCHAR(150),
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT chk_payments_method CHECK (method IN ('card', 'transfer')),
    CONSTRAINT chk_payments_status CHECK (status IN ('pending', 'approved', 'declined')),
    CONSTRAINT chk_payments_amount CHECK (amount >= 0)
);

CREATE INDEX idx_payments_order ON payments (order_id);

-- Un pedido admite varios intentos, pero un solo pago aprobado
CREATE UNIQUE INDEX uq_payments_one_approved
    ON payments (order_id)
    WHERE status = 'approved';

-- ---------------------------------------------------------------------
-- Vista de ofertas: productos activos con precio anterior mayor al actual
-- ---------------------------------------------------------------------
CREATE VIEW product_offers AS
SELECT *
FROM products
WHERE active
  AND original_price > price;

COMMIT;
