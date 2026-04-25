const header = document.querySelector("[data-header]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const closeButton = document.querySelector("[data-lightbox-close]");
const screenshotButtons = Array.from(document.querySelectorAll("[data-lightbox-src]"));
const heroCharacters = Array.from(document.querySelectorAll(".hero-character"));

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function openLightbox(button) {
  const src = button.dataset.lightboxSrc;
  const caption = button.dataset.lightboxCaption;

  lightboxImage.src = src;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;
  closeButton.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
}

window.addEventListener("scroll", setHeaderState, { passive: true });

screenshotButtons.forEach((button) => {
  button.addEventListener("click", () => openLightbox(button));
});

heroCharacters.forEach((character, index) => {
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : index * 360;
  window.setTimeout(() => character.classList.add("is-visible"), delay);
});

closeButton.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});

setHeaderState();
