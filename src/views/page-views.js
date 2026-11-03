import { contactModel } from "../models/contact-model.js";
import { sessionModel } from "../models/session-model.js";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

export function renderContactPage() {
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="#/" data-route="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Contacto</span></nav>
    <section class="page-heading" data-testid="contact-page"><span class="section-kicker">Estamos para ayudarte</span><h1>Contacto</h1><p>Escríbenos si tienes preguntas sobre nuestros productos y pedidos.</p></section>
    <section class="contact-grid" aria-label="Formas de contacto">
      <article class="contact-card"><span class="contact-icon"><i class="fa-regular fa-envelope" aria-hidden="true"></i></span><div><h2>Correo electrónico</h2><p>${contactModel.note}</p><a class="button-primary" href="mailto:${contactModel.email}" data-testid="contact-email">${contactModel.email} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></div></article>
      <article class="contact-card"><span class="contact-icon"><i class="fa-solid fa-location-dot" aria-hidden="true"></i></span><div><h2>Despachos</h2><p>Atendemos pedidos con destino en Ecuador. La dirección y el costo se confirman al coordinar la entrega.</p></div></article>
    </section>
    <p class="detail-footnote" role="note">El enlace de correo abre tu aplicación de correo.</p>
    <a class="text-link faq-contact-link" href="#/faq" data-route="/faq">Consulta también las preguntas frecuentes</a>`;
}

export function renderFaqPage() {
  const questions = [
    ["¿Cómo puedo hacer un pedido?", "Explora el catálogo, elige el producto y la variante que prefieras, añádelo al carrito y continúa con el formulario de entrega para revisar tu pedido."],
    ["¿Necesito crear una cuenta?", "Sí. Inicia sesión o crea una cuenta para guardar tu carrito y registrar un pedido."],
    ["¿Cómo sé qué incluye un producto?", "Abre su ficha desde el catálogo para consultar la descripción, las variantes disponibles, el precio y las reseñas."],
    ["¿Puedo cambiar la variante o la cantidad?", "Sí. Puedes seleccionar la variante y la cantidad en la ficha del producto. También puedes ajustar las cantidades desde el carrito antes de revisar el pedido."],
    ["¿A qué lugares realizan entregas?", "Atendemos pedidos con destino en Ecuador. La cobertura, la dirección, la fecha y el costo de entrega se coordinan antes de confirmar el pedido."],
    ["¿Cuándo queda confirmado mi pedido?", "Al finalizar la revisión, el pedido queda registrado como pendiente. El equipo debe coordinar contigo el pago y el envío antes de confirmarlo."],
    ["¿El sitio cobra pagos con tarjeta o transferencia?", "No. El sitio no procesa pagos ni transferencias. El formulario solo revisa el formato de los datos; no ingreses información financiera real."],
    ["¿Puedo cambiar o cancelar un pedido?", "Contacta al equipo cuanto antes e incluye el número de pedido si ya lo tienes. Los cambios y cancelaciones deben coordinarse directamente."],
    ["¿Cómo puedo dejar una reseña?", "Inicia sesión, abre la ficha del producto y completa el formulario de reseña. El equipo puede requerir que tu correo esté verificado."],
    ["¿Cómo consulto por un producto o pedido?", `Escríbenos a <a href="mailto:${contactModel.email}">${contactModel.email}</a>. Incluye el nombre del producto o el número de pedido para ayudarnos a atenderte.`]
  ];
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="#/" data-route="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Preguntas frecuentes</span></nav>
    <section class="page-heading" data-testid="faq-page"><span class="section-kicker">Resolvemos tus dudas</span><h1>Preguntas y respuestas</h1><p>Información útil sobre productos, cuentas, pedidos, entregas y pagos.</p></section>
    <section class="faq-list" aria-label="Preguntas y respuestas">
      ${questions.map(([question, answer]) => `<details class="faq-item"><summary>${question}<i class="fa-solid fa-chevron-down" aria-hidden="true"></i></summary><p>${answer}</p></details>`).join("")}
    </section>
    <p class="faq-contact-note">¿No encuentras lo que buscas? <a href="#/contact" data-route="/contact">Ponte en contacto con nosotros</a>.</p>`;
}

export function renderLoginPage(isSignedIn) {
  const content = isSignedIn
    ? `<div class="auth-success" role="status" data-testid="login-success"><span class="success-mark"><i class="fa-solid fa-check" aria-hidden="true"></i></span><h2>Hola, ${escapeHtml(sessionModel.getUser()?.name || sessionModel.getUser()?.email || "bienvenido/a")}</h2><p>Tu cuenta está lista para gestionar el carrito y tus pedidos.</p><div class="auth-actions"><a class="button-primary" href="#/" data-route="/">Seguir comprando</a><button class="button-secondary" type="button" data-action="sign-out" data-testid="button-sign-out">Cerrar sesión</button></div></div>`
    : `<form class="auth-form" data-login-form data-testid="login-form">
        <label class="auth-field" for="loginEmail">Correo electrónico<input id="loginEmail" name="email" type="email" autocomplete="email" required maxlength="254" data-testid="input-login-email" /></label>
        <label class="auth-field" for="loginPassword">Contraseña<input id="loginPassword" name="password" type="password" autocomplete="current-password" required maxlength="128" data-testid="input-login-password" /></label>
        <p class="auth-message" data-auth-message role="status" aria-live="polite"></p>
        <button class="button-primary auth-submit" type="submit" data-testid="button-login">Iniciar sesión</button>
        <p class="auth-switch">¿Aún no tienes cuenta? <a href="#/register" data-route="/register">Crear cuenta</a></p>
      </form>`;
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="#/" data-route="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Iniciar sesión</span></nav>
    <section class="auth-page" data-testid="login-page" aria-labelledby="login-title"><div class="auth-heading"><span class="section-kicker">Tu espacio PichuPaper</span><h1 id="login-title">Iniciar sesión</h1><p>Accede a tu cuenta para gestionar el carrito y tus pedidos.</p></div>${content}</section>`;
}

export function renderRegisterPage(isSignedIn) {
  if (isSignedIn) return renderLoginPage(true);
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="#/" data-route="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Crear cuenta</span></nav>
    <section class="auth-page" data-testid="register-page" aria-labelledby="register-title"><div class="auth-heading"><span class="section-kicker">Tu espacio PichuPaper</span><h1 id="register-title">Crear cuenta</h1><p>Regístrate para guardar tus pedidos y continuar con tu compra.</p></div>
      <form class="auth-form" data-register-form data-testid="register-form">
        <label class="auth-field" for="registerName">Nombre completo<input id="registerName" name="name" type="text" autocomplete="name" required minlength="2" maxlength="120" /></label>
        <label class="auth-field" for="registerEmail">Correo electrónico<input id="registerEmail" name="email" type="email" autocomplete="email" required maxlength="254" /></label>
        <label class="auth-field" for="registerPassword">Contraseña<input id="registerPassword" name="password" type="password" autocomplete="new-password" required minlength="8" maxlength="128" /></label>
        <p class="auth-message" data-auth-message role="status" aria-live="polite"></p>
        <button class="button-primary auth-submit" type="submit">Crear cuenta</button>
        <p class="auth-switch">¿Ya tienes una cuenta? <a href="#/login" data-route="/login">Iniciar sesión</a></p>
      </form></section>`;
}
