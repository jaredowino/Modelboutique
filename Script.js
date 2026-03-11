document.addEventListener("DOMContentLoaded", function() {

  // ===== ORDER FORM =====
  const orderForm = document.getElementById("orderForm");
  const productSelect = document.getElementById("productSelect");
  const quantityInput = document.getElementById("quantity");
  const priceDisplay = document.getElementById("priceDisplay");
  const totalDisplay = document.getElementById("totalDisplay");

  function updatePriceTotal() {
    const price = parseInt(productSelect.options[productSelect.selectedIndex].dataset.price || 0);
    const quantity = parseInt(quantityInput.value || 0);
    priceDisplay.value = price ? `KSh ${price}` : "";
    totalDisplay.value = (price && quantity) ? `KSh ${price * quantity}` : "";
  }

  if(productSelect && quantityInput) {
    productSelect.addEventListener("change", updatePriceTotal);
    quantityInput.addEventListener("input", updatePriceTotal);
    updatePriceTotal();
  }

  if(orderForm) {
    orderForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = orderForm.querySelector("input[type='text']").value;
      const phone = orderForm.querySelector("input[type='tel']").value;
      const product = productSelect.value;
      const price = parseInt(productSelect.options[productSelect.selectedIndex].dataset.price || 0);
      const quantity = parseInt(quantityInput.value);
      const total = price * quantity;

      if(!product) { alert("Please select a product!"); return; }

      const message = `New Order - Model Boutique%0A%0ACustomer Name: ${name}%0APhone: ${phone}%0AProduct: ${product}%0AQuantity: ${quantity}%0APrice per item: KSh ${price}%0ATotal: KSh ${total}`;
      window.open("https://wa.me/254740245537?text=" + message, "_blank");

      orderForm.reset();
      updatePriceTotal();
    });
  }

  // ===== REVIEW FORM =====
  const reviewForm = document.getElementById("reviewForm");
  const reviewContainer = document.getElementById("reviewContainer");
  const ratingInput = document.getElementById("rating");
  const stars = document.querySelectorAll(".star-rating span");

  if(stars && ratingInput) {
    stars.forEach(star => {
      star.addEventListener("mouseover", () => {
        stars.forEach(s => s.classList.remove("hover"));
        for(let i=0;i<star.dataset.value;i++) stars[i].classList.add("hover");
      });
      star.addEventListener("mouseout", () => stars.forEach(s => s.classList.remove("hover")));
      star.addEventListener("click", () => {
        ratingInput.value = star.dataset.value;
        stars.forEach(s => s.classList.remove("selected"));
        for(let i=0;i<star.dataset.value;i++) stars[i].classList.add("selected");
      });
    });
  }

  if(reviewForm) {
    reviewForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = document.getElementById("reviewName").value;
      const message = document.getElementById("reviewMessage").value;
      const rating = ratingInput.value;

      if(rating === "0") { alert("Please select a star rating!"); return; }

      // Send review via WhatsApp
      const reviewText = `Customer Review - Model Boutique%0A%0AName: ${name}%0ARating: ${rating} Stars%0AReview: ${message}`;
      window.open("https://wa.me/254740245537?text=" + reviewText, "_blank");

      // Show review on the page
      const reviewBox = document.createElement("div");
      reviewBox.classList.add("review");
      reviewBox.innerHTML = `<p>${message}</p><span>- ${name}</span><div class='stars'>${"⭐".repeat(rating)}</div>`;
      reviewContainer.appendChild(reviewBox);

      reviewForm.reset();
      stars.forEach(s => s.classList.remove("selected"));
      ratingInput.value = 0;
    });
  }

  // ===== GALLERY LIGHTBOX =====
  const galleryImages = document.querySelectorAll(".gallery img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-content");
  const lightboxClose = document.querySelector(".lightbox .close");

  if(galleryImages && lightbox && lightboxImg && lightboxClose) {
    galleryImages.forEach(img => {
      img.addEventListener("click", () => {
        lightbox.style.display = "block";
        lightboxImg.src = img.dataset.src;
      });
    });

    lightboxClose.addEventListener("click", () => lightbox.style.display="none");
    lightbox.addEventListener("click", e => { if(e.target === lightbox) lightbox.style.display="none"; });
  }

  // ===== QR CODE =====
  var qrcodeContainer = document.getElementById("qrcode");
  if(qrcodeContainer) {
    new QRCode(qrcodeContainer, {
      text: "https://yourwebsite.com", // <-- Replace with your boutique website URL
      width: 150,
      height: 150,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
  }

});
