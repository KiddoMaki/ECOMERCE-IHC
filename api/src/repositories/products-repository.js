import { query } from "../database.js";

const categoryVisuals = Object.freeze({
  Cuadernos: { icon: "fa-book-open", color: "art-mint" },
  "Bolígrafos": { icon: "fa-pen", color: "art-sky" },
  Escritorio: { icon: "fa-box-open", color: "art-white" },
  Arte: { icon: "fa-palette", color: "art-navy" }
});

const productQuery = `
  SELECT
    p.product_id,
    p.slug,
    p.name,
    c.name AS category,
    p.price,
    p.original_price,
    COALESCE(review_summary.rating, 0)::numeric(2, 1) AS rating,
    p.description,
    v.variant_id,
    v.sku,
    v.name AS variant_name,
    i.image_id,
    i.image_url,
    vi.sort_order AS variant_image_order
  FROM products p
  JOIN categories c ON c.category_id = p.category_id
  LEFT JOIN product_variants v ON v.product_id = p.product_id AND v.active = TRUE
  LEFT JOIN product_images i ON i.product_id = p.product_id
  LEFT JOIN variant_images vi ON vi.variant_id = v.variant_id AND vi.image_id = i.image_id
  LEFT JOIN (
    SELECT product_id, ROUND(AVG(rating)::numeric, 1) AS rating
    FROM reviews
    WHERE status = 'published'
    GROUP BY product_id
  ) review_summary ON review_summary.product_id = p.product_id
  WHERE p.active = TRUE
    AND ($1::text IS NULL OR p.slug = $1)
  ORDER BY p.name, v.variant_id, i.sort_order, vi.sort_order`;

function mapProducts(rows) {
  const products = new Map();
  for (const row of rows) {
    let product = products.get(row.slug);
    if (!product) {
      const visual = categoryVisuals[row.category];
      if (!visual) throw new Error(`Unsupported product category: ${row.category}`);
      product = {
        id: row.slug,
        name: row.name,
        category: row.category,
        price: Number(row.price),
        originalPrice: row.original_price === null ? null : Number(row.original_price),
        rating: Number(row.rating),
        icon: visual.icon,
        color: visual.color,
        tag: row.variant_name || row.category,
        description: row.description ?? "",
        variants: [],
        variantSkus: [],
        images: [],
        variantImageGroups: []
      };
      products.set(row.slug, product);
    }

    if (row.variant_id && !product.variants.some((variant) => variant.sku === row.sku)) {
      product.variants.push({ sku: row.sku, name: row.variant_name });
      product.variantSkus.push(row.sku);
      product.variantImageGroups.push([]);
    }

    if (row.image_id && !product.images.some((image) => image.id === row.image_id)) {
      product.images.push({ id: row.image_id, url: row.image_url });
    }

    if (row.variant_id && row.image_id && row.variant_image_order !== null) {
      const variantIndex = product.variants.findIndex((variant) => variant.sku === row.sku);
      const imageIndex = product.images.findIndex((image) => image.id === row.image_id);
      if (variantIndex >= 0 && imageIndex >= 0 && !product.variantImageGroups[variantIndex].includes(imageIndex)) {
        product.variantImageGroups[variantIndex].push(imageIndex);
      }
    }
  }

  return [...products.values()].map((product) => {
    const images = product.images.map((image) => image.url);
    const allImageIndexes = images.map((_, index) => index);
    return {
      ...product,
      variants: product.variants.map((variant) => variant.name),
      images,
      variantImageGroups: product.variantImageGroups.map((group) =>
        group.length ? group.sort((a, b) => a - b) : [...allImageIndexes])
    };
  });
}

export async function listProducts(slug = null) {
  const { rows } = await query(productQuery, [slug]);
  return mapProducts(rows);
}
