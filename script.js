/* PichuPaper: catálogo, filtros y carrito funcionan enteramente en el navegador. */
const products = [
  { id: "cuaderno-a5", name: "Cuaderno A5 Botánica", category: "Cuadernos", price: 8.50, originalPrice: 10.00, rating: "4.9", icon: "fa-book-open", color: "art-mint", tag: "Favorito", images: ["assets/products/cuaderno-a5-01.png", "assets/products/cuaderno-a5-02.png", "assets/products/cuaderno-a5-03.png"] },
  { id: "cuaderno-rayas", name: "Libreta Rayas del día", category: "Cuadernos", price: 6.25, rating: "4.8", icon: "fa-book", color: "art-sky", tag: "A5 · 80 hojas", images: ["assets/products/libreta-rayas-del-dia-01.png", "assets/products/libreta-rayas-del-dia-02.png", "assets/products/libreta-rayas-del-dia-03.png"] },
  { id: "boligrafo-gel", name: "Bolígrafo gel punta fina", category: "Bolígrafos", price: 2.40, rating: "4.7", icon: "fa-pen", color: "art-sky", tag: "3 colores · 0.5 mm", images: ["assets/products/boligrafo-gel-punta-fina-azul-01.png", "assets/products/boligrafo-gel-punta-fina-negrop-01.png", "assets/products/boligrafo-gel-punta-fina-verde-01.png"], variantImageGroups: [[0], [1], [2]] },
  { id: "set-resaltadores", name: "Set de resaltadores pastel", category: "Bolígrafos", price: 5.30, originalPrice: 5.90, rating: "4.9", icon: "fa-highlighter", color: "art-navy", tag: "Set x 4", images: ["assets/products/set-resaltadores-pastel-01.png", "assets/products/set-resaltadores-pastel-02.png"] },
  { id: "organizador", name: "Organizador de escritorio", category: "Escritorio", price: 12.75, rating: "4.8", icon: "fa-box-open", color: "art-white", tag: "Orden bonito", images: ["assets/products/organizador-escritorio-compacto-01.png", "assets/products/organizador-escritorio-compacto-02.png", "assets/products/organizador-escritorio-ampliado-01.png", "assets/products/organizador-escritorio-ampliado-02.png"], variantImageGroups: [[0, 1], [2, 3]] },
  { id: "notas-adhesivas", name: "Notas adhesivas color", category: "Escritorio", price: 3.60, rating: "4.6", icon: "fa-note-sticky", color: "art-mint", tag: "Set x 5" },
  { id: "lapices-color", name: "Lápices de color · 12 tonos", category: "Arte", price: 7.80, rating: "4.9", icon: "fa-palette", color: "art-sky", tag: "12 colores" },
  { id: "marcadores-arte", name: "Marcadores para ilustrar", category: "Arte", price: 9.40, rating: "4.8", icon: "fa-paintbrush", color: "art-navy", tag: "Doble punta" },
  { id: "planificador-semanal", name: "Planificador semanal A5", category: "Cuadernos", price: 11.50, rating: "4.9", icon: "fa-calendar-days", color: "art-mint", tag: "Organiza tu semana", images: ["assets/products/planificador-semanal-a5-01.png", "assets/products/planificador-semanal-a5-02.png"] },
  { id: "bloc-listas", name: "Bloc de listas desprendibles", category: "Cuadernos", price: 4.25, rating: "4.7", icon: "fa-list-check", color: "art-white", tag: "50 hojas", images: ["assets/products/bloc-listas-desprendibles-01.png", "assets/products/bloc-listas-desprendibles-02.png"] },
  { id: "boligrafo-retractil", name: "Bolígrafo retráctil negro", category: "Bolígrafos", price: 1.80, rating: "4.6", icon: "fa-pen", color: "art-navy", tag: "Trazo 0.7 mm", images: ["assets/products/boligrafo-retractil-negro-01.png", "assets/products/boligrafo-retractil-negro-02.png"] },
  { id: "set-boligrafos-color", name: "Set de bolígrafos de colores", category: "Bolígrafos", price: 6.20, rating: "4.8", icon: "fa-marker", color: "art-sky", tag: "Set x 6", images: ["assets/products/set-boligrafos-colores-01.png", "assets/products/set-boligrafos-colores-02.png"] },
  { id: "portalapices", name: "Portalápices de escritorio", category: "Escritorio", price: 8.95, rating: "4.7", icon: "fa-pen-ruler", color: "art-mint", tag: "Orden práctico" },
  { id: "cinta-decorativa", name: "Cinta decorativa washi", category: "Escritorio", price: 3.40, rating: "4.8", icon: "fa-tape", color: "art-sky", tag: "Set x 3" },
  { id: "acuarelas", name: "Set de acuarelas compactas", category: "Arte", price: 10.75, rating: "4.9", icon: "fa-droplet", color: "art-white", tag: "12 colores" },
  { id: "cuaderno-dibujo", name: "Cuaderno para dibujo A4", category: "Arte", price: 9.95, rating: "4.8", icon: "fa-pencil", color: "art-navy", tag: "Papel grueso" }
];
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
let pendingRemoval = null;
let removalConfirmationResolve = null;
let focusBeforeRemovalConfirmation = null;
let bodyOverflowBeforeRemovalConfirmation = "";

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function productVisual(product, variant = "") {
  const variantIndex = productDetails[product.id].variants.indexOf(variant);
  const imageIndex = product.variantImageGroups?.[variantIndex]?.[0] ?? (product.variantImages && variantIndex >= 0 ? variantIndex : 0);
  const image = product.images?.[imageIndex] || product.images?.[0] || product.image;
  if (image) {
    return `<img class="product-photo" src="${image}" alt="" loading="lazy" decoding="async" />`;
  }
  return `<i class="fa-solid ${product.icon}" aria-hidden="true"></i>`;
}

function renderDetailVisual(product) {
  const images = product.images || (product.image ? [product.image] : []);
  if (!images.length) {
    return `<div class="detail-art product-art ${product.color}" role="img" aria-label="${product.name}"><span class="art-tag">${product.tag}</span>${productVisual(product)}</div>`;
  }
  const variantIndex = productDetails[product.id].variants.indexOf(detailVariant);
  const imageIndexes = product.variantImageGroups?.[variantIndex] || images.map((_, index) => index);
  const selectedIndex = imageIndexes.includes(detailImageIndex) ? detailImageIndex : imageIndexes[0];
  const thumbnails = imageIndexes.length > 1
    ? `<div class="product-gallery-thumbnails" role="group" aria-label="Imágenes de ${product.name}">${imageIndexes.map((index) => `
        <button class="product-gallery-thumbnail${index === selectedIndex ? " active" : ""}" type="button" data-detail-image="${index}" aria-label="Ver imagen ${index + 1} de ${images.length} de ${product.name}" aria-pressed="${index === selectedIndex}">
          <img src="${images[index]}" alt="" loading="lazy" decoding="async" />
        </button>`).join("")}</div>`
    : "";
  return `<div class="product-gallery">
    <div class="detail-art product-art detail-gallery-image ${product.color}" data-testid="detail-gallery-image"><span class="art-tag">${product.tag}</span><img class="product-photo" src="${images[selectedIndex]}" alt="${product.name}, imagen ${selectedIndex + 1} de ${images.length}" fetchpriority="high" /></div>
    ${thumbnails}
  </div>`;
}

function renderProducts() {
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
      <a class="product-art-link" href="#/product/${product.id}" data-route="/product/${product.id}" aria-label="Ver detalles de ${product.name}" data-testid="link-detail-image-${product.id}">
        <div class="product-art ${product.color}" aria-hidden="true">
          <span class="art-tag">${product.originalPrice ? `Oferta · ${product.tag}` : product.tag}</span>
          ${productVisual(product)}
        </div>
      </a>
      <div class="product-info">
        <div class="product-meta"><span>${product.category}</span><span class="rating"><i class="fa-solid fa-star" aria-hidden="true"></i>${product.rating}</span></div>
        <h3><a href="#/product/${product.id}" data-route="/product/${product.id}" data-testid="link-detail-${product.id}">${product.name}</a></h3>
        <div class="product-bottom"><span class="price-stack"><span class="price" data-testid="text-price-${product.id}">${money(product.price)}</span>${product.originalPrice ? `<del class="old-price">${money(product.originalPrice)}</del>` : ""}</span><button class="add-button" type="button" data-add="${product.id}" aria-label="Añadir ${product.name} al carrito" data-testid="button-add-${product.id}"><span>Añadir al carrito</span><i class="fa-solid fa-plus" aria-hidden="true"></i></button></div>
      </div>
    </article>`).join("");
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
      <div class="cart-thumb ${product.color}" aria-hidden="true">${productVisual(product, item.variant)}</div>
      <div><p class="cart-product-name">${product.name}</p><span class="cart-product-price">${item.variant ? `${item.variant} · ` : ""}${money(product.price)} c/u</span>
        <div class="quantity-control" aria-label="Cantidad de ${product.name}">
          <button type="button" data-quantity="-1" data-id="${product.id}" data-variant="${variantKey}" aria-label="Restar una unidad de ${product.name}" data-testid="button-decrease-${product.id}">−</button>
          <span data-testid="text-quantity-${product.id}">${item.quantity}</span>
          <button type="button" data-quantity="1" data-id="${product.id}" data-variant="${variantKey}" aria-label="Añadir una unidad de ${product.name}" data-testid="button-increase-${product.id}">+</button>
        </div>
      </div>
      <div class="cart-row-end"><button class="remove-item" type="button" data-remove="${product.id}" data-variant="${variantKey}" aria-label="Eliminar ${product.name}" data-testid="button-remove-${product.id}"><i class="fa-regular fa-trash-can" aria-hidden="true"></i></button><span class="line-total">${money(product.price * item.quantity)}</span></div>
    </article>`;
  }).join("");
  const subtotal = cart.reduce((sum, item) => sum + products.find((product) => product.id === item.id).price * item.quantity, 0);
  document.querySelector("#cartSubtotal").textContent = money(subtotal);
}

function showToast(message) {
  pendingRemoval = null;
  document.querySelector("#toastMessage").textContent = message;
  const action = document.querySelector("#toastAction");
  action.hidden = true;
  action.onclick = null;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
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
  if (currentRoute === "/cart") renderRoute();
  const action = document.querySelector("#toastAction");
  document.querySelector("#toastMessage").textContent = `${product.name} se eliminó del carrito.`;
  action.textContent = "Deshacer";
  action.hidden = false;
  action.onclick = () => {
    if (!pendingRemoval) return;
    cart.splice(Math.min(pendingRemoval.index, cart.length), 0, pendingRemoval.item);
    pendingRemoval = null;
    renderCart();
    renderRoute();
    toast.classList.remove("show");
    clearTimeout(toastTimer);
  };
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    pendingRemoval = null;
  }, 5000);
}

document.querySelector("#cancelRemove").addEventListener("click", () => finishRemovalConfirmation(false));
document.querySelector("#confirmRemove").addEventListener("click", () => finishRemovalConfirmation(true));
document.querySelector("#removeConfirmBackdrop").addEventListener("click", () => finishRemovalConfirmation(false));

const routePage = document.querySelector("#routePage");
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
  currentRoute = path;
  document.body.classList.toggle("page-route", path !== "/");
  routePage.hidden = path === "/" || path.startsWith("/payment");
  checkoutModal.classList.remove("open", "page-mode");
  checkoutBackdrop.classList.remove("open");
  checkoutModal.inert = true;
  checkoutModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
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
    return;
  }
  if (path === "/payment") {
    if (!cart.length) { navigate("/cart", true); return; }
    document.title = "Pago de demostración — PichuPaper";
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
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="#/" data-route="/">Inicio</a><span aria-hidden="true">/</span><a href="#catalogo" data-route="/">Catálogo</a><span aria-hidden="true">/</span><span aria-current="page">${product.name}</span></nav>
    <section class="detail-layout" data-testid="product-detail-${product.id}">
      ${renderDetailVisual(product)}
      <div class="detail-copy"><span class="section-kicker">${product.category} · PichuPaper</span><h1>${product.name}</h1><div class="rating"><i class="fa-solid fa-star" aria-hidden="true"></i> ${product.rating} · selección de la tienda</div><p class="detail-description">${detail.description}</p><div class="detail-price">${money(product.price)} <span>Precio de ejemplo</span></div>
      <label class="detail-label" for="detailVariant">Formato o variante</label><select id="detailVariant" class="detail-select" data-testid="select-product-variant">${detail.variants.map((variant) => `<option>${variant}</option>`).join("")}</select>
      <div class="detail-buy"><div class="quantity-control detail-quantity"><button type="button" data-detail-quantity="-1" aria-label="Restar una unidad" data-testid="button-detail-decrease">−</button><span data-testid="text-detail-quantity">${detailQuantity}</span><button type="button" data-detail-quantity="1" aria-label="Añadir una unidad" data-testid="button-detail-increase">+</button></div><button class="button-primary" type="button" data-action="add-detail" data-testid="button-add-detail">Añadir al carrito <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i></button></div>
      <p class="detail-delivery"><i class="fa-solid fa-truck-fast" aria-hidden="true"></i> Envíos ilustrativos a todo Ecuador. Compra de demostración.</p><button class="text-link" type="button" data-route="/cart" data-testid="button-detail-view-cart">Ver carrito <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></div>
    </section><div class="detail-footnote" role="note">Los productos y precios son ejemplos. No se procesa ningún pago ni se crea un pedido real.</div>`;
}
function renderCartPage() {
  const subtotal = cart.reduce((sum, item) => sum + products.find((product) => product.id === item.id).price * item.quantity, 0);
  if (!cart.length) {
    return `<nav class="breadcrumbs"><a href="#/" data-route="/">Inicio</a><span>/</span><span>Carrito</span></nav>
      <section class="page-heading"><span class="section-kicker">Tu selección</span><h1>Tu carrito</h1><p>Un espacio para reunir tus ideas favoritas.</p></section>
      <div class="cart-page-empty" data-testid="cart-empty-state"><div class="empty-icon"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i></div><h2>Tu carrito está tomando aire</h2><p>Todavía no has elegido tus esenciales. Hay un montón de ideas esperándote.</p><a class="button-primary" href="#catalogo" data-route="/">Explorar productos</a></div>
      <p class="detail-footnote" role="note">Precios y pagos de ejemplo. No hay compras reales.</p>`;
  }

  const rows = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    const variant = item.variant || productDetails[product.id].variants[0];
    const variantKey = encodeURIComponent(item.variant || "");
    const testKey = `${product.id}-${variantKey || "default"}`;
    return `<article class="cart-page-row" data-testid="cart-item-${testKey}">
      <div class="cart-thumb ${product.color}" aria-hidden="true">${productVisual(product, item.variant)}</div>
      <div class="cart-page-info">
        <a href="#/product/${product.id}" data-route="/product/${product.id}" class="cart-product-name">${product.name}</a>
        <span class="cart-product-price">${variant} · ${money(product.price)} c/u</span>
        <div class="quantity-control" aria-label="Cantidad de ${product.name}">
          <button type="button" data-quantity="-1" data-id="${product.id}" data-variant="${variantKey}" aria-label="Restar una unidad de ${product.name}" data-testid="button-decrease-${testKey}">−</button>
          <span data-testid="text-quantity-${testKey}">${item.quantity}</span>
          <button type="button" data-quantity="1" data-id="${product.id}" data-variant="${variantKey}" aria-label="Añadir una unidad de ${product.name}" data-testid="button-increase-${testKey}">+</button>
        </div>
      </div>
      <div class="cart-page-end"><strong>${money(product.price * item.quantity)}</strong><button class="remove-item" type="button" data-remove="${product.id}" data-variant="${variantKey}" aria-label="Eliminar ${product.name}" data-testid="button-remove-${testKey}">Eliminar</button></div>
    </article>`;
  }).join("");

  return `<nav class="breadcrumbs"><a href="#/" data-route="/">Inicio</a><span>/</span><span aria-current="page">Carrito</span></nav>
    <section class="page-heading"><span class="section-kicker">Tu selección</span><h1>Tu carrito</h1><p>${cartCount()} ${cartCount() === 1 ? "artículo listo" : "artículos listos"} para revisar.</p></section>
    <div class="cart-page-layout"><div class="cart-page-items" data-testid="cart-page-items">${rows}</div>
      <aside class="cart-page-summary"><h2>Resumen</h2><div class="subtotal-line"><span>Subtotal</span><strong data-testid="text-cart-subtotal">${money(subtotal)}</strong></div>
        <p class="shipping-note">El costo de envío que aparece al continuar es solo ilustrativo.</p>
        <button class="checkout-button" type="button" data-action="go-payment" data-testid="button-checkout"><i class="fa-solid fa-lock" aria-hidden="true"></i> Continuar al pago</button>
        <p class="demo-note">No se procesan pagos ni se guardan datos.</p><a href="#catalogo" class="continue-shopping" data-route="/">Seguir viendo productos</a>
      </aside>
    </div><p class="detail-footnote" role="note">Advertencia: precios, envío y métodos de pago son ejemplos. No hay pago ni pedido real.</p>`;
}

function renderDownloadsPage() {
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="#/" data-route="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Descargas</span></nav>
    <section class="page-heading"><span class="section-kicker">Archivos de la tienda</span><h1>Descargas</h1><p>Descarga una copia de los archivos activos de PichuPaper.</p></section>
    <section class="downloads-card" data-testid="downloads-page">
      <div class="downloads-card-heading"><span class="downloads-icon"><i class="fa-solid fa-file-zipper" aria-hidden="true"></i></span><div><h2>Código fuente del e-commerce</h2><p>Un ZIP con la tienda y un servidor local para ejecutarla.</p></div></div>
      <ul class="downloads-file-list">
        <li><code>index.html</code><span>Estructura y contenido</span></li>
        <li><code>style.css</code><span>Diseño adaptable</span></li>
        <li><code>script.js</code><span>Catálogo, carrito y pago simulado</span></li>
        <li><span class="downloads-file-names"><code>favicon.svg</code><code>robots.txt</code></span><span>Recursos del sitio</span></li>
        <li><span class="downloads-file-names"><code>server.mjs</code><code>README.md</code><code>package.json</code></span><span>Servidor local e instrucciones</span></li>
      </ul>
      <a class="button-primary downloads-button" href="/downloads/pichupaper-source.zip" download="pichupaper-source.zip" data-testid="link-download-source"><i class="fa-solid fa-download" aria-hidden="true"></i> Descargar archivos (.zip)</a>
      <p class="downloads-note">El ZIP no incluye carpetas generadas ni dependencias instaladas. Necesitas Node.js 18+ para ejecutar el servidor local.</p>
      <p class="detail-footnote" role="note">PichuPaper es una demostración: no procesa pagos ni crea pedidos. Las fuentes e iconos se cargan desde sus CDN.</p>
    </section>`;
}

function addToCart(productId, quantity = 1, variant = "") {
  const selectedVariant = variant || productDetails[productId]?.variants[0] || "";
  const found = cart.find((item) => item.id === productId && item.variant === selectedVariant);
  if (found) found.quantity += quantity;
  else cart.push({ id: productId, quantity, variant: selectedVariant });
  renderCart();
  const product = products.find((entry) => entry.id === productId);
  showToast(`${product.name} se añadió a tu carrito.`);
}

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
    mainImage.alt = `${product.name}, imagen ${index + 1} de ${product.images.length}`;
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
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  offersOnly = false;
  document.querySelectorAll("[data-offers-only]").forEach((link) => link.removeAttribute("aria-current"));
  categoryFilters.querySelectorAll("[data-category]").forEach((filter) => {
    const selected = filter === button;
    filter.classList.toggle("active", selected);
    filter.setAttribute("aria-pressed", String(selected));
  });
  renderProducts();
});
searchInput.addEventListener("input", () => {
  if (currentRoute !== "/") navigate("/", true);
  renderProducts();
});
document.querySelectorAll("[data-offers-only]").forEach((link) => {
  link.addEventListener("click", () => {
    offersOnly = true;
    activeCategory = "Todos";
    searchInput.value = "";
    categoryFilters.querySelectorAll("[data-category]").forEach((filter) => {
      const selected = filter.dataset.category === "Todos";
      filter.classList.toggle("active", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-offers-only]").forEach((offerLink) => offerLink.setAttribute("aria-current", "page"));
    renderProducts();
  });
});
productGrid.addEventListener("click", (event) => {
  const routeLink = event.target.closest("[data-route]");
  if (routeLink) { event.preventDefault(); navigate(routeLink.dataset.route); return; }
  const clearButton = event.target.closest('[data-action="clear-search"]');
  if (clearButton) {
    activeCategory = "Todos";
    offersOnly = false;
    searchInput.value = "";
    document.querySelectorAll("[data-offers-only]").forEach((link) => link.removeAttribute("aria-current"));
    categoryFilters.querySelectorAll("[data-category]").forEach((filter) => {
      const selected = filter.dataset.category === "Todos";
      filter.classList.toggle("active", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    renderProducts();
    return;
  }
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);
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

function clearFieldErrors() {
  checkoutModal.querySelectorAll(".field-error").forEach((node) => { node.textContent = ""; });
  checkoutModal.querySelectorAll("[aria-invalid='true']").forEach((node) => node.removeAttribute("aria-invalid"));
  checkoutError.hidden = true;
  checkoutError.textContent = "";
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
  checkoutForm.reset();
  document.querySelector("#otherProvinceField").hidden = true;
  document.querySelector("#shippingProvinceOther").required = false;
  document.querySelector("#shippingProvinceOther").value = "";
  checkoutForm.hidden = false;
  document.querySelector("#cardNumber").value = "";
  document.querySelector("#cardExpiry").value = "";
  document.querySelector("#cardCvv").value = "";
  document.querySelector("#cardDemoFields").hidden = false;
  document.querySelector("#transferDemoFields").hidden = true;
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
  if (name.length < 2) { setFieldError("shippingName", "Escribe tu nombre (mínimo 2 caracteres)."); valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError("shippingEmail", "Ingresa un correo con formato válido."); valid = false; }
  if (!/^(09\d{8}|\+5939\d{8}|5939\d{8})$/.test(phone.replace(/[\s()-]/g, ""))) { setFieldError("shippingPhone", "Usa un formato ecuatoriano: 09XXXXXXXX o +5939XXXXXXXX."); valid = false; }
  if (!provinceSelect.value) { setFieldError("shippingProvince", "Selecciona una provincia."); valid = false; }
  else if (provinceSelect.value === "Otra provincia") {
    const normalizedProvince = provinceOther.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    if (!/^[A-Z][A-Za-z\s'-]{1,39}$/.test(normalizedProvince)) {
      setFieldError("shippingProvinceOther", "Escribe una provincia con letras; debe iniciar con mayúscula y tener hasta 40 caracteres.");
      valid = false;
    }
  }
  if (city.length < 2) { setFieldError("shippingCity", "Ingresa una ciudad."); valid = false; }
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
  if (selectedPayment() === "transfer") return true;
  const number = document.querySelector("#cardNumber").value.replace(/\s/g, "");
  const expiry = document.querySelector("#cardExpiry").value.trim();
  const cvv = document.querySelector("#cardCvv").value.trim();
  let valid = true;
  if (number !== "0000000000000000") { setFieldError("cardNumber", "Para esta demo, usa solo 0000 0000 0000 0000."); valid = false; }
  if (expiry !== "12/30") { setFieldError("cardExpiry", "Para esta demo, usa solo 12/30."); valid = false; }
  if (cvv !== "000") { setFieldError("cardCvv", "Para esta demo, usa solo 000."); valid = false; }
  if (!valid) {
    checkoutError.textContent = "Completa los campos con los valores ficticios indicados. Nunca uses datos reales.";
    checkoutError.hidden = false;
    checkoutModal.querySelector("[aria-invalid='true']")?.focus();
    return false;
  }
  // Card data is validated in place and immediately discarded; it is never copied to application state.
  document.querySelector("#cardNumber").value = "";
  document.querySelector("#cardExpiry").value = "";
  document.querySelector("#cardCvv").value = "";
  return true;
}

function renderReview() {
  const contact = checkoutContact;
  document.querySelector("#reviewContact").textContent = `${contact.name}\n${contact.email} · ${contact.phone}\n${contact.address}\n${contact.city}, ${contact.province}`;
  document.querySelector("#reviewPayment").textContent = selectedPayment() === "card" ? "Tarjeta · demo ficticia" : "Transferencia bancaria · datos ficticios (no transferir)";
  const rows = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    const variant = item.variant ? ` · ${item.variant}` : "";
    return `<div class="review-item"><span>${product.name}${variant} × ${item.quantity}</span><strong>${money(product.price * item.quantity)}</strong></div>`;
  }).join("");
  document.querySelector("#reviewItems").innerHTML = rows;
  const subtotal = cart.reduce((sum, item) => sum + products.find((product) => product.id === item.id).price * item.quantity, 0);
  document.querySelector("#reviewSubtotal").textContent = money(subtotal);
  document.querySelector("#reviewTotal").textContent = money(subtotal + 4.25);
}

document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) return;
  navigate("/payment");
});
document.querySelector("#checkoutClose").addEventListener("click", () => navigate("/cart"));
checkoutBackdrop.addEventListener("click", () => navigate("/cart"));
routePage.addEventListener("click", (event) => {
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
    addToCart(id, detailQuantity, detailVariant);
    navigate("/cart");
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
    renderRoute();
  }
});
routePage.addEventListener("change", (event) => {
  if (event.target.id !== "detailVariant") return;
  const productId = currentRoute.split("/")[2];
  const product = products.find((item) => item.id === productId);
  if (product?.variantImageGroups) {
    const imageIndex = product.variantImageGroups[event.target.selectedIndex]?.[0];
    if (imageIndex !== undefined) {
      detailVariant = event.target.value;
      detailImageIndex = imageIndex;
      const gallery = routePage.querySelector(".product-gallery");
      if (gallery) gallery.outerHTML = renderDetailVisual(product);
    }
  }
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
  } else if (action === "finish-demo") {
    checkoutForm.hidden = true;
    checkoutModal.querySelector('[data-step="success"]').hidden = false;
    checkoutProgress.forEach((node) => { node.classList.add("done"); node.classList.remove("active"); });
    const successHeading = checkoutModal.querySelector("#successHeading");
    successHeading.setAttribute("tabindex", "-1");
    successHeading.focus({ preventScroll: true });
  } else if (action === "reset-demo") {
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
  if (event.target.name !== "paymentMethod") return;
  const isCard = selectedPayment() === "card";
  document.querySelector("#cardDemoFields").hidden = !isCard;
  document.querySelector("#transferDemoFields").hidden = isCard;
  document.querySelector("#cardNumber").value = "";
  document.querySelector("#cardExpiry").value = "";
  document.querySelector("#cardCvv").value = "";
  clearFieldErrors();
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
renderProducts();
renderCart();
renderRoute();