import { getAccessToken } from "./neon-auth-client.js";

const configuredApiUrl = window.PICHUPAPER_API_URL?.trim().replace(/\/+$/, "") || "";

export const apiConfigured = Boolean(configuredApiUrl);

const categories = new Set(["Cuadernos", "Bolígrafos", "Escritorio", "Arte"]);
const visualClasses = new Set(["art-mint", "art-sky", "art-navy", "art-white"]);
const isText = (value, maxLength) =>
  typeof value === "string" && value.length > 0 && value.length <= maxLength;

function validateProduct(product) {
  if (!product || typeof product !== "object" || Array.isArray(product)) return false;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.id || "")) return false;
  if (!isText(product.name, 160) || !categories.has(product.category)) return false;
  if (!isText(product.tag, 120) ||
      typeof product.description !== "string" ||
      product.description.length > 2000) return false;
  if (!visualClasses.has(product.color) || !/^fa-[a-z0-9-]+$/.test(product.icon || "")) return false;
  if (!Number.isFinite(product.price) || product.price < 0) return false;
  if (product.originalPrice !== null &&
      (!Number.isFinite(product.originalPrice) || product.originalPrice < product.price)) return false;
  if (!Number.isFinite(product.rating) || product.rating < 0 || product.rating > 5) return false;
  if (!Array.isArray(product.variants) || product.variants.length === 0 ||
      !product.variants.every((variant) => isText(variant, 120))) return false;
  if (!Array.isArray(product.variantSkus) ||
      product.variantSkus.length !== product.variants.length ||
      !product.variantSkus.every((sku) => /^[a-z0-9]+(?:-[a-z0-9]+)*-v[1-9]\d*$/.test(sku))) return false;
  if (!Array.isArray(product.images) ||
      !product.images.every((image) =>
        typeof image === "string" &&
        /^assets\/products\/[a-zA-Z0-9._/-]+$/.test(image) &&
        !image.split("/").includes(".."))) return false;
  if (!Array.isArray(product.variantImageGroups) ||
      product.variantImageGroups.length !== product.variants.length ||
      !product.variantImageGroups.every((group) =>
        Array.isArray(group) &&
        (product.images.length === 0 ? group.length === 0 : group.length > 0) &&
        group.every((index) => Number.isInteger(index) && index >= 0 && index < product.images.length))) return false;
  return true;
}

export async function fetchProducts() {
  const response = await fetch(`${configuredApiUrl}/api/productos`, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`El catálogo no respondió (HTTP ${response.status}).`);
  }
  const payload = await response.json();
  const products = Array.isArray(payload) ? payload : payload.items;
  if (!Array.isArray(products)) {
    throw new Error("La respuesta del catálogo tiene un formato inesperado.");
  }
  if (!products.every(validateProduct)) {
    throw new Error("El catálogo contiene datos incompletos o incompatibles.");
  }
  return products;
}

export async function createOrder(order) {
  const token = await getAccessToken();
  const response = await fetch(`${configuredApiUrl}/api/pedidos`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(order)
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `No se pudo registrar el pedido (HTTP ${response.status}).`);
  return payload;
}

export async function fetchCart() {
  const token = await getAccessToken();
  const response = await fetch(`${configuredApiUrl}/api/carrito`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `No se pudo cargar el carrito (HTTP ${response.status}).`);
  if (!Array.isArray(payload.items)) throw new Error("La respuesta del carrito tiene un formato inesperado.");
  return payload.items;
}

export async function saveCart(items) {
  const token = await getAccessToken();
  const response = await fetch(`${configuredApiUrl}/api/carrito`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ items })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `No se pudo guardar el carrito (HTTP ${response.status}).`);
  return payload;
}

export async function fetchReviews(productId) {
  const response = await fetch(`${configuredApiUrl}/api/productos/${encodeURIComponent(productId)}/resenas`, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error(`No se pudieron cargar las reseñas (HTTP ${response.status}).`);
  const payload = await response.json();
  if (!Array.isArray(payload.items)) throw new Error("La respuesta de reseñas tiene un formato inesperado.");
  return payload.items;
}

export async function createReview(productId, review) {
  const token = await getAccessToken();
  const response = await fetch(`${configuredApiUrl}/api/productos/${encodeURIComponent(productId)}/resenas`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(review)
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `No se pudo publicar la reseña (HTTP ${response.status}).`);
  return payload.item;
}
