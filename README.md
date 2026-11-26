# Nayuuta website

A static marketing site built with plain HTML, CSS, and vanilla JS. There is no framework and no build step.

```
index.html  about.html  solutions.html  services.html  contact.html  privacy.html
assets/css/styles.css       all styles; brand colours and fonts are at the top (:root)
assets/js/main.js           nav, dropdowns, sticky header, hero slider, contact form
assets/images/              favicon, Open Graph image, placeholders/ (all images are placeholders)
partials/                   shared header, footer and CTA strip (single source of truth)
scripts/sync_partials.py    copies partials into every page
sitemap.xml  robots.txt
```

## Preview locally

From the repository root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. You can also double-click `index.html`, since every link is relative.

## Shared header, footer and CTA

Each page contains a full copy of the header, footer and CTA strip, so the site works on any static host with no runtime includes, and search engines see all the content. To avoid editing six files by hand:

1. Edit `partials/header.html`, `partials/footer.html` or `partials/cta.html`.
2. Run `python3 scripts/sync_partials.py`.

The script replaces everything between `<!-- PARTIAL:name -->` and `<!-- /PARTIAL:name -->` in each page, and highlights the current page in the nav using `<body data-page="...">`. Don't edit inside those markers in the page files, because your changes will be overwritten.

The same script stamps `styles.css` and `main.js` links with a version based on their contents (`?v=…`). **Run it after any change to the CSS or JS** so visitors' browsers load the new files instead of an old cached copy.

## Hosting

The site is hosted on GitHub Pages at **https://www.nayuuta.com** (custom domain set in the `CNAME` file and in the repo's Settings → Pages). Every push to `main` goes live within a few minutes. Canonical/OG tags, `sitemap.xml`, `robots.txt` and JSON-LD all use `https://www.nayuuta.com/`.

## Before launch

The site contains no placeholder content. A few things still need attention:

| What | Where |
| --- | --- |
| **Contact form isn't connected.** It validates and shows a success message but sends nothing yet. | `submitForm()` in `assets/js/main.js` |
| **Review the site copy.** Hero slides, overview, card descriptions and About text were written as starter copy; check that claims fit your business. | `index.html`, `about.html`, `solutions.html`, `services.html` |
| **Privacy policy contact.** Confirm `www.nayuuta.com` and `privacy@nayuuta.com` are correct. | `privacy.html` |
| **Contact email.** `connect@nayuuta.com` is the only contact method (header, contact strip, footer, Contact page, JSON-LD). Phone numbers, WhatsApp, social links and testimonials were removed. | `partials/*.html`, `contact.html`, `index.html` |
| **Image quality.** Several card images are only 550–610px wide; swap in larger originals when available. | `assets/images/*.jpg` |

Logo: `assets/images/logo.png` (original stacked logo, transparent), `logo-horizontal.png` (horizontal, dark wordmark for light backgrounds), `logo-stacked.png` (stacked, original colours, used in the white header and light footer), `logo-light-stacked.png` (stacked, white wordmark, for dark backgrounds), `logo-light.png` (horizontal, white wordmark), `favicon.png` and `apple-touch-icon.png` (infinity symbol). Images come from dalhyd.com (company-owned).
