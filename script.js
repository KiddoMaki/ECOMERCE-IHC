import { createAuthController } from "./src/controllers/auth-controller.js";
import { sessionModel } from "./src/models/session-model.js";
import { renderContactPage, renderFaqPage, renderLoginPage, renderRegisterPage } from "./src/views/page-views.js";
import { apiConfigured, createOrder, createReview, fetchCart, fetchProducts, fetchReviews, saveCart } from "./src/client/api-client.js";
import { authConfigured } from "./src/client/neon-auth-client.js";

let products = [];
const productDetails = {
  "cuaderno-a5": { description: "Un cuaderno ligero para apuntes, listas y bocetos cotidianos. Papel de buen cuerpo y una portada botánica que alegra el escritorio.", variants: ["A5 · rayado", "A5 · puntos", "A4 · rayado"] },
  "cuaderno-rayas": { description: "Una libreta sencilla para llevar ideas a todas partes, con hojas rayadas y encuadernación flexible.", variants: ["A5 · 80 hojas", "A6 · 80 hojas"] },
  "boligrafo-gel": { description: "Trazo fluido de punta fina para escribir con precisión en tus apuntes y listas.", variants: ["Azul · 0.5 mm", "Negro · 0.5 mm", "Verde · 0.5 mm"] },
  "set-resaltadores": { description: "Cuatro tonos suaves para subrayar sin perder de vista lo importante.", variants: ["Set pastel · 4 tonos"] },
  organizador: { description: "Un espacio práctico para tener a mano tus herramientas favoritas y despejar la mesa.", variants: ["Natural · compacto", "Natural · ampliado"] },
  "notas-adhesivas": { description: "Notas adhesivas en cinco colores para recordatorios, marcadores y pequeñas ideas.", variants: ["Set x 5 · cuadradas"] },
  "lapices-color": { description: "Doce tonos versátiles para colorear, sombrear y dar vida a tus dibujos.", variants: ["12 tonos · estándar"] },
  "marcadores-arte": { description: "Marcadores de doble punta para trazos expresivos, lettering e ilustración.", variants: ["Set x 6 · surtidos", "Set x 12 · surtidos"] },
  "planificador-semanal": { description: "Planificador compacto para ordenar tareas, citas y prioridades durante la semana.", variants: ["A5 · semana vista", "A4 · semana vista"] },
  "bloc-listas": { description: "Bloc desprendible para listas de compras, pendientes y recordatorios del día.", variants: ["50 hojas · liso"] },
  "boligrafo-retractil": { description: "Bolígrafo retráctil de tinta negra para notas y escritura cotidiana.", variants: ["Negro · 0.7 mm"] },
  "set-boligrafos-color": { description: "Seis colores vivos para organizar apuntes y destacar ideas importantes.", variants: ["Set x 6 · surtidos"] },
  portalapices: { description: "Portalápices compacto para mantener tus herramientas de escritura al alcance.", variants: ["Verde salvia", "Azul cielo"] },
  "cinta-decorativa": { description: "Cintas de papel decorativas para personalizar cuadernos, tarjetas y proyectos creativos.", variants: ["Set x 3 · estampados surtidos"] },
  acuarelas: { description: "Set compacto de acuarelas para practicar mezclas y crear ilustraciones en cualquier lugar.", variants: ["12 colores · incluye pincel"] },
  "cuaderno-dibujo": { description: "Cuaderno con papel de mayor gramaje, ideal para bocetos, lápiz y técnicas secas.", variants: ["A4 · 30 hojas"] }
};

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const categoryFilters = document.querySelector("#categoryFilters");
const offersFilterButton = categoryFilters.querySelector("[data-offers-toggle]");
const cartDrawer = document.querySelector("#cartDrawer");
const cartBackdrop = document.querySelector("#cartBackdrop");
const toast = document.querySelector("#toast");
let activeCategory = "Todos";
let offersOnly = false;
let cart = [];
let toastTimer;
let focusBeforeCart = null;
let checkoutContact = null;
let checkoutReturnFocus = null;
let checkoutStep = 1;
let currentRoute = "/";
let detailQuantity = 1;
let detailVariant = "";
let detailImageIndex = 0;
let pendingAdd = null;
let pendingCheckout = false;
let productLoadState = "loading";
let pendingRemoval = null;
let cartSync = Promise.resolve();
let removalConfirmationResolve = null;
let focusBeforeRemovalConfirmation = null;
let bodyOverflowBeforeRemovalConfirmation = "";
const reviewsByProduct = {};

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function syncCart() {
  if (!sessionModel.isSignedIn() || !apiConfigured) return;
  const items = cart.map((item) => {
    const variantIndex = productDetails[item.id]?.variants.indexOf(item.variant) ?? -1;
    return {
      variantSku: products.find((product) => product.id === item.id)?.variantSkus?.[variantIndex],
      quantity: item.quantity
    };
  });
  if (items.some((item) => !item.variantSku)) {
    showToast("No se pudo identificar una variante del carrito.", { type: "error" });
    return;
  }
  cartSync = cartSync.then(() => saveCart(items)).catch((error) => {
    console.error("No se pudo guardar el carrito en la cuenta.", error);
    showApiError(error, "No se pudo sincronizar el carrito.");
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderProductReviews(product) {
  const reviews = reviewsByProduct[product.id] || [];
  const reviewItems = reviews.length
    ? reviews.map((review) => `
        <article class="review-entry">
          <div class="review-entry-meta"><span class="review-stars" aria-label="${review.rating} de 5 estrellas">${'<i class="fa-solid fa-star" aria-hidden="true"></i>'.repeat(review.rating)}</span><span class="review-entry-details"><span>${escapeHtml(review.author || "Cliente")}</span><time datetime="${escapeHtml(review.createdAt)}">${new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" }).format(new Date(review.createdAt))}</time></span></div>
          <p>${escapeHtml(review.comment)}</p>
        </article>`).join("")
    : `<p class="reviews-empty">Aún no hay reseñas para este producto.</p>`;
  const reviewForm = sessionModel.isSignedIn()
    ? `<form class="review-form" data-review-form data-product-id="${product.id}">
        <h3>Comparte tu opinión</h3>
        <p>Publicando como ${escapeHtml(sessionModel.getUser()?.name || sessionModel.getUser()?.email || "cliente")}.</p>
        <fieldset class="review-rating-fieldset">
          <legend class="review-field-label">Calificación</legend>
          <div class="review-star-options" aria-label="Elige de 1 a 5 estrellas">${[5, 4, 3, 2, 1].map((rating) => `<label class="review-star-option"><input class="sr-only" type="radio" name="review-rating" value="${rating}" required /><span class="review-star-glyph" aria-hidden="true"><i class="fa-solid fa-star"></i></span><span class="sr-only">${rating} ${rating === 1 ? "estrella" : "estrellas"}</span></label>`).join("")}</div>
        </fieldset>
        <label class="review-field-label" for="review-comment-${product.id}">Comentario</label>
        <textarea class="review-input review-textarea" id="review-comment-${product.id}" name="review-comment" rows="4" maxlength="600" required data-testid="review-comment-${product.id}"></textarea>
        <button class="button-primary review-submit" type="submit" data-testid="review-submit-${product.id}">Publicar reseña <i class="fa-solid fa-paper-plane" aria-hidden="true"></i></button>
        <p class="review-data-note">Tu opinión se guardará en tu cuenta.</p>
      </form>`
    : `<div class="review-form"><h3>Comparte tu opinión</h3><p>Inicia sesión para publicar una reseña.</p><a class="button-primary review-submit" href="#/login" data-route="/login">Iniciar sesión</a></div>`;
  return `<section class="reviews-section" data-testid="product-reviews-${product.id}" aria-labelledby="reviews-title-${product.id}">
    <div class="reviews-heading"><div><span class="section-kicker">Opiniones de clientes</span><h2 id="reviews-title-${product.id}" tabindex="-1">Reseñas</h2></div><span class="reviews-count" data-testid="review-count-${product.id}">${reviews.length} ${reviews.length === 1 ? "reseña" : "reseñas"}</span></div>
    <div class="reviews-layout">
      ${reviewForm}
      <div class="reviews-list" data-testid="review-list-${product.id}" aria-live="polite">${reviewItems}</div>
    </div>
  </section>`;
}

function productVisual(product, variant = "") {
  const variantIndex = productDetails[product.id].variants.indexOf(variant);
  const imageIndex = product.variantImageGroups?.[variantIndex]?.[0] ?? (product.variantImages && variantIndex >= 0 ? variantIndex : 0);
  const image = product.images?.[imageIndex] || product.images?.[0] || product.image;
  if (image) {
    return `<img class="product-photo" src="${escapeHtml(image)}" alt="" loading="lazy" decoding="async" />`;
  }
  return `<i class="fa-solid ${escapeHtml(product.icon)}" aria-hidden="true"></i>`;
}

function renderDetailVisual(product) {
  const images = product.images || (product.image ? [product.image] : []);
  if (!images.length) {
    return `<div class="detail-art product-art ${escapeHtml(product.color)}" role="img" aria-label="${escapeHtml(product.name)}"><span class="art-tag">${escapeHtml(product.tag)}</span>${productVisual(product)}</div>`;
  }
  const variantIndex = productDetails[product.id].variants.indexOf(detailVariant);
  const imageIndexes = product.variantImageGroups?.[variantIndex] || images.map((_, index) => index);
  const selectedIndex = imageIndexes.includes(detailImageIndex) ? detailImageIndex : imageIndexes[0];
  const thumbnails = imageIndexes.length > 1
    ? `<div class="product-gallery-thumbnails" role="group" aria-label="Imágenes de ${escapeHtml(product.name)}">${imageIndexes.map((index) => `
        <button class="product-gallery-thumbnail${index === selectedIndex ? " active" : ""}" type="button" data-detail-image="${index}" aria-label="Ver imagen ${index + 1} de ${images.length} de ${escapeHtml(product.name)}" aria-pressed="${index === selectedIndex}">
          <img src="${escapeHtml(images[index])}" alt="" loading="lazy" decoding="async" />
        </button>`).join("")}</div>`
    : "";
  return `<div class="product-gallery">
    <div class="detail-art product-art detail-gallery-image ${escapeHtml(product.color)}" data-testid="detail-gallery-image"><span class="art-tag">${escapeHtml(product.tag)}</span><img class="product-photo" src="${escapeHtml(images[selectedIndex])}" alt="${escapeHtml(product.name)}${detailVariant ? `, ${escapeHtml(detailVariant)}` : ""}, fotografía ${selectedIndex + 1} de ${images.length}" fetchpriority="high" /></div>
    ${thumbnails}
  </div>`;
}

function renderProducts() {
  if (productLoadState === "loading") {
    document.querySelector("#productCount").textContent = "";
    productGrid.innerHTML = `<div class="no-results" role="status" data-testid="catalog-loading"><p>Cargando el catálogo…</p></div>`;
    return;
  }
  if (productLoadState === "error") {
    document.querySelector("#productCount").textContent = "Catálogo no disponible";
    productGrid.innerHTML = `<div class="no-results" role="alert" data-testid="catalog-error"><div><h3>No pudimos cargar el catálogo</h3><p>${escapeHtml(productLoadError)} Comprueba tu conexión e inténtalo de nuevo.</p><button class="category-filter" type="button" data-action="retry-products" data-testid="button-retry-products">Reintentar</button></div></div>`;
    return;
  }
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  const visible = products.filter((product) => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchesSearch = `${product.name} ${product.category} ${product.tag} ${product.originalPrice ? "oferta descuentos promoción" : ""}`.toLocaleLowerCase("es").includes(query);
    const matchesOffer = !offersOnly || Boolean(product.originalPrice);
    return matchesCategory && matchesSearch && matchesOffer;
  });
  document.querySelector("#productCount").textContent = `${visible.length} ${visible.length === 1 ? "producto" : "productos"}`;
  if (!visible.length) {
    productGrid.innerHTML = `<div class="no-results" data-testid="empty-search-results"><div><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><h3>No encontramos eso por aquí</h3><p>Prueba con otra palabra o vuelve a ver todo el catálogo.</p><button class="category-filter" type="button" data-action="clear-search" data-testid="button-clear-search">Ver todos los productos</button></div></div>`;
    return;
  }
  productGrid.innerHTML = visible.map((product) => `
    <article class="product-card" data-testid="card-product-${product.id}">
      <a class="product-art-link" href="#/product/${product.id}" data-route="/product/${product.id}" aria-label="Ver detalles de ${escapeHtml(product.name)}" data-testid="link-detail-image-${product.id}">
        <div class="product-art ${escapeHtml(product.color)}" aria-hidden="true">
          <span class="art-tag">${product.originalPrice ? `Oferta · ${escapeHtml(product.tag)}` : escapeHtml(product.tag)}</span>
          ${productVisual(product)}
        </div>
      </a>
      <div class="product-info">
        <div class="product-meta"><span>${escapeHtml(product.category)}</span><span class="rating">${Number(product.rating) > 0 ? `<i class="fa-solid fa-star" aria-hidden="true"></i>${escapeHtml(product.rating)}` : "Sin reseñas"}</span></div>
        <h3><a href="#/product/${product.id}" data-route="/product/${product.id}" data-testid="link-detail-${product.id}">${escapeHtml(product.name)}</a></h3>
        <div class="product-bottom"><span class="price-stack"><span class="price" data-testid="text-price-${product.id}">${money(product.price)}</span>${product.originalPrice ? `<del class="old-price">${money(product.originalPrice)}</del>` : ""}</span><a class="add-button" href="#/product/${product.id}" data-route="/product/${product.id}" aria-label="Ver detalles de ${escapeHtml(product.name)}" data-testid="button-detail-${product.id}"><span>Ver detalles</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
      </div>
    </article>`).join("");
}

let productLoadError = "";
async function loadProducts() {
  if (!apiConfigured) {
    productLoadState = "error";
    productLoadError = "El catálogo requiere una API configurada.";
    renderProducts();
    return;
  }
  productLoadState = "loading";
  renderProducts();
  try {
    const remoteProducts = await fetchProducts();
    products = remoteProducts.map((product) => ({
      ...product,
      rating: String(product.rating),
      originalPrice: product.originalPrice === null ? undefined : product.originalPrice
    }));
    products.forEach((product) => {
      productDetails[product.id] = {
        description: product.description,
        variants: product.variants
      };
    });
    productLoadState = "loaded";
    productLoadError = "";
  } catch (error) {
    productLoadState = "error";
    productLoadError = error instanceof Error ? error.message : "Error desconocido al cargar el catálogo.";
    console.error("No se pudo cargar el catálogo desde la API configurada.", error);
  }
  renderProducts();
  if (currentRoute.startsWith("/product/")) renderRoute();
}

function updateFilterControls() {
  categoryFilters.querySelectorAll("[data-category]").forEach((filter) => {
    const selected = filter.dataset.category === activeCategory;
    filter.classList.toggle("active", selected);
    filter.setAttribute("aria-pressed", String(selected));
  });
  offersFilterButton.classList.toggle("active", offersOnly);
  offersFilterButton.setAttribute("aria-pressed", String(offersOnly));
  document.querySelectorAll("[data-offers-only]").forEach((link) => {
    if (offersOnly) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function cartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderCart() {
  const count = cartCount();
  document.querySelector("#cartCount").textContent = String(count);
  document.querySelector("#cartItemsLabel").textContent = `${count} ${count === 1 ? "producto" : "productos"}`;
  const itemsNode = document.querySelector("#cartItems");
  const summary = document.querySelector("#cartSummary");
  if (!cart.length) {
    itemsNode.innerHTML = `<div class="cart-empty" data-testid="cart-empty-state"><div class="empty-icon"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i></div><h3>Tu carrito está tomando aire</h3><p>Todavía no has elegido tus esenciales. Hay un montón de ideas esperándote.</p><button type="button" data-action="browse" data-testid="button-browse-products">Explorar productos</button></div>`;
    summary.hidden = true;
    return;
  }
  summary.hidden = false;
  itemsNode.innerHTML = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    const variantKey = encodeURIComponent(item.variant || "");
    return `<article class="cart-row" data-testid="cart-item-${product.id}">
      <div class="cart-thumb ${escapeHtml(product.color)}" aria-hidden="true">${productVisual(product, item.variant)}</div>
      <div><p class="cart-product-name">${escapeHtml(product.name)}</p><span class="cart-product-price">${item.variant ? `${escapeHtml(item.variant)} · ` : ""}${money(product.price)} c/u</span>
        <div class="quantity-control" aria-label="Cantidad de ${escapeHtml(product.name)}">
          <button type="button" data-quantity="-1" data-id="${product.id}" data-variant="${variantKey}" aria-label="Restar una unidad de ${escapeHtml(product.name)}" data-testid="button-decrease-${product.id}">−</button>
          <span data-testid="text-quantity-${product.id}">${item.quantity}</span>
          <button type="button" data-quantity="1" data-id="${product.id}" data-variant="${variantKey}" aria-label="Añadir una unidad de ${escapeHtml(product.name)}" data-testid="button-increase-${product.id}">+</button>
        </div>
      </div>
      <div class="cart-row-end"><button class="remove-item" type="button" data-remove="${product.id}" data-variant="${variantKey}" aria-label="Eliminar ${escapeHtml(product.name)}" data-testid="button-remove-${product.id}"><i class="fa-regular fa-trash-can" aria-hidden="true"></i></button><span class="line-total">${money(product.price * item.quantity)}</span></div>
    </article>`;
  }).join("");
  const subtotal = cart.reduce((sum, item) => sum + products.find((product) => product.id === item.id).price * item.quantity, 0);
  document.querySelector("#cartSubtotal").textContent = money(subtotal);
}

function showToast(message, { type = "success", actionLabel = "", onAction = null, duration = 5000 } = {}) {
  pendingRemoval = null;
  document.querySelector("#toastMessage").textContent = message;
  const icon = document.querySelector("#toastIcon");
  const isError = type === "error";
  toast.dataset.type = type;
  toast.setAttribute("role", isError ? "alert" : "status");
  toast.setAttribute("aria-live", isError ? "assertive" : "polite");
  icon.className = `fa-solid ${isError ? "fa-circle-exclamation" : type === "warning" ? "fa-triangle-exclamation" : "fa-circle-check"}`;
  const action = document.querySelector("#toastAction");
  action.textContent = actionLabel;
  action.hidden = !actionLabel || typeof onAction !== "function";
  action.onclick = onAction;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), duration);
}

function showApiError(error, fallbackMessage) {
  if (error?.status === 401) {
    sessionModel.setUser(null);
    updateAccountControl();
    renderRoute();
    showToast("La sesión ya no está autorizada. Inicia sesión nuevamente para continuar.", {
      type: "error",
      actionLabel: "Iniciar sesión",
      onAction: () => navigate("/login"),
      duration: 8000
    });
    return;
  }
  showToast(error?.message || fallbackMessage, { type: "error" });
}

function setRemovalConfirmationOpen(open) {
  const modal = document.querySelector("#removeConfirm");
  const backdrop = document.querySelector("#removeConfirmBackdrop");
  if (open) bodyOverflowBeforeRemovalConfirmation = document.body.style.overflow;
  modal.hidden = !open;
  backdrop.hidden = !open;
  modal.inert = !open;
  modal.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : bodyOverflowBeforeRemovalConfirmation;
  if (open) {
    document.querySelector("#cancelRemove").focus();
    return;
  }
  if (focusBeforeRemovalConfirmation?.isConnected) focusBeforeRemovalConfirmation.focus();
  else if (cartDrawer.classList.contains("open")) document.querySelector("#cartClose").focus();
  else if (currentRoute === "/cart") routePage.focus({ preventScroll: true });
}

function confirmCartRemoval(productName) {
  document.querySelector("#removeConfirmMessage").textContent = `¿Quieres eliminar "${productName}" del carrito?`;
  focusBeforeRemovalConfirmation = document.activeElement;
  setRemovalConfirmationOpen(true);
  return new Promise((resolve) => {
    removalConfirmationResolve = resolve;
  });
}

function finishRemovalConfirmation(confirmed) {
  if (!removalConfirmationResolve) return;
  const resolve = removalConfirmationResolve;
  removalConfirmationResolve = null;
  setRemovalConfirmationOpen(false);
  resolve(confirmed);
}

async function removeCartItem(id, variant = "") {
  const index = cart.findIndex((item) => item.id === id && (item.variant || "") === variant);
  if (index < 0) return;
  const product = products.find((item) => item.id === id);
  if (!await confirmCartRemoval(product.name)) return;
  pendingRemoval = { item: cart[index], index };
  cart.splice(index, 1);
  renderCart();
  syncCart();
  if (currentRoute === "/cart") renderRoute();
  const action = document.querySelector("#toastAction");
  document.querySelector("#toastMessage").textContent = `${product.name} se eliminó del carrito.`;
  toast.dataset.type = "info";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.querySelector("#toastIcon").className = "fa-solid fa-circle-check";
  action.textContent = "Deshacer";
  action.hidden = false;
  action.onclick = () => {
    if (!pendingRemoval) return;
    cart.splice(Math.min(pendingRemoval.index, cart.length), 0, pendingRemoval.item);
    pendingRemoval = null;
    renderCart();
    syncCart();
    renderRoute();
    toast.classList.remove("show");
    clearTimeout(toastTimer);
  };
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    pendingRemoval = null;
  }, 8000);
}

document.querySelector("#cancelRemove").addEventListener("click", () => finishRemovalConfirmation(false));
document.querySelector("#confirmRemove").addEventListener("click", () => finishRemovalConfirmation(true));
document.querySelector("#removeConfirmBackdrop").addEventListener("click", () => finishRemovalConfirmation(false));

const routePage = document.querySelector("#routePage");
function updateAccountControl() {
  const account = document.querySelector("#accountOpen");
  const label = account.querySelector(".account-label");
  const signedIn = sessionModel.isSignedIn();
  label.textContent = signedIn ? "Mi cuenta" : "Iniciar sesión";
  account.setAttribute("aria-label", signedIn
    ? `Mi cuenta: ${sessionModel.getUser()?.name || sessionModel.getUser()?.email || "usuario"}`
    : "Iniciar sesión");
}

function navigate(path, replace = false) {
  const url = `${location.pathname}${location.search}#${path}`;
  if (replace) history.replaceState({}, "", url);
  else history.pushState({}, "", url);
  renderRoute();
}
function renderRoute() {
  const path = location.hash.startsWith("#/")
    ? location.hash.slice(1).replace(/\/+$/, "") || "/"
    : "/";
  const previousRoute = currentRoute;
  if (previousRoute === "/payment" && path !== "/payment") clearCheckoutData();
  if (previousRoute === "/login" && path !== "/login" && pendingAdd) pendingAdd = null;
  currentRoute = path;
  document.body.classList.toggle("page-route", path !== "/");
  routePage.hidden = path === "/" || path.startsWith("/payment");
  checkoutModal.classList.remove("open", "page-mode");
  checkoutBackdrop.classList.remove("open");
  checkoutModal.inert = true;
  checkoutModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (apiConfigured && path.startsWith("/product/") &&
      (productLoadState === "loading" || productLoadState === "error")) {
    routePage.hidden = false;
    document.title = "Ficha de producto — PichuPaper";
    routePage.innerHTML = productLoadState === "loading"
      ? `<div class="no-results" role="status"><p>Cargando el catálogo…</p></div>`
      : `<div class="no-results" role="alert"><div><h1>No pudimos cargar el producto</h1><p>${escapeHtml(productLoadError)} Comprueba tu conexión e inténtalo de nuevo.</p><button class="category-filter" type="button" data-action="retry-products">Reintentar</button></div></div>`;
    return;
  }
  if (path === "/") {
    document.title = "PichuPaper — Ideas que toman forma";
    window.scrollTo(0, 0);
    renderProducts();
    return;
  }
  if (path === "/cart") {
    document.title = "Tu carrito — PichuPaper";
    routePage.innerHTML = renderCartPage();
    routePage.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    return;
  }
  if (path === "/descargas") {
    document.title = "Descargas — PichuPaper";
    routePage.innerHTML = renderDownloadsPage();
    routePage.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    return;
  }
  if (path === "/contact") {
    document.title = "Contacto — PichuPaper";
    routePage.innerHTML = renderContactPage();
    routePage.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    return;
  }
  if (path === "/faq") {
    document.title = "Preguntas frecuentes — PichuPaper";
    routePage.innerHTML = renderFaqPage();
    routePage.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    return;
  }
  if (path === "/login") {
    document.title = "Iniciar sesión — PichuPaper";
    routePage.innerHTML = renderLoginPage(sessionModel.isSignedIn());
    routePage.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    return;
  }
  if (path === "/register") {
    document.title = "Crear cuenta — PichuPaper";
    routePage.innerHTML = renderRegisterPage(sessionModel.isSignedIn());
    routePage.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    return;
  }
  if (path.startsWith("/product/")) {
    const product = products.find((item) => item.id === path.split("/")[2]);
    if (!product) { navigate("/", true); return; }
    document.title = `${product.name} — PichuPaper`;
    detailQuantity = 1;
    detailVariant = productDetails[product.id].variants[0];
    detailImageIndex = 0;
    routePage.innerHTML = renderProductDetail(product);
    routePage.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    loadReviewsForProduct(product);
    return;
  }
  if (path === "/payment") {
    if (!cart.length) { navigate("/cart", true); return; }
    if (!sessionModel.isSignedIn()) {
      pendingCheckout = true;
      showToast("Inicia sesión para continuar con tu pedido.", { type: "warning" });
      navigate("/login", true);
      return;
    }
    document.title = "Completar pedido — PichuPaper";
    routePage.hidden = true;
    document.body.classList.add("page-route");
    checkoutModal.classList.add("open", "page-mode");
    checkoutModal.inert = false;
    checkoutModal.setAttribute("aria-hidden", "false");
    checkoutBackdrop.classList.remove("open");
    checkoutBackdrop.setAttribute("aria-hidden", "true");
    clearCheckoutData();
    const title = document.querySelector("#checkoutTitle");
    title.setAttribute("tabindex", "-1");
    title.focus({ preventScroll: true });
    return;
  }
  navigate("/", true);
}
function renderProductDetail(product) {
  const detail = productDetails[product.id];
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="#/" data-route="/">Inicio</a><span aria-hidden="true">/</span><a href="#catalogo" data-route="/">Catálogo</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHtml(product.name)}</span></nav>
    <section class="detail-layout" data-testid="product-detail-${product.id}">
      ${renderDetailVisual(product)}
      <div class="detail-copy"><span class="section-kicker">${escapeHtml(product.category)} · PichuPaper</span><h1>${escapeHtml(product.name)}</h1><div class="rating">${Number(product.rating) > 0 ? `<i class="fa-solid fa-star" aria-hidden="true"></i> ${escapeHtml(product.rating)} · valoración de clientes` : "Aún sin reseñas"}</div><p class="detail-description">${escapeHtml(detail.description)}</p><div class="detail-price">${money(product.price)}</div>
      <label class="detail-label" for="detailVariant">Formato o variante</label><select id="detailVariant" class="detail-select" data-testid="select-product-variant">${detail.variants.map((variant) => `<option>${escapeHtml(variant)}</option>`).join("")}</select>
      <div class="detail-buy"><div class="quantity-control detail-quantity"><button type="button" data-detail-quantity="-1" aria-label="Restar una unidad" data-testid="button-detail-decrease">−</button><span data-testid="text-detail-quantity">${detailQuantity}</span><button type="button" data-detail-quantity="1" aria-label="Añadir una unidad" data-testid="button-detail-increase">+</button></div><button class="button-primary" type="button" data-action="add-detail" data-testid="button-add-detail">Añadir al carrito <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i></button></div>
      <p class="detail-delivery"><i class="fa-solid fa-truck-fast" aria-hidden="true"></i> Entregas a coordinar en Ecuador. El costo se confirma antes de procesar el pedido.</p><button class="text-link" type="button" data-route="/cart" data-testid="button-detail-view-cart">Ver carrito <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></div>
    </section>${renderProductReviews(product)}`;
}

async function loadReviewsForProduct(product) {
  if (!apiConfigured) return;
  try {
    reviewsByProduct[product.id] = await fetchReviews(product.id);
    if (currentRoute === `/product/${product.id}`) {
      const currentReviews = routePage.querySelector(`[data-testid="product-reviews-${product.id}"]`);
      if (currentReviews) currentReviews.outerHTML = renderProductReviews(product);
    }
  } catch (error) {
    console.error("No se pudieron cargar las reseñas.", error);
    const list = routePage.querySelector(`[data-testid="review-list-${product.id}"]`);
    if (list) list.innerHTML = `<p class="reviews-empty" role="alert">No se pudieron cargar las reseñas. Inténtalo más tarde.</p>`;
  }
}
function renderCartPage() {
  const subtotal = cart.reduce((sum, item) => sum + products.find((product) => product.id === item.id).price * item.quantity, 0);
  if (!cart.length) {
    return `<nav class="breadcrumbs"><a href="#/" data-route="/">Inicio</a><span>/</span><span>Carrito</span></nav>
      <section class="page-heading"><span class="section-kicker">Tu selección</span><h1>Tu carrito</h1><p>Un espacio para reunir tus ideas favoritas.</p></section>
      <div class="cart-page-empty" data-testid="cart-empty-state"><div class="empty-icon"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i></div><h2>Tu carrito está tomando aire</h2><p>Todavía no has elegido tus esenciales. Hay un montón de ideas esperándote.</p><a class="button-primary" href="#catalogo" data-route="/">Explorar productos</a></div>
      <p class="detail-footnote" role="note">El total de envío se confirma antes de procesar el pedido.</p>`;
  }

  const rows = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    const variant = item.variant || productDetails[product.id].variants[0];
    const variantKey = encodeURIComponent(item.variant || "");
    const testKey = `${product.id}-${variantKey || "default"}`;
    return `<article class="cart-page-row" data-testid="cart-item-${testKey}">
      <div class="cart-thumb ${product.color}" aria-hidden="true">${productVisual(product, item.variant)}</div>
      <div class="cart-page-info">
        <a href="#/product/${product.id}" data-route="/product/${product.id}" class="cart-product-name">${escapeHtml(product.name)}</a>
        <span class="cart-product-price">${escapeHtml(variant)} · ${money(product.price)} c/u</span>
        <div class="quantity-control" aria-label="Cantidad de ${escapeHtml(product.name)}">
          <button type="button" data-quantity="-1" data-id="${product.id}" data-variant="${variantKey}" aria-label="Restar una unidad de ${escapeHtml(product.name)}" data-testid="button-decrease-${testKey}">−</button>
          <span data-testid="text-quantity-${testKey}">${item.quantity}</span>
          <button type="button" data-quantity="1" data-id="${product.id}" data-variant="${variantKey}" aria-label="Añadir una unidad de ${escapeHtml(product.name)}" data-testid="button-increase-${testKey}">+</button>
        </div>
      </div>
      <div class="cart-page-end"><strong>${money(product.price * item.quantity)}</strong><button class="remove-item" type="button" data-remove="${product.id}" data-variant="${variantKey}" aria-label="Eliminar ${escapeHtml(product.name)}" data-testid="button-remove-${testKey}">Eliminar</button></div>
    </article>`;
  }).join("");

  return `<nav class="breadcrumbs"><a href="#/" data-route="/">Inicio</a><span>/</span><span aria-current="page">Carrito</span></nav>
    <section class="page-heading"><span class="section-kicker">Tu selección</span><h1>Tu carrito</h1><p>${cartCount()} ${cartCount() === 1 ? "artículo listo" : "artículos listos"} para revisar.</p></section>
    <div class="cart-page-layout"><div class="cart-page-items" data-testid="cart-page-items">${rows}</div>
      <aside class="cart-page-summary"><h2>Resumen</h2><div class="subtotal-line"><span>Subtotal</span><strong data-testid="text-cart-subtotal">${money(subtotal)}</strong></div>
        <p class="shipping-note">El costo de envío se confirma antes de procesar el pedido.</p>
        <button class="checkout-button" type="button" data-action="go-payment" data-testid="button-checkout"><i class="fa-solid fa-lock" aria-hidden="true"></i> Continuar con el pedido</button>
        <p class="demo-note">El envío y el pago se coordinan después de registrar el pedido.</p><a href="#catalogo" class="continue-shopping" data-route="/">Seguir viendo productos</a>
      </aside>
    </div><p class="detail-footnote" role="note">El pedido queda pendiente hasta que el equipo confirme el pago y el costo de envío.</p>`;
}

function renderDownloadsPage() {
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="#/" data-route="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Descargas</span></nav>
    <section class="page-heading"><span class="section-kicker">Archivos de la tienda</span><h1>Descargas</h1><p>Descarga una copia de los archivos activos de PichuPaper.</p></section>
    <section class="downloads-card" data-testid="downloads-page">
      <div class="downloads-card-heading"><span class="downloads-icon"><i class="fa-solid fa-file-zipper" aria-hidden="true"></i></span><div><h2>Código fuente del e-commerce</h2><p>Un ZIP con la tienda y un servidor local para ejecutarla.</p></div></div>
      <ul class="downloads-file-list">
        <li><code>index.html</code><span>Estructura y contenido</span></li>
        <li><code>style.css</code><span>Diseño adaptable</span></li>
        <li><code>app.js</code><span>Catálogo, carrito y pedidos</span></li>
        <li><span class="downloads-file-names"><code>favicon.svg</code><code>robots.txt</code></span><span>Recursos del sitio</span></li>
        <li><span class="downloads-file-names"><code>server.mjs</code><code>README.md</code><code>package.json</code></span><span>Servidor local e instrucciones</span></li>
        <li><span class="downloads-file-names"><code>api/</code><code>database/</code><code>DEPLOY.md</code></span><span>API y preparación de base de datos</span></li>
      </ul>
      <a class="button-primary downloads-button" href="https://github.com/KiddoMaki/ECOMERCE-IHC/archive/refs/heads/main.zip" target="_blank" rel="noopener noreferrer" data-testid="link-download-source"><i class="fa-solid fa-download" aria-hidden="true"></i> Descargar código fuente (.zip)</a>
      <p class="downloads-note">El archivo se obtiene desde GitHub y no incluye dependencias instaladas. Requiere Node.js 20.19 o posterior para ejecutar la aplicación y el API.</p>
      <p class="detail-footnote" role="note">Los pedidos permanecen pendientes hasta coordinar el pago y la entrega. Las fuentes e iconos se cargan desde sus CDN.</p>
    </section>`;
}

function addToCart(productId, quantity = 1, variant = "") {
  const selectedVariant = variant || productDetails[productId]?.variants[0] || "";
  const found = cart.find((item) => item.id === productId && item.variant === selectedVariant);
  if (found) found.quantity += quantity;
  else cart.push({ id: productId, quantity, variant: selectedVariant });
  renderCart();
  syncCart();
  const product = products.find((entry) => entry.id === productId);
  showToast(`${product.name} se añadió a tu carrito.`, {
    actionLabel: "Ver carrito",
    onAction: () => setCartOpen(true)
  });
}

const authController = createAuthController(() => {
  updateAccountControl();
  if (pendingCheckout) {
    pendingCheckout = false;
    navigate("/payment");
    return;
  }
  if (pendingAdd) {
    const queuedAdd = pendingAdd;
    pendingAdd = null;
    addToCart(queuedAdd.productId, queuedAdd.quantity, queuedAdd.variant);
    navigate("/cart");
    return;
  }
  navigate("/");
  showToast("Sesión iniciada.");
});

function setCartOpen(open) {
  if (open) focusBeforeCart = document.activeElement;
  cartDrawer.classList.toggle("open", open);
  cartBackdrop.classList.toggle("open", open);
  cartDrawer.setAttribute("aria-hidden", String(!open));
  cartDrawer.inert = !open;
  cartBackdrop.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
  if (open) document.querySelector("#cartClose").focus();
  else if (focusBeforeCart && typeof focusBeforeCart.focus === "function") focusBeforeCart.focus();
}

function setDetailImage(index) {
  const productId = currentRoute.split("/")[2];
  const product = products.find((item) => item.id === productId);
  const image = product?.images?.[index];
  if (!product || !image) return;
  detailImageIndex = index;
  const mainImage = routePage.querySelector(".detail-gallery-image .product-photo");
  if (mainImage) {
    mainImage.src = image;
    mainImage.alt = `${product.name}${detailVariant ? `, ${detailVariant}` : ""}, fotografía ${index + 1} de ${product.images.length}`;
  }
  routePage.querySelectorAll("[data-detail-image]").forEach((button) => {
    const selected = Number(button.dataset.detailImage) === index;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  if (product.variantImageGroups) {
    const variantIndex = product.variantImageGroups.findIndex((group) => group.includes(index));
    const variantSelect = routePage.querySelector("#detailVariant");
    if (variantIndex >= 0) {
      detailVariant = productDetails[product.id].variants[variantIndex];
      if (variantSelect) variantSelect.selectedIndex = variantIndex;
    }
  }
}

// Filtros y búsqueda comparten el mismo render para combinarse sin resultados inconsistentes.
categoryFilters.addEventListener("click", (event) => {
  const categoryButton = event.target.closest("[data-category]");
  const offerButton = event.target.closest("[data-offers-toggle]");
  if (categoryButton) activeCategory = categoryButton.dataset.category;
  else if (offerButton) offersOnly = !offersOnly;
  else return;
  updateFilterControls();
  renderProducts();
});
searchInput.addEventListener("input", () => {
  if (currentRoute !== "/") navigate("/", true);
  renderProducts();
});
document.querySelectorAll("[data-offers-only]").forEach((link) => {
  link.addEventListener("click", () => {
    offersOnly = !offersOnly;
    if (offersOnly) searchInput.value = "";
    updateFilterControls();
    renderProducts();
  });
});
productGrid.addEventListener("click", (event) => {
  if (event.target.closest('[data-action="retry-products"]')) {
    loadProducts();
    return;
  }
  const routeLink = event.target.closest("[data-route]");
  if (routeLink) { event.preventDefault(); navigate(routeLink.dataset.route); return; }
  const clearButton = event.target.closest('[data-action="clear-search"]');
  if (clearButton) {
    activeCategory = "Todos";
    offersOnly = false;
    searchInput.value = "";
    updateFilterControls();
    renderProducts();
    return;
  }
});

document.querySelector("#cartOpen").addEventListener("click", () => navigate("/cart"));
document.querySelector("#cartClose").addEventListener("click", () => setCartOpen(false));
cartBackdrop.addEventListener("click", () => setCartOpen(false));
document.querySelector("#cartItems").addEventListener("click", (event) => {
  const browse = event.target.closest('[data-action="browse"]');
  if (browse) {
    setCartOpen(false);
    document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
    return;
  }
  const remove = event.target.closest("[data-remove]");
  if (remove) {
    removeCartItem(remove.dataset.remove, decodeURIComponent(remove.dataset.variant || ""));
    return;
  }
  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    const item = cart.find((entry) => entry.id === quantityButton.dataset.id && (entry.variant || "") === decodeURIComponent(quantityButton.dataset.variant || ""));
    if (!item) return;
    item.quantity += Number(quantityButton.dataset.quantity);
    if (item.quantity < 1) cart = cart.filter((entry) => entry.id !== item.id);
    renderCart();
  }
});
const checkoutModal = document.querySelector("#checkoutModal");
const checkoutBackdrop = document.querySelector("#checkoutBackdrop");
const checkoutForm = document.querySelector("#checkoutForm");
const checkoutError = document.querySelector("#checkoutError");
const checkoutSteps = [...checkoutModal.querySelectorAll(".checkout-step[data-step]")];
const checkoutProgress = [...checkoutModal.querySelectorAll(".progress-step")];
let validatedPaymentMethod = null;

function clearFieldErrors() {
  checkoutModal.querySelectorAll(".field-error").forEach((node) => { node.textContent = ""; });
  checkoutModal.querySelectorAll("[aria-invalid='true']").forEach((node) => node.removeAttribute("aria-invalid"));
  checkoutError.hidden = true;
  checkoutError.textContent = "";
}

function clearPaymentInputs() {
  ["demoCardNumber", "demoCardExpiry", "demoCardCvv", "demoAccountNumber"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.querySelector("#demoAccountType").value = "";
}

function updatePaymentPanels() {
  const isCard = selectedPayment() === "card";
  document.querySelector("#cardPaymentFields").hidden = !isCard;
  document.querySelector("#transferPaymentFields").hidden = isCard;
}

function setFieldError(id, message) {
  const input = document.getElementById(id);
  const error = checkoutModal.querySelector(`[data-error-for="${id}"]`);
  if (input) input.setAttribute("aria-invalid", "true");
  if (error) error.textContent = message;
}

function setCheckoutStep(step) {
  checkoutStep = step;
  checkoutSteps.forEach((section) => { section.hidden = Number(section.dataset.step) !== step; });
  checkoutProgress.forEach((node) => {
    const number = Number(node.dataset.progress);
    node.classList.toggle("active", number === step);
    node.classList.toggle("done", number < step);
  });
  clearFieldErrors();
  const section = checkoutModal.querySelector(`[data-step="${step}"]`);
  const first = section.querySelector("input, select") || section.querySelector("h3");
  if (first.tagName === "H3") first.setAttribute("tabindex", "-1");
  if (first) first.focus({ preventScroll: true });
}

function clearCheckoutData() {
  checkoutContact = null;
  validatedPaymentMethod = null;
  checkoutForm.reset();
  clearPaymentInputs();
  updatePaymentPanels();
  document.querySelector("#paymentNotice").innerHTML =
    '<i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>Se comprueba el formato de la tarjeta; no se realizará ningún cobro.</span>';
  document.querySelector("#otherProvinceField").hidden = true;
  document.querySelector("#shippingProvinceOther").required = false;
  document.querySelector("#shippingProvinceOther").value = "";
  checkoutForm.hidden = false;
  const signedInEmail = sessionModel.getUser()?.email || "";
  document.querySelector("#shippingEmail").value = signedInEmail;
  checkoutModal.querySelector('[data-step="success"]').hidden = true;
  setCheckoutStep(1);
}

function setCheckoutOpen(open) {
  if (open) {
    checkoutReturnFocus = cartDrawer.classList.contains("open") ? document.querySelector("#cartOpen") : document.activeElement;
    setCartOpen(false);
    clearCheckoutData();
  }
  checkoutModal.classList.toggle("open", open);
  checkoutBackdrop.classList.toggle("open", open);
  checkoutModal.setAttribute("aria-hidden", String(!open));
  checkoutModal.inert = !open;
  checkoutBackdrop.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
  if (open) {
    const heading = document.querySelector("#checkoutTitle");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  } else {
    clearCheckoutData();
    if (checkoutReturnFocus && typeof checkoutReturnFocus.focus === "function") checkoutReturnFocus.focus();
  }
}

function validateContact() {
  clearFieldErrors();
  const name = document.querySelector("#shippingName").value.trim();
  const email = document.querySelector("#shippingEmail").value.trim();
  const phone = document.querySelector("#shippingPhone").value.trim();
  const provinceSelect = document.querySelector("#shippingProvince");
  const provinceOther = document.querySelector("#shippingProvinceOther").value.trim();
  const province = provinceSelect.value === "Otra provincia" ? provinceOther : provinceSelect.value;
  const city = document.querySelector("#shippingCity").value.trim();
  const address = document.querySelector("#shippingAddress").value.trim();
  let valid = true;
  if (name.length < 2 || name.length > 80) { setFieldError("shippingName", "Escribe un nombre de 2 a 80 caracteres."); valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError("shippingEmail", "Ingresa un correo con formato válido."); valid = false; }
  if (phone.length > 16 || !/^(09\d{8}|\+5939\d{8}|5939\d{8})$/.test(phone.replace(/[\s()-]/g, ""))) { setFieldError("shippingPhone", "Ingresa 10 dígitos (09...) o el formato internacional +5939XXXXXXXX."); valid = false; }
  if (!provinceSelect.value) { setFieldError("shippingProvince", "Selecciona una provincia."); valid = false; }
  else if (provinceSelect.value === "Otra provincia") {
    const normalizedProvince = provinceOther.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    if (!/^[A-Z][A-Za-z\s'-]{1,39}$/.test(normalizedProvince)) {
      setFieldError("shippingProvinceOther", "Escribe una provincia con letras; debe iniciar con mayúscula y tener hasta 40 caracteres.");
      valid = false;
    }
  }
  if (city.length < 2 || city.length > 60) { setFieldError("shippingCity", "Ingresa una ciudad de 2 a 60 caracteres."); valid = false; }
  if (address.length < 5) { setFieldError("shippingAddress", "Ingresa una dirección (mínimo 5 caracteres)."); valid = false; }
  if (valid) checkoutContact = { name, email, phone, province, city, address };
  else {
    checkoutError.textContent = "Revisa los campos marcados para continuar.";
    checkoutError.hidden = false;
    checkoutModal.querySelector("[aria-invalid='true']")?.focus();
  }
  return valid;
}

function selectedPayment() {
  return checkoutForm.querySelector('input[name="paymentMethod"]:checked').value;
}

function validatePayment() {
  clearFieldErrors();
  const method = selectedPayment();
  if (validatedPaymentMethod === method) return true;

  let valid = true;
  if (method === "card") {
    const number = document.querySelector("#demoCardNumber").value;
    const expiry = document.querySelector("#demoCardExpiry").value;
    const cvv = document.querySelector("#demoCardCvv").value;
    const digits = number.replace(/\s/g, "");
    const expiryMatch = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry);
    if (!/^\d{16}$/.test(digits)) { setFieldError("demoCardNumber", "Ingresa 16 dígitos en cuatro grupos de cuatro."); valid = false; }
    if (!expiryMatch) {
      setFieldError("demoCardExpiry", "Usa el formato MM/AA con un mes entre 01 y 12."); valid = false;
    } else {
      const month = Number(expiryMatch[1]);
      const year = 2000 + Number(expiryMatch[2]);
      const now = new Date();
      if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
        setFieldError("demoCardExpiry", "La fecha de vencimiento debe ser actual o futura."); valid = false;
      }
    }
    if (!/^\d{3}$/.test(cvv)) { setFieldError("demoCardCvv", "El CVV debe tener exactamente 3 dígitos."); valid = false; }
  } else {
    const accountType = document.querySelector("#demoAccountType").value;
    const accountNumber = document.querySelector("#demoAccountNumber").value;
    if (!["savings", "checking"].includes(accountType)) { setFieldError("demoAccountType", "Selecciona ahorros o corriente."); valid = false; }
    if (!/^\d{10,20}$/.test(accountNumber)) { setFieldError("demoAccountNumber", "Ingresa únicamente de 10 a 20 dígitos."); valid = false; }
  }

  if (!valid) {
    checkoutError.textContent = "Revisa los datos del método de pago seleccionado.";
    checkoutError.hidden = false;
    checkoutModal.querySelector("[aria-invalid='true']")?.focus();
    return false;
  }

  validatedPaymentMethod = method;
  clearPaymentInputs();
  return true;
}

function renderReview() {
  const contact = checkoutContact;
  document.querySelector("#reviewContact").textContent = `${contact.name}\n${contact.email} · ${contact.phone}\n${contact.address}\n${contact.city}, ${contact.province}`;
  document.querySelector("#reviewPayment").textContent = selectedPayment() === "card"
    ? "Tarjeta (formato validado; pago pendiente, sin cobro)"
    : "Transferencia (formato de cuenta validado; pago pendiente)";
  const rows = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    const variant = item.variant ? ` · ${item.variant}` : "";
    return `<div class="review-item"><span>${escapeHtml(product.name)}${escapeHtml(variant)} × ${item.quantity}</span><strong>${money(product.price * item.quantity)}</strong></div>`;
  }).join("");
  document.querySelector("#reviewItems").innerHTML = rows;
  const subtotal = cart.reduce((sum, item) => sum + products.find((product) => product.id === item.id).price * item.quantity, 0);
  document.querySelector("#reviewSubtotal").textContent = money(subtotal);
  document.querySelector("#reviewTotal").textContent = money(subtotal);
}

function renderSuccessConfirmation(order) {
  const province = checkoutContact?.province || "";
  const city = checkoutContact?.city || "";
  document.querySelector("#successHeading").textContent = "Tu pedido está pendiente";
  document.querySelector("#successLead").textContent = "El pedido se guardó correctamente. El pago y el envío todavía no están confirmados.";
  document.querySelector("#successOrderNumber").textContent = `PP-${order.orderId}`;
  document.querySelector("#successPaymentTitle").textContent = "Pago pendiente";
  document.querySelector("#successPaymentDescription").textContent = "No se realizó ningún cobro; espera la coordinación del equipo.";
  document.querySelector("#successPaymentBadge").textContent = "Pendiente";
  document.querySelector("#successShippingDescription").textContent = `Destino: ${city}, ${province}. Costo de envío por coordinar.`;
  document.querySelector("#successOrderItems").innerHTML = order.items.map((item) => {
    return `<div class="success-order-item"><span>${escapeHtml(item.productName)} · ${escapeHtml(item.variantName)} × ${item.quantity}</span><strong>${money(Number(item.unitPrice) * item.quantity)}</strong></div>`;
  }).join("");
  document.querySelector("#successOrderTotal").textContent = money(Number(order.total));
}

async function submitOrder(button) {
  if (!checkoutContact && !validateContact()) return;
  const items = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    const variantIndex = productDetails[item.id]?.variants.indexOf(item.variant) ?? -1;
    return {
      productId: item.id,
      variantSku: product?.variantSkus?.[variantIndex],
      quantity: item.quantity
    };
  });
  if (items.some((item) => !item.variantSku)) {
    checkoutError.textContent = "No se pudo identificar una variante del carrito. Vuelve al catálogo y selecciona el producto nuevamente.";
    checkoutError.hidden = false;
    return;
  }

  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  checkoutError.hidden = true;
  try {
    const order = await createOrder({
      items,
      shipping: {
        name: checkoutContact.name,
        phone: checkoutContact.phone,
        province: checkoutContact.province,
        city: checkoutContact.city,
        address: checkoutContact.address
      },
      paymentMethod: selectedPayment()
    });
    renderSuccessConfirmation(order);
    cart = [];
    renderCart();
    checkoutForm.hidden = true;
    checkoutModal.querySelector('[data-step="success"]').hidden = false;
    checkoutProgress.forEach((node) => { node.classList.add("done"); node.classList.remove("active"); });
    const successHeading = checkoutModal.querySelector("#successHeading");
    successHeading.setAttribute("tabindex", "-1");
    successHeading.focus({ preventScroll: true });
  } catch (error) {
    if (error?.status === 401) {
      showApiError(error, "No se pudo registrar el pedido.");
      return;
    }
    checkoutError.textContent = error.message || "No se pudo registrar el pedido.";
    checkoutError.hidden = false;
    checkoutError.focus?.();
  } finally {
    button.disabled = false;
    button.removeAttribute("aria-busy");
  }
}

document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) return;
  if (!sessionModel.isSignedIn()) {
    pendingCheckout = true;
    showToast("Inicia sesión para continuar con tu pedido.", { type: "warning" });
    navigate("/login");
    return;
  }
  navigate("/payment");
});
document.querySelector("#checkoutClose").addEventListener("click", () => navigate("/cart"));
checkoutBackdrop.addEventListener("click", () => navigate("/cart"));
routePage.addEventListener("click", (event) => {
  if (event.target.closest('[data-action="retry-products"]')) {
    loadProducts();
    return;
  }
  const routeLink = event.target.closest("[data-route]");
  if (routeLink) {
    event.preventDefault();
    const targetHash = routeLink.matches("a[href]") ? new URL(routeLink.href).hash : "";
    navigate(routeLink.dataset.route);
    if (targetHash && !targetHash.startsWith("#/")) {
      requestAnimationFrame(() => document.querySelector(targetHash)?.scrollIntoView({ behavior: "smooth" }));
    }
    return;
  }
  const detailQty = event.target.closest("[data-detail-quantity]");
  if (detailQty) {
    detailQuantity = Math.max(1, detailQuantity + Number(detailQty.dataset.detailQuantity));
    const quantityNode = routePage.querySelector('[data-testid="text-detail-quantity"]');
    if (quantityNode) quantityNode.textContent = String(detailQuantity);
    return;
  }
  const detailImageButton = event.target.closest("[data-detail-image]");
  if (detailImageButton) {
    setDetailImage(Number(detailImageButton.dataset.detailImage));
    return;
  }
  if (event.target.closest('[data-action="add-detail"]')) {
    const id = currentRoute.split("/")[2];
    detailVariant = routePage.querySelector("#detailVariant").value;
    if (!sessionModel.isSignedIn()) {
      pendingAdd = { productId: id, quantity: detailQuantity, variant: detailVariant };
      showToast("Inicia sesión para añadir este producto al carrito.", { type: "warning" });
      navigate("/login");
      return;
    }
    addToCart(id, detailQuantity, detailVariant);
    navigate("/cart");
    return;
  }
  if (event.target.closest('[data-action="sign-out"]')) {
    authController.signOut().then(() => {
      pendingAdd = null;
      pendingCheckout = false;
      updateAccountControl();
      renderRoute();
      showToast("Sesión cerrada.");
    }).catch((error) => showToast(error.message, { type: "error" }));
    return;
  }
  if (event.target.closest('[data-action="go-payment"]')) {
    if (cart.length) navigate("/payment");
    return;
  }
  const remove = event.target.closest("[data-remove]");
  if (remove) {
    removeCartItem(remove.dataset.remove, decodeURIComponent(remove.dataset.variant || ""));
    return;
  }
  const qty = event.target.closest("[data-quantity]");
  if (qty) {
    const item = cart.find((entry) => entry.id === qty.dataset.id && (entry.variant || "") === decodeURIComponent(qty.dataset.variant || ""));
    if (!item) return;
    item.quantity += Number(qty.dataset.quantity);
    if (item.quantity < 1) cart = cart.filter((entry) => entry !== item);
    renderCart();
    syncCart();
    renderRoute();
  }
});
routePage.addEventListener("change", (event) => {
  if (event.target.id !== "detailVariant") return;
  const productId = currentRoute.split("/")[2];
  const product = products.find((item) => item.id === productId);
  detailVariant = event.target.value;
  if (!product) return;
  if (product.variantImageGroups) {
    const imageIndex = product.variantImageGroups[event.target.selectedIndex]?.[0];
    if (imageIndex !== undefined) detailImageIndex = imageIndex;
  }
  const gallery = routePage.querySelector(".product-gallery");
  if (gallery) gallery.outerHTML = renderDetailVisual(product);
});
routePage.addEventListener("input", (event) => {
  if (event.target.matches('[name="review-comment"]')) event.target.setCustomValidity("");
});
routePage.addEventListener("submit", (event) => {
  const loginForm = event.target.closest("[data-login-form]");
  if (loginForm) {
    event.preventDefault();
    const message = loginForm.querySelector("[data-auth-message]");
    const button = loginForm.querySelector('[type="submit"]');
    button.disabled = true;
    message.textContent = "";
    authController.signIn(loginForm).catch((error) => {
      message.textContent = error.message;
      message.setAttribute("role", "alert");
    }).finally(() => { button.disabled = false; });
    return;
  }
  const registerForm = event.target.closest("[data-register-form]");
  if (registerForm) {
    event.preventDefault();
    const message = registerForm.querySelector("[data-auth-message]");
    const button = registerForm.querySelector('[type="submit"]');
    button.disabled = true;
    message.textContent = "";
    authController.signUp(registerForm).then((signedIn) => {
      if (!signedIn) {
        showToast("Cuenta creada. Revisa tu correo para verificarla y luego inicia sesión.");
        navigate("/login");
      }
    }).catch((error) => {
      message.textContent = error.message;
      message.setAttribute("role", "alert");
    }).finally(() => { button.disabled = false; });
    return;
  }
  const form = event.target.closest("[data-review-form]");
  if (!form) return;
  event.preventDefault();
  if (!sessionModel.isSignedIn()) {
    navigate("/login");
    return;
  }
  if (!form.reportValidity()) return;
  const commentInput = form.elements.namedItem("review-comment");
  const comment = commentInput.value.trim();
  const productId = form.dataset.productId;
  const rating = Number(new FormData(form).get("review-rating"));
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  reviewsByProduct[productId] ||= [];
  createReview(productId, { rating, comment }).then(async () => {
    let refreshFailed = false;
    try {
      reviewsByProduct[productId] = await fetchReviews(productId);
    } catch (error) {
      refreshFailed = true;
      console.error("La reseña se guardó, pero no se pudo actualizar la lista.", error);
    }
    const product = products.find((item) => item.id === productId);
    if (product && reviewsByProduct[productId].length) {
      product.rating = String(reviewsByProduct[productId]
        .reduce((sum, review) => sum + review.rating, 0) / reviewsByProduct[productId].length);
    }
    renderRoute();
    showToast(refreshFailed
      ? "Tu reseña se guardó, pero no se pudo actualizar la lista. Recarga la página para verla."
      : "Tu reseña se guardó correctamente.", { type: refreshFailed ? "warning" : "success" });
  }).catch((error) => {
    showApiError(error, "No se pudo publicar la reseña.");
  }).finally(() => { button.disabled = false; });
});
checkoutModal.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "to-payment") {
    if (checkoutStep === 1 && !validateContact()) return;
    setCheckoutStep(2);
  } else if (action === "to-delivery" || action === "edit-delivery") {
    setCheckoutStep(1);
  } else if (action === "to-review") {
    if (!validatePayment()) return;
    renderReview();
    setCheckoutStep(3);
  } else if (action === "edit-payment" || action === "back-to-payment") {
    setCheckoutStep(2);
  } else if (action === "finish-order") {
    submitOrder(event.target.closest("button"));
  } else if (action === "reset-order") {
    cart = [];
    renderCart();
    navigate("/");
  }
});
checkoutForm.addEventListener("change", (event) => {
  if (event.target.id === "shippingProvince") {
    const isOther = event.target.value === "Otra provincia";
    const otherProvinceField = document.querySelector("#otherProvinceField");
    const otherProvinceInput = document.querySelector("#shippingProvinceOther");
    otherProvinceField.hidden = !isOther;
    otherProvinceInput.required = isOther;
    if (!isOther) {
      otherProvinceInput.value = "";
      otherProvinceInput.removeAttribute("aria-invalid");
      otherProvinceField.querySelector(".field-error").textContent = "";
    } else {
      otherProvinceInput.focus();
    }
    return;
  }
  if (event.target.name === "paymentMethod") {
    validatedPaymentMethod = null;
    clearPaymentInputs();
    clearFieldErrors();
    updatePaymentPanels();
    document.querySelector("#paymentNotice").innerHTML = selectedPayment() === "card"
      ? '<i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>Se comprueba el formato de la tarjeta; no se realizará ningún cobro.</span>'
      : '<i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>Se comprueba el formato del número; no se consulta la cuenta ni se realiza una transferencia.</span>';
    return;
  }
  if (event.target.id === "demoAccountType") {
    validatedPaymentMethod = null;
    event.target.removeAttribute("aria-invalid");
    checkoutModal.querySelector('[data-error-for="demoAccountType"]').textContent = "";
    checkoutError.hidden = true;
  }
});
checkoutForm.addEventListener("input", (event) => {
  const input = event.target;
  const formatters = {
    demoCardNumber: (value) => value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "),
    demoCardExpiry: (value) => {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    },
    demoCardCvv: (value) => value.replace(/\D/g, "").slice(0, 3),
    demoAccountNumber: (value) => value.replace(/\D/g, "").slice(0, 20)
  };
  if (formatters[input.id]) {
    input.value = formatters[input.id](input.value);
    validatedPaymentMethod = null;
  }
  if (input.name === "paymentMethod") {
    validatedPaymentMethod = null;
    checkoutError.hidden = true;
    checkoutError.textContent = "";
  }
  const fieldError = checkoutModal.querySelector(`[data-error-for="${input.id}"]`);
  if (fieldError) {
    input.removeAttribute("aria-invalid");
    fieldError.textContent = "";
    checkoutError.hidden = true;
    checkoutError.textContent = "";
  }
});
document.querySelector("#shippingProvinceOther").addEventListener("input", (event) => {
  const input = event.target;
  const value = input.value;
  input.value = value ? value[0].toLocaleUpperCase("es") + value.slice(1) : "";
});
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (checkoutStep === 1 && validateContact()) setCheckoutStep(2);
  else if (checkoutStep === 2 && validatePayment()) {
    renderReview();
    setCheckoutStep(3);
  }
});

// Navegación pequeña para móvil y búsqueda expandible en pantallas estrechas.
const menuToggle = document.querySelector("#menuToggle");
const mobileNav = document.querySelector("#mobileNav");
menuToggle.addEventListener("click", () => {
  const opened = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(opened));
  mobileNav.classList.toggle("open", opened);
  menuToggle.setAttribute("aria-label", opened ? "Cerrar menú" : "Abrir menú");
  menuToggle.innerHTML = `<i class="fa-solid ${opened ? "fa-xmark" : "fa-bars"}" aria-hidden="true"></i>`;
});
mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  }
});
document.querySelector(".site-header").addEventListener("click", (event) => {
  const routeLink = event.target.closest("a[data-route]");
  if (!routeLink) return;
  event.preventDefault();
  navigate(routeLink.dataset.route);
});
document.querySelector(".site-footer").addEventListener("click", (event) => {
  const routeLink = event.target.closest("a[data-route]");
  if (!routeLink) return;
  event.preventDefault();
  navigate(routeLink.dataset.route);
});
const searchToggle = document.querySelector("#searchToggle");
searchToggle.addEventListener("click", () => {
  const opened = document.querySelector("#searchWrap").classList.toggle("is-open");
  searchToggle.setAttribute("aria-expanded", String(opened));
  if (opened) searchInput.focus();
});

document.querySelector("#year").textContent = new Date().getFullYear();
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!document.querySelector("#removeConfirm").hidden) finishRemovalConfirmation(false);
    else if (checkoutModal.classList.contains("open")) navigate("/cart");
    else if (cartDrawer.classList.contains("open")) setCartOpen(false);
    if (mobileNav.classList.contains("open")) {
      mobileNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    }
  }
  // Mantener el foco dentro del diálogo mientras el carrito está abierto.
  if (event.key === "Tab" && cartDrawer.classList.contains("open")) {
    const focusable = [...cartDrawer.querySelectorAll("button:not(:disabled), a[href], input:not(:disabled)")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  if (event.key === "Tab" && checkoutModal.classList.contains("open")) {
    const focusable = [...checkoutModal.querySelectorAll("button:not(:disabled):not([hidden]), input:not(:disabled):not([hidden]), select:not(:disabled):not([hidden])")]
      .filter((node) => !node.closest("[hidden]") && !node.closest("[inert]"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (first && event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (last && !event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  if (event.key === "Tab" && !document.querySelector("#removeConfirm").hidden) {
    const focusable = [...document.querySelector("#removeConfirm").querySelectorAll("button:not(:disabled)")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

document.addEventListener("click", (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor || anchor.hasAttribute("data-route")) return;
  if (currentRoute !== "/") {
    event.preventDefault();
    const target = anchor.getAttribute("href");
    navigate("/");
    requestAnimationFrame(() => document.querySelector(target)?.scrollIntoView({ behavior: "smooth" }));
  }
});
window.addEventListener("popstate", renderRoute);
updateAccountControl();
const productsReady = loadProducts();
renderCart();
renderRoute();
authController.restoreSession().then(async () => {
  updateAccountControl();
  if (sessionModel.isSignedIn() && apiConfigured) {
    await productsReady;
    if (productLoadState === "loaded") {
      try {
        const savedItems = await fetchCart();
        cart = savedItems.flatMap((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          const variantIndex = product?.variantSkus?.indexOf(item.variantSku) ?? -1;
          return variantIndex < 0
            ? []
            : [{ id: item.productId, variant: productDetails[item.productId].variants[variantIndex], quantity: item.quantity }];
        });
        renderCart();
        if (currentRoute === "/cart") renderRoute();
      } catch (error) {
        console.error("No se pudo restaurar el carrito de la cuenta.", error);
        showApiError(error, "No se pudo cargar el carrito guardado.");
      }
    }
  }
  if (currentRoute === "/login" || currentRoute === "/register") renderRoute();
}).catch((error) => {
  sessionModel.setUser(null);
  updateAccountControl();
  console.error("No se pudo recuperar la sesión de usuario.", error);
});