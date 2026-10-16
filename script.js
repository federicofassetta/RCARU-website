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

// ---- Eventos: build "next event" and the archive from eventos.js ----
(function () {
  const data = window.RCARU_EVENTOS || [];
  const nextBox = document.getElementById("evento-proximo");
  const archive = document.getElementById("archivo");
  const grid = document.getElementById("archivo-grid");
  if (!nextBox) return;

  const esc = (t) => String(t || "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Both languages are rendered; CSS shows the active one.
  const both = (o) => o && (o.es || o.en)
    ? `<span lang="es">${esc(o.es)}</span><span lang="en">${esc(o.en || o.es)}</span>` : "";
  const day = (iso) => new Date(iso + "T12:00:00");
  const fmt = (iso, lang, opts) => new Intl.DateTimeFormat(lang, opts).format(day(iso));
  const longDate = (iso) =>
    `<span lang="es">${fmt(iso, "es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>` +
    `<span lang="en">${fmt(iso, "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>`;
  const shortMonth = (iso, lang) => fmt(iso, lang, { month: "short" }).replace(".", "");

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcoming = data.filter((e) => day(e.fecha) >= today)
                       .sort((a, b) => day(a.fecha) - day(b.fecha));
  const past = data.filter((e) => day(e.fecha) < today)
                   .sort((a, b) => day(b.fecha) - day(a.fecha));

  // Next event
  const e = upcoming[0];
  if (e) {
    const d = day(e.fecha);
    nextBox.innerHTML = `
      <article class="proximo">
        <div class="proximo-fecha" aria-hidden="true">
          ${e.foto ? `<img src="${esc(e.foto)}" alt="">` : ""}
          <span class="proximo-dia">${d.getDate()}</span>
          <span class="proximo-mes"><span lang="es">${shortMonth(e.fecha, "es-AR")}</span><span lang="en">${shortMonth(e.fecha, "en-GB")}</span></span>
        </div>
        <div class="proximo-info">
          <p class="proximo-kicker"><span lang="es">Próximo encuentro</span><span lang="en">Next event</span></p>
          <h3>${both(e.titulo)}</h3>
          <dl class="proximo-datos">
            <div><dt><span lang="es">Cuándo</span><span lang="en">When</span></dt>
                 <dd>${longDate(e.fecha)}${e.hora ? `, ${esc(e.hora)}` : ""}</dd></div>
            <div><dt><span lang="es">Dónde</span><span lang="en">Where</span></dt>
                 <dd>${e.mapa ? `<a class="text-link" href="${esc(e.mapa)}" target="_blank" rel="noopener">${both(e.lugar)}</a>` : both(e.lugar)}</dd></div>
          </dl>
          <p>${both(e.resumen)}</p>
          ${e.nota && (e.nota.es || e.nota.en) ? `<p class="proximo-nota">${both(e.nota)}</p>` : ""}
          <div class="proximo-acciones">
            ${e.enlace ? `<a class="btn btn-sun" href="${esc(e.enlace)}" target="_blank" rel="noopener"><span lang="es">Inscribirme</span><span lang="en">Register</span></a>` : ""}
            ${e.programa ? `<a class="text-link" href="${esc(e.programa)}" target="_blank" rel="noopener"><span lang="es">Ver el programa</span><span lang="en">See the programme</span></a>` : ""}
          </div>
        </div>
      </article>`;
  } else {
    nextBox.innerHTML = `
      <p class="sin-eventos">
        <span lang="es">Todavía no hay una fecha confirmada para el próximo encuentro. Sumate a la red y te avisamos.</span>
        <span lang="en">The next event isn't scheduled yet. Join the network and we'll let you know.</span>
      </p>`;
  }

  // Archive
  if (past.length && archive && grid) {
    grid.innerHTML = past.map((p) => `
      <li class="pasado">
        <div class="pasado-foto">${p.foto ? `<img src="${esc(p.foto)}" alt="" loading="lazy">` : ""}</div>
        <p class="pasado-fecha">${longDate(p.fecha)}</p>
        <h4>${both(p.titulo)}</h4>
        <p class="pasado-lugar">${both(p.lugar)}</p>
        ${p.resumen ? `<p>${both(p.resumen)}</p>` : ""}
      </li>`).join("");
    archive.hidden = false;
  }
})();
