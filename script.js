const WA_NUMBER = "254740245537";
const SITE_URL  = "https://jaredowino.github.io/Modelboutique/";

document.addEventListener("DOMContentLoaded", () => {

  // ── MOBILE NAV ──────────────────────────────────────────────
  const menuToggle = document.getElementById("menuToggle");
  const mainNav    = document.getElementById("mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
    mainNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mainNav.classList.remove("open")));
  }

  // Header shadow on scroll
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (header) header.style.boxShadow = window.scrollY > 10 ? "0 2px 20px rgba(26,20,16,.12)" : "none";
  });

  // ── ORDER FORM ───────────────────────────────────────────────
  const orderForm     = document.getElementById("orderForm");
  const productSelect = document.getElementById("productSelect");
  const quantityInput = document.getElementById("quantity");
  const priceDisplay  = document.getElementById("priceDisplay");
  const totalDisplay  = document.getElementById("totalDisplay");

  function updatePriceTotal() {
    const price    = Number(productSelect?.selectedOptions[0]?.dataset.price) || 0;
    const quantity = Math.max(1, parseInt(quantityInput?.value) || 1);
    if (priceDisplay) priceDisplay.value = price ? `KSh ${price.toLocaleString()}` : "";
    if (totalDisplay) totalDisplay.value = price ? `KSh ${(price * quantity).toLocaleString()}` : "";
  }

  if (productSelect) productSelect.addEventListener("change", updatePriceTotal);
  if (quantityInput) quantityInput.addEventListener("input", updatePriceTotal);
  updatePriceTotal();

  if (orderForm) {
    orderForm.addEventListener("submit", e => {
      e.preventDefault();
      const name     = document.getElementById("customerName")?.value.trim();
      const phone    = document.getElementById("customerPhone")?.value.trim();
      const product  = productSelect?.value;
      const price    = Number(productSelect?.selectedOptions[0]?.dataset.price) || 0;
      const quantity = Math.max(1, parseInt(quantityInput?.value) || 1);
      const total    = price * quantity;

      if (!name)    { showToast("Please enter your name.", "error");    return; }
      if (!phone)   { showToast("Please enter your phone number.", "error"); return; }
      if (!product) { showToast("Please select a product.", "error");   return; }

      const msg =
        `🛍️ *New Order — Model Boutique*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🧾 *Product:* ${product}\n` +
        `🔢 *Quantity:* ${quantity}\n` +
        `💰 *Price per item:* KSh ${price.toLocaleString()}\n` +
        `💵 *Total:* KSh ${total.toLocaleString()}\n\n` +
        `_Sent from Model Boutique website_`;

      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
      orderForm.reset();
      updatePriceTotal();
      showToast("Order sent via WhatsApp! ✅", "success");
    });
  }

  // ── STAR RATING ──────────────────────────────────────────────
  const stars       = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("rating");

  function setStars(value) {
    stars.forEach(s => s.classList.toggle("active", Number(s.dataset.value) <= value));
    if (ratingInput) ratingInput.value = value;
  }

  stars.forEach(star => {
    star.addEventListener("mouseenter", () => {
      const v = Number(star.dataset.value);
      stars.forEach(s => s.style.color = Number(s.dataset.value) <= v ? "var(--gold)" : "");
    });
    star.addEventListener("mouseleave", () => stars.forEach(s => s.style.color = ""));
    star.addEventListener("click",      () => setStars(Number(star.dataset.value)));
  });

  // ── REVIEW FORM ──────────────────────────────────────────────
  const reviewForm      = document.getElementById("reviewForm");
  const reviewContainer = document.getElementById("reviewContainer");

  if (reviewForm) {
    reviewForm.addEventListener("submit", e => {
      e.preventDefault();
      const name    = document.getElementById("reviewName")?.value.trim();
      const message = document.getElementById("reviewMessage")?.value.trim();
      const rating  = parseInt(ratingInput?.value || "0");

      if (!name)    { showToast("Please enter your name.", "error");      return; }
      if (!message) { showToast("Please write your review.", "error");    return; }
      if (!rating)  { showToast("Please select a star rating.", "error"); return; }

      const waText =
        `⭐ *Customer Review — Model Boutique*\n\n` +
        `👤 *Name:* ${name}\n` +
        `${"⭐".repeat(rating)} *Rating:* ${rating}/5\n` +
        `💬 *Review:* ${message}\n\n` +
        `_Sent from Model Boutique website_`;

      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`, "_blank");

      if (reviewContainer) {
        const el = document.createElement("div");
        el.classList.add("review-item");
        el.innerHTML = `
          <div class="review-stars">${"⭐".repeat(rating)}</div>
          <p>${escapeHTML(message)}</p>
          <span class="review-author">— ${escapeHTML(name)}</span>`;
        reviewContainer.prepend(el);
      }

      reviewForm.reset();
      setStars(0);
      showToast("Review sent via WhatsApp! ⭐", "success");
    });
  }

  // ── LIGHTBOX ─────────────────────────────────────────────────
  const lightbox      = document.getElementById("lightbox");
  const lightboxImg   = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      lightboxImg.src = img?.dataset.src || img?.src || "#";
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox?.classList.remove("active");
    document.body.style.overflow = "";
  }

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  // ── QR CODE ──────────────────────────────────────────────────
  const qrContainer = document.getElementById("qrcode");
  if (qrContainer && typeof QRCode !== "undefined") {
    new QRCode(qrContainer, {
      text:         SITE_URL,
      width:        160,
      height:       160,
      colorDark:    "#1a1410",
      colorLight:   "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // ── TOAST NOTIFICATIONS ──────────────────────────────────────
  function showToast(message, type = "success") {
    document.querySelector(".toast")?.remove();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${type === "success" ? "✓" : "⚠"}</span><span>${message}</span>`;

    if (!document.getElementById("toastCSS")) {
      const s = document.createElement("style");
      s.id = "toastCSS";
      s.textContent = `
        .toast { position:fixed; bottom:2rem; right:2rem; z-index:9999; display:flex; align-items:center; gap:.6rem; padding:.85rem 1.4rem; border-radius:50px; font-family:'DM Sans',sans-serif; font-size:.9rem; font-weight:500; box-shadow:0 8px 30px rgba(0,0,0,.15); animation:toastIn .3s cubic-bezier(.34,1.56,.64,1) forwards; }
        .toast-success { background:#1a1410; color:#f7f3ee; }
        .toast-error   { background:#c0392b; color:#fff; }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
      `;
      document.head.appendChild(s);
    }

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "opacity .3s, transform .3s";
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  }

  // ── UTILITY ──────────────────────────────────────────────────
  function escapeHTML(str) {
    const d = document.createElement("div");
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

});
    
