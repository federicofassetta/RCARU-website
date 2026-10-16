# RCARU website

Website of the Red de Científicos Argentinos en el Reino Unido (RCARU).
Plain HTML, CSS and a little JavaScript: no build step, no framework.

```
index.html        page content (Spanish + English, side by side)
style.css         all styling; colours are variables at the top
script.js         ES/EN switch, mobile menu, team-photo fallback, events
eventos.js        list of events (edit this to add one)
red.js            institutions for the map and numbers (no member counts)
img/              logo variants, favicon, social-share card
img/team/         coordinator photos (see below)
RCARU_logo.png    original logo (source for the files in img/)
```

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Editing content

Every piece of text exists twice, once per language:

```html
<span lang="es">Texto en castellano</span><span lang="en">English text</span>
```

Edit both. Spanish is the default; the ES/EN switch in the header remembers
the visitor's choice.

### Adding or changing a coordinator

Copy one `<li class="person">…</li>` block in the `#equipo` section and change
the LinkedIn link, initials, name and role. If someone has no LinkedIn, use the
`<div class="person-static">` version (see Judith Cherni or Isro Gloger).

### Network map and numbers

`red.js` holds the list of institutions (name, city, latitude, longitude).
The map and the two numbers (institutions, cities) are calculated from it.
By design the site does **not** show how many members are at each place, so it
can't be used to identify individuals: please don't add member counts.

It currently contains **sample data**, and the page says so while
`ejemplo: true`. To publish the real list: replace it and set `ejemplo: false`.
Coordinates come from Google Maps (right-click a place and copy the two numbers).

### Events

Events live in `eventos.js`, not in `index.html`. To add one, copy a `{ ... }`
block, change the date, title, place and summary, and save.

- An event dated today or later shows as **Próximo encuentro** (the soonest one).
- Once its date has passed it moves to **Encuentros anteriores** by itself.
- Optional: put a photo in `img/eventos/` and set `foto`, and a programme PDF
  (e.g. in `docs/`) and set `programa`.

### Team photos

Put square-ish JPGs in `img/team/` with these names. Until a photo exists, the
person's initials are shown instead, so nothing breaks.

| File | Person | Current photo on Carrd |
|---|---|---|
| `ricardo-morilla.jpg` | Ricardo Morilla | https://rcaru.carrd.co/assets/images/gallery02/28677b6c_original.jpg |
| `matias-acosta.jpg` | Matías Acosta | https://rcaru.carrd.co/assets/images/gallery02/7964f4e7_original.jpg |
| `federico-fassetta.jpg` | Federico Fassetta | https://rcaru.carrd.co/assets/images/gallery02/342ca65b_original.jpg |
| `exequiel-porta.jpg` | Exequiel Porta | https://rcaru.carrd.co/assets/images/gallery02/4b24d4cd_original.jpg |
| `nicolas-feldman.jpg` | Nicolás Feldman | https://rcaru.carrd.co/assets/images/gallery02/37e556d0_original.jpg |
| `mariana-fazio.jpg` | Mariana Andrea Fazio | https://rcaru.carrd.co/assets/images/gallery02/2be6ffc4_original.jpg |
| `pablo-poggi.jpg` | Pablo Poggi | https://rcaru.carrd.co/assets/images/gallery02/64df56fc_original.jpg |
| `judith-cherni.jpg` | Judith Cherni | https://rcaru.carrd.co/assets/images/gallery02/293a25a0_original.jpg |
| `gaston-caspe.jpg` | Gastón Caspe | https://rcaru.carrd.co/assets/images/gallery02/fd9ec09e_original.jpg |
| `isro-gloger.jpg` | Isro Gloger | https://rcaru.carrd.co/assets/images/gallery02/331cab25_original.jpg |

If the `_original` link doesn't work, drop `_original` from the URL.
Quick way to grab them all (run from the repo folder):

```bash
cd img/team
curl -L -o ricardo-morilla.jpg   https://rcaru.carrd.co/assets/images/gallery02/28677b6c_original.jpg
curl -L -o matias-acosta.jpg     https://rcaru.carrd.co/assets/images/gallery02/7964f4e7_original.jpg
curl -L -o federico-fassetta.jpg https://rcaru.carrd.co/assets/images/gallery02/342ca65b_original.jpg
curl -L -o exequiel-porta.jpg    https://rcaru.carrd.co/assets/images/gallery02/4b24d4cd_original.jpg
curl -L -o nicolas-feldman.jpg   https://rcaru.carrd.co/assets/images/gallery02/37e556d0_original.jpg
curl -L -o mariana-fazio.jpg     https://rcaru.carrd.co/assets/images/gallery02/2be6ffc4_original.jpg
curl -L -o pablo-poggi.jpg       https://rcaru.carrd.co/assets/images/gallery02/64df56fc_original.jpg
curl -L -o judith-cherni.jpg     https://rcaru.carrd.co/assets/images/gallery02/293a25a0_original.jpg
curl -L -o gaston-caspe.jpg      https://rcaru.carrd.co/assets/images/gallery02/fd9ec09e_original.jpg
curl -L -o isro-gloger.jpg       https://rcaru.carrd.co/assets/images/gallery02/331cab25_original.jpg
```

## Publishing with GitHub Pages (free)

1. On GitHub: **Settings → Pages**.
2. Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. After a minute the site is live at
   `https://federicofassetta.github.io/RCARU-website/`.
4. Optional: a custom domain (e.g. `rcaru.org.uk`) can be set on the same page.

Longer term it may be worth moving the repo to a shared RCARU GitHub
organisation so other coordinators can edit it too.
