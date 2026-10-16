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

// ---- La red: numbers + UK map in the logo's node-and-link style (data in red.js) ----
(function () {
  const data = window.RCARU_RED;
  const svg = document.getElementById("red-svg");
  if (!data || !svg) return;

  const list = (data.instituciones || []).filter((i) => isFinite(i.lat) && isFinite(i.lon));
  const NS = "http://www.w3.org/2000/svg";

  // Numbers
  const cities = new Set(list.map((i) => (i.ciudad || "").trim().toLowerCase()).filter(Boolean));
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("n-instituciones", list.length);
  set("n-ciudades", cities.size);
  const ex = document.getElementById("red-ejemplo");
  if (ex) ex.hidden = !data.ejemplo;

  // Same projection as img/mapa-uk.svg
  const C = Math.cos(54.5 * Math.PI / 180);
  const project = (lat, lon) => [(lon + 10.8) * C * 100, (61 - lat) * 100];
  const R = 11;   // every institution drawn the same size: no member counts

  const nodes = list.map((i) => {
    const [x, y] = project(i.lat, i.lon);
    return { nombre: i.nombre, ciudad: i.ciudad, x, y, r: R };
  });

  // Nudge overlapping nodes apart (e.g. several London institutions)
  for (let k = 0; k < 80; k++) {
    for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
      const A = nodes[a], B = nodes[b];
      let dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 0.01;
      const min = A.r + B.r + 4;
      if (d < min) {
        if (d < 0.02) { dx = Math.cos(a + b); dy = Math.sin(a + b); d = 1; }
        const push = (min - d) / 2;
        A.x -= dx / d * push; A.y -= dy / d * push;
        B.x += dx / d * push; B.y += dy / d * push;
      }
    }
  }

  // Links: a minimum spanning tree, so every node hangs off the network like in the logo
  const links = [];
  if (nodes.length > 1) {
    const inTree = new Set([0]);
    while (inTree.size < nodes.length) {
      let best = null;
      inTree.forEach((a) => nodes.forEach((B, b) => {
        if (inTree.has(b)) return;
        const d = Math.hypot(B.x - nodes[a].x, B.y - nodes[a].y);
        if (!best || d < best.d) best = { a, b, d };
      }));
      links.push(best); inTree.add(best.b);
    }
  }

  const gLinks = document.getElementById("red-enlaces");
  const gNodes = document.getElementById("red-nodos");
  links.forEach((l, i) => {
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", nodes[l.a].x); line.setAttribute("y1", nodes[l.a].y);
    line.setAttribute("x2", nodes[l.b].x); line.setAttribute("y2", nodes[l.b].y);
    line.style.setProperty("--i", i);
    gLinks.appendChild(line);
  });

  const tip = document.getElementById("red-tooltip");
  const fig = svg.closest("figure");
  const showTip = (n, el) => {
    tip.innerHTML = `<strong>${n.nombre}</strong><span>${n.ciudad}</span>`;
    tip.hidden = false;
    const box = el.getBoundingClientRect(), f = fig.getBoundingClientRect();
    tip.style.left = (box.left + box.width / 2 - f.left) + "px";
    tip.style.top = (box.top - f.top) + "px";
  };
  const hideTip = () => { tip.hidden = true; };

  // Draw south to north so the reveal sweeps up the map
  const order = nodes.map((n, i) => i).sort((a, b) => nodes[b].y - nodes[a].y);
  order.forEach((idx, k) => {
    const n = nodes[idx];
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "nodo");
    g.setAttribute("tabindex", "0");
    g.setAttribute("aria-label", `${n.nombre}, ${n.ciudad}`);
    g.style.setProperty("--i", k);
    g.style.transformOrigin = `${n.x}px ${n.y}px`;
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", n.x); c.setAttribute("cy", n.y); c.setAttribute("r", n.r);
    const hit = document.createElementNS(NS, "circle");   // larger touch target
    hit.setAttribute("cx", n.x); hit.setAttribute("cy", n.y); hit.setAttribute("r", Math.max(n.r, 16));
    hit.setAttribute("class", "hit");
    g.append(hit, c);
    g.addEventListener("mouseenter", () => showTip(n, c));
    g.addEventListener("focus", () => showTip(n, c));
    g.addEventListener("click", () => showTip(n, c));
    g.addEventListener("mouseleave", hideTip);
    g.addEventListener("blur", hideTip);
    gNodes.appendChild(g);
  });

  // Screen-reader list
  const ul = document.getElementById("red-lista");
  if (ul) ul.innerHTML = list.map((n) => `<li>${n.nombre}, ${n.ciudad}</li>`).join("");

  // One reveal when the map scrolls into view
  const reveal = () => svg.classList.add("visible");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) reveal();
  else new IntersectionObserver((entries, obs) => {
    if (entries.some((e) => e.isIntersecting)) { reveal(); obs.disconnect(); }
  }, { threshold: 0.25 }).observe(svg);
})();

// ---- Becas: read the network's Google Sheet live and show it as cards ----
// The sheet stays the single source of truth: edit it and the site updates.
// Personal contact emails in the sheet are never shown; we point to RCARU instead.
(function () {
  const SHEET_ID = "1djUr2eCCwPmGwWFn-BecRJmCKX9TzbRU";
  const CONTACT = "mailto:redcaenru@gmail.com";
  const estado = document.getElementById("becas-estado");
  if (!estado) return;

  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t || "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clean = (t) => String(t == null ? "" : t).trim();
  const vague = (t) => !t || /^(depende|ver bases|varía|varia)/i.test(t);
  const firstUrl = (t) => (String(t || "").match(/https?:\/\/[^\s,;]+/) || [""])[0];
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\d?\./, ""); } catch (e) { return ""; } };
  const both = (es, en) => `<span lang="es">${es}</span><span lang="en">${en}</span>`;

  // Which level filters a row belongs to
  function levels(nivel) {
    const s = clean(nivel).toLowerCase();
    if (/todos/.test(s)) return ["doc", "post"];
    const out = [];
    if (/postdoc/.test(s)) out.push("post");
    if (/doctor|postgrado|phd|maestr|master/.test(s.replace(/postdoc\w*/g, ""))) out.push("doc");
    return out.length ? out : ["doc", "post"];
  }

  function fail() {
    estado.innerHTML = both(
      `No pudimos cargar la base en este momento. <a class="text-link" href="${$("becas-planilla").href}" target="_blank" rel="noopener">Abrila en Google Sheets</a>.`,
      `We couldn't load the database right now. <a class="text-link" href="${$("becas-planilla").href}" target="_blank" rel="noopener">Open it in Google Sheets</a>.`);
  }

  function build(table) {
    let rows = table.rows.map((r) => (r.c || []).map((c) => clean(c && (c.v != null ? c.v : c.f))));
    let head = table.cols.map((c) => clean(c.label));
    if (!head.some(Boolean)) head = rows.shift();          // header is the first row
    const col = (re) => head.findIndex((h) => re.test(h));
    const C = {
      nivel: col(/nivel/i), disc: col(/disciplina/i), tipo: col(/tipo de oportunidad/i),
      fin: col(/financ/i), apertura: col(/apertura/i), comienzo: col(/comienzo/i),
      duracion: col(/duraci/i), inst: col(/instituci/i), nombre: col(/nombre de la beca/i),
      desc: col(/descripci/i), url: col(/aplicar|url/i), contacto: col(/contacto/i), notas: col(/aclaraciones/i)
    };
    const get = (r, k) => (C[k] >= 0 ? r[C[k]] || "" : "");

    const items = rows.filter((r) => get(r, "inst") || get(r, "nombre")).map((r) => {
      const url = firstUrl(get(r, "url"));
      const desc = /^https?:\/\//.test(get(r, "desc")) ? "" : get(r, "desc");
      let inst = get(r, "inst");
      if (/^(incluye|ver bases)/i.test(inst)) inst = host(url) || inst;
      return {
        nombre: get(r, "nombre"), inst, desc, url,
        nivelTxt: get(r, "nivel"), niveles: levels(get(r, "nivel")),
        disc: get(r, "disc"), fin: get(r, "fin"),
        apertura: get(r, "apertura"), comienzo: get(r, "comienzo"), duracion: get(r, "duracion"),
        notas: get(r, "notas"), conContacto: !!get(r, "contacto"),
        buscador: !get(r, "nombre")
      };
    });
    items.forEach((it) => {
      it.texto = [it.nombre, it.inst, it.desc, it.disc, it.nivelTxt, it.notas].join(" ")
        .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    });
    return items;
  }

  function finBadge(fin) {
    if (/totalmente/i.test(fin)) return `<span class="badge badge-total">${both("Totalmente financiada", "Fully funded")}</span>`;
    if (/parcial/i.test(fin)) return `<span class="badge badge-parcial">${both("Financiamiento parcial", "Partly funded")}</span>`;
    return "";
  }

  function card(it) {
    const meta = [
      ["Nivel", "Level", it.nivelTxt],
      ["Convocatoria", "Applications", it.apertura],
      ["Comienzo", "Starts", it.comienzo],
      ["Duración", "Length", it.duracion]
    ].filter((m) => !vague(m[2]))
     .map((m) => `<div><dt>${both(m[0], m[1])}</dt><dd>${esc(m[2])}</dd></div>`).join("");
    return `
      <li class="beca">
        <p class="beca-inst">${esc(it.inst)}</p>
        <h4>${esc(it.nombre)}</h4>
        ${finBadge(it.fin)}
        ${meta ? `<dl class="beca-meta">${meta}</dl>` : ""}
        ${it.desc ? `<p class="beca-desc">${esc(it.desc)}</p>
          <button type="button" class="beca-mas" aria-expanded="false">${both("Leer más", "Read more")}</button>` : ""}
        ${it.notas ? `<p class="beca-notas">${esc(it.notas)}</p>` : ""}
        <div class="beca-links">
          ${it.url ? `<a class="text-link" href="${esc(it.url)}" target="_blank" rel="noopener">${both("Ir a la convocatoria", "Go to the call")}</a>` : ""}
          ${it.conContacto ? `<a class="beca-contacto" href="${CONTACT}">${both("Hay miembros de la red que la conocen: escribinos", "Network members know this one: get in touch")}</a>` : ""}
        </div>
      </li>`;
  }

  function buscador(it) {
    return `
      <li>
        <a href="${esc(it.url)}" target="_blank" rel="noopener">
          <span class="buscador-nombre">${esc(it.inst)}</span>
          <span class="buscador-desc">${esc(it.desc)}</span>
        </a>
      </li>`;
  }

  let all = [], nivel = "todos", q = "";

  function render() {
    const norm = q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
    const shown = all.filter((it) =>
      (nivel === "todos" || it.niveles.includes(nivel)) && (!norm || it.texto.includes(norm)));
    const prog = shown.filter((it) => !it.buscador);
    const busc = shown.filter((it) => it.buscador && it.url);
    $("becas-programas").innerHTML = prog.map(card).join("");
    $("becas-buscadores").innerHTML = busc.map(buscador).join("");
    $("becas-programas-wrap").hidden = !prog.length;
    $("becas-buscadores-wrap").hidden = !busc.length;
    $("becas-vacio").hidden = !!shown.length;

    // Only offer "Read more" where the description is actually cut off
    document.querySelectorAll(".beca-desc").forEach((p) => {
      const btn = p.nextElementSibling;
      if (btn && btn.classList.contains("beca-mas")) btn.hidden = p.scrollHeight <= p.clientHeight + 2;
    });
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".beca-mas");
    if (!btn) return;
    const open = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(open));
    btn.previousElementSibling.classList.toggle("abierta", open);
    btn.innerHTML = open ? both("Leer menos", "Read less") : both("Leer más", "Read more");
  });

  document.querySelectorAll("[data-nivel]").forEach((b) => b.addEventListener("click", () => {
    nivel = b.dataset.nivel;
    document.querySelectorAll("[data-nivel]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    render();
  }));
  $("becas-q").addEventListener("input", (e) => { q = e.target.value; render(); });

  // Load via Google's visualization endpoint (works from any site, no API key)
  window.google = window.google || {};
  google.visualization = google.visualization || {};
  google.visualization.Query = google.visualization.Query || {};
  const timer = setTimeout(fail, 12000);
  google.visualization.Query.setResponse = (resp) => {
    clearTimeout(timer);
    try {
      if (resp.status !== "ok") throw new Error(resp.status);
      all = build(resp.table);
      if (!all.length) throw new Error("empty");
      estado.hidden = true;
      $("becas-filtros").hidden = false;
      render();
    } catch (err) { fail(); }
  };
  const s = document.createElement("script");
  s.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
  s.onerror = () => { clearTimeout(timer); fail(); };
  document.body.appendChild(s);
})();

// ---- Boletines: archive list from boletines.js ----
(function () {
  const data = (window.RCARU_BOLETINES || []).filter((b) => b && b.fecha && b.enlace);
  const box = document.getElementById("boletin-archivo");
  const ul = document.getElementById("boletin-lista");
  if (!box || !ul || !data.length) return;
  const esc = (t) => String(t || "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const both = (o) => o ? `<span lang="es">${esc(o.es)}</span><span lang="en">${esc(o.en || o.es)}</span>` : "";
  const d = (iso, lang) => new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" })
    .format(new Date(iso + "T12:00:00"));
  ul.innerHTML = data.sort((a, b) => b.fecha.localeCompare(a.fecha)).map((b) => `
    <li>
      <a href="${esc(b.enlace)}" target="_blank" rel="noopener">
        <span class="boletin-fecha"><span lang="es">${d(b.fecha, "es-AR")}</span><span lang="en">${d(b.fecha, "en-GB")}</span></span>
        <span class="boletin-titulo">${both(b.titulo)}</span>
        ${b.resumen ? `<span class="boletin-resumen">${both(b.resumen)}</span>` : ""}
      </a>
    </li>`).join("");
  box.hidden = false;
})();

// ---- Visit counter: GoatCounter (no cookies, no personal data) ----
// Create a free account at https://www.goatcounter.com and put its code here,
// e.g. "rcaru" for https://rcaru.goatcounter.com. Empty = no counting.
(function () {
  const GOATCOUNTER_CODE = "";
  if (!GOATCOUNTER_CODE || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.body.appendChild(s);
})();
