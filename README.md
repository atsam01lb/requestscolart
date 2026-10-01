# Requests by Colart

The directory hub for `requests.colartdigitalmarketingagency.com` — karaoke bars and
entertainment venues hosted by Colart Digital Marketing Agency. Each partner venue gets its
own dedicated song-request page at `/<slug>`.

## ⚠️ Merging into your existing repo

**This zip is the rebuilt hub only** — `index.html`, `style.css`, `assets/`, `js/`, `404.html`,
`CNAME`, `robots.txt`, `sitemap.xml`, `llms.txt`, and this `README.md`. It does **not** include
your existing `tunekaraoke/` and `joesbarbatroun/` venue folders, since those already live in
your repo and were left untouched. Copy the files in this zip into your repo root, overwriting
the old `index.html`/`style.css`/`assets/` — do **not** delete your `tunekaraoke/` or
`joesbarbatroun/` folders when you do.

## Structure

```
/
├── index.html            the directory hub (this rebuild)
├── style.css              lightweight standalone stylesheet (brand tokens only)
├── 404.html               GitHub Pages custom 404
├── CNAME                  custom domain for GitHub Pages
├── robots.txt
├── sitemap.xml
├── llms.txt
├── assets/
│   ├── logo-full.svg      full "KR — Karaoke Requests" lockup
│   └── logo-mark.svg      the connector-dot mark alone (used as favicon)
├── js/
│   ├── items.js           ← the directory's data — add a venue here, nothing else
│   └── app.js              renders cards/chips/search from items.js
├── tunekaraoke/            (already in your repo — not part of this zip)
│   ├── index.html
│   ├── style.css
│   └── assets/
└── joesbarbatroun/          (already in your repo — not part of this zip)
    ├── index.html
    ├── style.css
    └── assets/
```

## Adding a new venue

The card grid, filter chips and search are entirely data-driven — nothing in `index.html` or
`app.js` needs to change. Open `js/items.js` and add an object to the array:

```js
{
  name: "New Venue",
  slug: "newvenue",          // becomes /newvenue
  category: "Karaoke Bar",   // auto-collected into a filter chip
  location: "City",          // optional, shown under the name
  logo: "newvenue/assets/logo.svg"  // optional — falls back to initials if omitted
}
```

Then build the venue's own page at `/newvenue/index.html` + `style.css` + `assets/`, following
the same pattern as `tunekaraoke/` or `joesbarbatroun/`.

## Brand tokens

`style.css` is intentionally standalone — it does not import Colart's full site stylesheet,
only the tokens this page needs:

| Token | Value |
|---|---|
| `--purple` | `#642878` |
| `--purple-dk` | `#4a1d59` |
| `--magenta` | `#c81478` |
| `--teal` | `#50a0b4` |
| `--mint` | `#64a08c` |
| `--lime` | `#8cb43c` |
| `--yellow` | `#dcdc3c` |
| `--ink` | `#1a1424` |
| `--bg-soft` | `#faf8fb` |

Fonts: **Lato** (300/400/700/900 — thin headline lines + bold final line) and
**Noto Kufi Arabic** (400/700, loaded for any future Arabic content via `[lang="ar"]`/`.rtl`).

Card accent colors are auto-assigned by `app.js`, cycling through
`purple → magenta → teal → mint → lime` by each item's position in `items.js` — no color
field needed per item.

## Deploying — GitHub Pages + Namecheap DNS

1. Push this repo (merged with your existing `tunekaraoke/`/`joesbarbatroun/` folders) to
   GitHub.
2. In the repo's **Settings → Pages**, set the source to the branch you pushed (e.g. `main`,
   root `/`).
3. Under **Settings → Pages → Custom domain**, enter `requests.colartdigitalmarketingagency.com`
   — GitHub reads the `CNAME` file already in this repo, but setting it in the UI also enables
   "Enforce HTTPS" once the certificate is issued.
4. In Namecheap's DNS settings for `colartdigitalmarketingagency.com`, add a `CNAME` record:
   - **Host:** `requests`
   - **Value:** `<your-github-username>.github.io`
   - **TTL:** Automatic
5. Wait for DNS to propagate (usually minutes, can take longer), then confirm the custom domain
   shows a green check under Settings → Pages and HTTPS is enforced.

## Local preview

No build step — it's static HTML/CSS/JS. From the repo root:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
