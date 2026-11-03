import { Router } from "express";
import { pool } from "../database.js";

export const ordersRouter = Router();

ordersRouter.post("/", async (request, response, next) => {
  const { items, shipping, paymentMethod } = request.body ?? {};
  if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
    response.status(400).json({ error: "El pedido debe incluir entre 1 y 100 artículos." });
    return;
  }
  if (!shipping || typeof shipping !== "object" ||
      typeof shipping.name !== "string" || shipping.name.trim().length < 2 || shipping.name.length > 120 ||
      typeof shipping.phone !== "string" || shipping.phone.length > 30 ||
      typeof shipping.province !== "string" || shipping.province.trim().length < 2 || shipping.province.length > 100 ||
      typeof shipping.city !== "string" || shipping.city.trim().length < 2 || shipping.city.length > 100 ||
      typeof shipping.address !== "string" || shipping.address.trim().length < 5 || shipping.address.length > 250 ||
      !/^(09\d{8}|\+5939\d{8}|5939\d{8})$/.test(shipping.phone.replace(/[\s()-]/g, ""))) {
    response.status(400).json({ error: "Los datos de entrega no son válidos." });
    return;
  }
  if (!["card", "transfer"].includes(paymentMethod)) {
    response.status(400).json({ error: "Selecciona un método de pago válido." });
    return;
  }

  const normalizedItems = [];
  const seenVariants = new Set();
  for (const item of items) {
    if (!item || typeof item.productId !== "string" ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.productId) ||
        typeof item.variantSku !== "string" ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*-v[1-9]\d*$/.test(item.variantSku) ||
        !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      response.status(400).json({ error: "Uno o más artículos tienen datos inválidos." });
      return;
    }
    if (seenVariants.has(item.variantSku)) {
      response.status(400).json({ error: "Combina las cantidades de cada variante en una sola línea." });
      return;
    }
    seenVariants.add(item.variantSku);
    normalizedItems.push({
      productId: item.productId,
      variantSku: item.variantSku,
      quantity: item.quantity
    });
  }

  if (!pool) {
    response.status(503).json({ error: "El registro de pedidos no está configurado." });
    return;
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const orderItems = [];
    for (const item of normalizedItems) {
      const { rows } = await client.query(
        `SELECT p.product_id, p.name, p.price,
                v.variant_id, v.name AS variant_name,
                COALESCE(v.price_override, p.price) AS unit_price
         FROM products p
         JOIN product_variants v ON v.product_id = p.product_id
         WHERE p.slug = $1 AND p.active = TRUE
           AND v.sku = $2 AND v.active = TRUE
         FOR SHARE OF p, v`,
        [item.productId, item.variantSku]
      );
      const product = rows[0];
      if (!product) {
        await client.query("ROLLBACK");
        response.status(404).json({ error: `No se encontró el producto o variante ${item.productId}.` });
        return;
      }
      orderItems.push({
        ...item,
        productId: product.product_id,
        productName: product.name,
        variantId: product.variant_id,
        variantName: product.variant_name,
        unitPriceCents: BigInt(Math.round(Number(product.unit_price) * 100))
      });
    }

    const subtotalCents = orderItems.reduce(
      (sum, item) => sum + item.unitPriceCents * BigInt(item.quantity),
      0n
    );
    const shippingCents = 0n;
    const totalCents = subtotalCents + shippingCents;
    if (totalCents > 9999999999n) {
      await client.query("ROLLBACK");
      response.status(400).json({ error: "El total del pedido supera el límite permitido." });
      return;
    }
    const formatCents = (cents) => `${cents / 100n}.${String(cents % 100n).padStart(2, "0")}`;
    const addressResult = await client.query(
      `INSERT INTO user_addresses
         (user_id, recipient_name, phone, province, city, address_line)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING address_id`,
      [
        request.authUser.id,
        shipping.name.trim(),
        shipping.phone.trim(),
        shipping.province.trim(),
        shipping.city.trim(),
        shipping.address.trim()
      ]
    );
    const orderResult = await client.query(
      `INSERT INTO orders
         (user_id, address_id, shipping_recipient_name, shipping_phone,
          shipping_province, shipping_city, shipping_address_line,
          status, subtotal, shipping_cost, total, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, $9, $10, 'USD')
       RETURNING order_id, status, total, currency, created_at`,
      [
        request.authUser.id,
        addressResult.rows[0].address_id,
        shipping.name.trim(),
        shipping.phone.trim(),
        shipping.province.trim(),
        shipping.city.trim(),
        shipping.address.trim(),
        formatCents(subtotalCents),
        formatCents(shippingCents),
        formatCents(totalCents)
      ]
    );
    const order = orderResult.rows[0];
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items
           (order_id, variant_id, product_name_snapshot, variant_snapshot, unit_price, quantity)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order.order_id,
          item.variantId,
          item.productName,
          item.variantName,
          formatCents(item.unitPriceCents),
          item.quantity
        ]
      );
    }
    await client.query(
      `INSERT INTO payments (order_id, method, status, amount)
       VALUES ($1, $2, 'pending', $3)`,
      [order.order_id, paymentMethod, order.total]
    );
    await client.query(
      "UPDATE carts SET status = 'converted' WHERE user_id = $1 AND status = 'active'",
      [request.authUser.id]
    );
    await client.query("COMMIT");
    response.status(201).json({
      orderId: order.order_id,
      status: order.status,
      total: order.total,
      currency: order.currency,
      paymentStatus: "pending",
      shippingStatus: "to_be_confirmed",
      items: orderItems.map((item) => ({
        productName: item.productName,
        variantName: item.variantName,
        unitPrice: formatCents(item.unitPriceCents),
        quantity: item.quantity
      })),
      createdAt: order.created_at
    });
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Order transaction rollback failed.", rollbackError.code || "rollback_error");
      }
    }
    next(error);
  } finally {
    client?.release();
  }
});
