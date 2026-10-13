// RCARU website: language switch, mobile menu, photo fallbacks.

(function () {
  const root = document.documentElement;

  // ---- Language (ES default, EN optional; remembered per browser) ----
  function setLang(lang) {
    root.dataset.lang = lang;
    root.lang = lang;
    document.querySelectorAll("[data-set-lang]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.setLang === lang));
    });
    try { localStorage.setItem("rcaru-lang", lang); } catch (e) {}
  }

  let saved = null;
  try { saved = localStorage.getItem("rcaru-lang"); } catch (e) {}
  if (saved === "es" || saved === "en") setLang(saved);

  document.querySelectorAll("[data-set-lang]").forEach((b) => {
    b.addEventListener("click", () => setLang(b.dataset.setLang));
  });

  // ---- Mobile menu ----
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // ---- Team photos: show initials until a photo exists in img/team/ ----
  document.querySelectorAll(".avatar img").forEach((img) => {
    const fail = () => img.parentElement.classList.add("no-photo");
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
  });

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
