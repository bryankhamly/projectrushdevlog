// ProjectRush — page boot.
// Initializes Vanta.js animated 3D backgrounds, sets up custom
// tabs/lightbox, runs hero character stagger and scroll-reveal animations.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ----- Vanta animated background -----
// Reads data-vanta on a target element and picks the matching effect.
// Each page only loads the JS for the one effect it uses, so VANTA[*]
// is checked before calling.
const vantaPalette = {
  net: {
    color: 0x4bd7ff,
    backgroundColor: 0x07080c,
    points: 11.0,
    maxDistance: 22.0,
    spacing: 16.0,
    showDots: true,
    backgroundAlpha: 1
  },
  rings: {
    color: 0xf5c85b,
    backgroundColor: 0x07080c,
    backgroundAlpha: 1
  },
  halo: {
    baseColor: 0x9b80ff,
    backgroundColor: 0x07080c,
    amplitudeFactor: 1.4,
    xOffset: 0,
    yOffset: 0,
    size: 1.4
  }
};

function initVanta() {
  if (reduceMotion) return;
  // Skip WebGL on phones / coarse pointers — too expensive, falls back to
  // the static gradient in .vanta-bg via CSS.
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const isNarrow = window.matchMedia("(max-width: 767px)").matches;
  if (isCoarse || isNarrow) return;

  const target = document.querySelector("[data-vanta]");
  if (!target || typeof window.VANTA === "undefined") return;
  const effect = target.dataset.vanta;
  const factory = window.VANTA[effect.toUpperCase()];
  if (!factory) return;

  const instance = factory({
    el: target,
    mouseControls: true,
    touchControls: false,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    ...vantaPalette[effect]
  });

  // Pause the WebGL render loop when the hero scrolls out of view.
  // Vanta drives its loop with requestAnimationFrame, storing the handle
  // in `instance.req`. Cancelling it stops frames; calling
  // `animationLoop()` restarts the loop.
  let paused = false;
  const pause = () => {
    if (paused) return;
    if (instance.req) cancelAnimationFrame(instance.req);
    instance.req = null;
    paused = true;
  };
  const resume = () => {
    if (!paused || typeof instance.animationLoop !== "function") return;
    paused = false;
    instance.animationLoop();
  };

  if ("IntersectionObserver" in window) {
    const heroSection = target.closest("section") || target;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? resume() : pause()));
      },
      { threshold: 0.01 }
    );
    io.observe(heroSection);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else resume();
  });
}

// ----- Hero character stagger -----
function initHeroStagger() {
  document.querySelectorAll(".hero-character").forEach((character, index) => {
    const delay = reduceMotion ? 0 : 480 + index * 140;
    window.setTimeout(() => character.classList.add("is-visible"), delay);
  });
}

// ----- Reveal-on-scroll -----
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((el) => io.observe(el));
}

// ----- Tabs (screenshot gallery) -----
function initTabs() {
  const tabs = Array.from(document.querySelectorAll(".tab[data-tab]"));
  if (!tabs.length) return;
  const panels = Array.from(document.querySelectorAll(".tab-panel"));
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tab;
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      panels.forEach((p) => p.classList.toggle("is-active", p.id === `panel-${id}`));
    });
  });
}

// ----- Lightbox -----
function initLightbox() {
  const lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox) return;
  const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
  const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");

  const open = (src, caption) => {
    lightboxImage.src = src;
    lightboxImage.alt = caption || "";
    lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    lightboxImage.src = "";
    lightboxImage.alt = "";
    lightboxCaption.textContent = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".shot[href]").forEach((shot) => {
    shot.addEventListener("click", (event) => {
      event.preventDefault();
      open(shot.getAttribute("href"), shot.dataset.lightboxCaption);
    });
  });

  closeButton.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) close();
  });
}

// ----- Boot -----
function boot() {
  initVanta();
  initHeroStagger();
  initScrollReveal();
  initTabs();
  initLightbox();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
