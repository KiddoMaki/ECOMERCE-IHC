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
    ["¿A qué lugares realizan envíos?", "Atendemos pedidos con destino en Ecuador. La cobertura, la fecha y el costo de entrega se coordinan antes de confirmar el pedido."],
    ["¿Cómo hago un pedido?", "Elige los productos y sus variantes, agrégalos al carrito e inicia sesión para completar los datos de entrega y revisar el pedido."],
    ["¿Cuándo queda confirmado mi pedido?", "Al terminar el checkout se registra como pendiente. El equipo debe coordinar contigo el pago y el envío antes de confirmarlo."],
    ["¿PichuPaper procesa pagos con tarjeta o transferencia?", "No. El sitio no tiene una pasarela de pago y no realiza cobros ni transferencias. No ingreses datos financieros reales en el formulario."],
    ["¿Puedo cambiar o cancelar un pedido?", "Escríbenos cuanto antes a hola@papelytinta.ec con el número del pedido. Cualquier cambio debe coordinarse con el equipo."],
    ["¿Necesito una cuenta para comprar?", "Sí. Inicia sesión o crea una cuenta para completar y registrar un pedido."],
    ["¿Cómo puedo consultar por un producto?", "Visita la página de Contacto y escríbenos por correo. También puedes revisar las variantes y detalles disponibles en la ficha de cada producto."]
  ];
  return `<nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="#/" data-route="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Preguntas frecuentes</span></nav>
    <section class="page-heading" data-testid="faq-page"><span class="section-kicker">Resolvemos tus dudas</span><h1>Preguntas frecuentes</h1><p>Información sobre pedidos, entregas y formas de contacto.</p></section>
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
