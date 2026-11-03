import { Router } from "express";
import { listProducts } from "../repositories/products-repository.js";

export const productsRouter = Router();

productsRouter.get("/", async (_request, response, next) => {
  try {
    response.json({ items: await listProducts() });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:id", async (request, response, next) => {
  try {
    const [product] = await listProducts(request.params.id);
    if (!product) {
      response.status(404).json({ error: "Producto no encontrado." });
      return;
    }
    response.json(product);
  } catch (error) {
    next(error);
  }
});
