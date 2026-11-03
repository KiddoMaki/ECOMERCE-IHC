import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { pool } from "./database.js";
import { cartRouter } from "./routes/cart.js";
import { requireAuth } from "./middleware/require-auth.js";
import { ordersRouter } from "./routes/orders.js";
import { productsRouter } from "./routes/products.js";
import { reviewsRouter } from "./routes/reviews.js";

const defaultOrigins = [
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:4175",
  "http://127.0.0.1:4175",
  "http://localhost:4176",
  "http://127.0.0.1:4176"
];
const configuredOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
if (configuredOrigins.includes("*")) {
  throw new Error("ALLOWED_ORIGINS must list explicit origins; '*' is not allowed.");
}
for (const origin of configuredOrigins) {
  let parsedOrigin;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    throw new Error("ALLOWED_ORIGINS contains an invalid URL.");
  }
  if (!["http:", "https:"].includes(parsedOrigin.protocol) || parsedOrigin.origin !== origin) {
    throw new Error("ALLOWED_ORIGINS must contain only exact HTTP(S) origins without paths.");
  }
}
const allowedOrigins = new Set([...defaultOrigins, ...configuredOrigins]);

export const app = express();
app.disable("x-powered-by");
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
const orderRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Se alcanzó el límite temporal de solicitudes de pedido." }
});
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    const error = new Error("Origin is not allowed.");
    error.status = 403;
    callback(error);
  },
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "16kb" }));

app.get("/api/health", async (_request, response) => {
  if (!pool) {
    response.status(503).json({ status: "unavailable", database: "not_configured" });
    return;
  }
  try {
    await pool.query("SELECT 1");
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("API health check failed.", error.code || "database_error");
    response.status(503).json({ status: "unavailable", database: "disconnected" });
  }
});

app.use("/api/productos", productsRouter);
app.use("/api/carrito", requireAuth, cartRouter);
app.use("/api/pedidos", orderRateLimit, requireAuth, ordersRouter);
app.use("/api/productos", reviewsRouter);
app.use((_request, response) => {
  response.status(404).json({ error: "Ruta no encontrada." });
});

app.use((error, _request, response, _next) => {
  if (response.headersSent) return;
  if (error.type === "entity.parse.failed") {
    response.status(400).json({ error: "El cuerpo de la solicitud no es JSON válido." });
    return;
  }
  if (error.type === "entity.too.large") {
    response.status(413).json({ error: "La solicitud supera el tamaño permitido." });
    return;
  }
  if (error.status === 403) {
    response.status(403).json({ error: "Origen no autorizado." });
    return;
  }
  console.error("API request failed.", error.code || "unhandled_error");
  response.status(500).json({ error: "No se pudo completar la solicitud." });
});
