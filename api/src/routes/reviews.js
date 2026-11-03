import { Router } from "express";
import { requireAuth } from "../middleware/require-auth.js";
import { query } from "../database.js";

export const reviewsRouter = Router();

reviewsRouter.get("/:productId/resenas", async (request, response, next) => {
  try {
    const { rows } = await query(
      `SELECT r.rating, r.comment, r.created_at AS "createdAt", u.name AS author
       FROM reviews r
       JOIN products p ON p.product_id = r.product_id
       JOIN users u ON u.user_id = r.user_id
       WHERE p.slug = $1 AND p.active = TRUE AND r.status = 'published'
       ORDER BY r.created_at DESC
       LIMIT 100`,
      [request.params.productId]
    );
    response.json({ items: rows });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.post("/:productId/resenas", requireAuth, async (request, response, next) => {
  const { rating, comment } = request.body ?? {};
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 ||
      typeof comment !== "string" || comment.trim().length < 3 || comment.trim().length > 600) {
    response.status(400).json({ error: "La calificación o el comentario no son válidos." });
    return;
  }

  try {
    const { rows } = await query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       SELECT p.product_id, $2, $3, $4
       FROM products p
       WHERE p.slug = $1 AND p.active = TRUE
       ON CONFLICT (user_id, product_id) DO UPDATE
         SET rating = EXCLUDED.rating,
             comment = EXCLUDED.comment,
             status = 'published',
             created_at = NOW()
       RETURNING rating, comment, created_at AS "createdAt"`,
      [request.params.productId, request.authUser.id, rating, comment.trim()]
    );
    if (!rows[0]) {
      response.status(404).json({ error: "No se encontró el producto." });
      return;
    }
    response.status(201).json({ item: { ...rows[0], author: request.authUser.name } });
  } catch (error) {
    next(error);
  }
});
