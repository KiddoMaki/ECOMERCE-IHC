import { Router } from "express";
import { pool, query } from "../database.js";

export const cartRouter = Router();

const isValidItem = (item) =>
  item &&
  typeof item.variantSku === "string" &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*-v[1-9]\d*$/.test(item.variantSku) &&
  Number.isInteger(item.quantity) &&
  item.quantity >= 1 &&
  item.quantity <= 99;

async function createOrGetCart(client, userId) {
  await client.query(
    `INSERT INTO carts (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) WHERE status = 'active' DO NOTHING`,
    [userId]
  );
  const { rows } = await client.query(
    "SELECT cart_id FROM carts WHERE user_id = $1 AND status = 'active' FOR UPDATE",
    [userId]
  );
  return rows[0].cart_id;
}

cartRouter.get("/", async (request, response, next) => {
  let client;
  try {
    if (!pool) {
      response.status(503).json({ error: "El carrito persistente no está configurado." });
      return;
    }
    client = await pool.connect();
    await client.query("BEGIN");
    const cartId = await createOrGetCart(client, request.authUser.id);
    const { rows } = await client.query(
      `SELECT p.slug AS "productId", v.sku AS "variantSku",
              v.name AS variant, ci.quantity
       FROM cart_items ci
       JOIN product_variants v ON v.variant_id = ci.variant_id
       JOIN products p ON p.product_id = v.product_id
       WHERE ci.cart_id = $1 AND p.active = TRUE AND v.active = TRUE
       ORDER BY p.name, v.name`,
      [cartId]
    );
    await client.query("COMMIT");
    response.json({ items: rows });
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Cart read rollback failed.", rollbackError.code || "rollback_error");
      }
    }
    next(error);
  } finally {
    client?.release();
  }
});

cartRouter.put("/", async (request, response, next) => {
  const { items } = request.body ?? {};
  if (!Array.isArray(items) || items.length > 100 || !items.every(isValidItem) ||
      new Set(items.map((item) => item.variantSku)).size !== items.length) {
    response.status(400).json({ error: "Los artículos del carrito no son válidos." });
    return;
  }
  if (!pool) {
    response.status(503).json({ error: "El carrito persistente no está configurado." });
    return;
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const cartId = await createOrGetCart(client, request.authUser.id);
    const variants = [];
    for (const item of items) {
      const { rows } = await client.query(
        `SELECT v.variant_id
         FROM product_variants v
         JOIN products p ON p.product_id = v.product_id
         WHERE v.sku = $1 AND v.active = TRUE AND p.active = TRUE`,
        [item.variantSku]
      );
      if (!rows[0]) {
        await client.query("ROLLBACK");
        response.status(404).json({ error: `No está disponible la variante ${item.variantSku}.` });
        return;
      }
      variants.push({ variantId: rows[0].variant_id, quantity: item.quantity });
    }
    await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
    for (const item of variants) {
      await client.query(
        "INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES ($1, $2, $3)",
        [cartId, item.variantId, item.quantity]
      );
    }
    await client.query("COMMIT");
    response.json({ saved: true, itemCount: items.length });
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Cart transaction rollback failed.", rollbackError.code || "rollback_error");
      }
    }
    next(error);
  } finally {
    client?.release();
  }
});
