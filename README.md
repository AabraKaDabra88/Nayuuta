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

## Placeholders to replace

To find every placeholder, run `grep -rn PLACEHOLDER --include=*.html --include=*.xml --include=*.txt .`

| What | Where |
| --- | --- |
| Domain `https://www.example.com` | `<head>` of every page (canonical and `og:` tags), JSON-LD in `index.html`, `sitemap.xml`, `robots.txt` |
| Logo (text "Nayuuta" + "N" mark) | `partials/header.html`, `partials/footer.html`, then sync |
| Favicon | `assets/images/favicon.svg` |
| Open Graph image | `assets/images/og-default.png` (1200×630) |
| All images | `assets/images/placeholders/*.svg`. Hero 1920×1080, overview/about 1200×900, cards 800×500, headshots 240×240. Update `alt` text when you swap them. |
| Hero slide copy (3 slides) | `index.html` |
| Company overview, solutions and services card copy | `index.html`, `solutions.html`, `services.html` |
| About page copy and stats (`00+`, `000+`) | `about.html` |
| Testimonials: all 5 quotes, names, titles and headshots are fictional | `index.html` |
| Email addresses (`hello@`, `india@`, `usa@`, `privacy@example.com`) | `partials/footer.html`, `contact.html`, `privacy.html` |
| Office addresses (India and USA) | `contact.html` |
| Social profile URLs (`href="#"`) | `partials/footer.html` |
| CTA strip and footer blurb | `partials/cta.html`, `partials/footer.html` |
| Privacy policy (template only, not legal advice) | `privacy.html` |
| Contact form submission (**TODO**) | `submitForm()` in `assets/js/main.js` |

The phone numbers (+91 8688403181, +1 214-699-4991) and WhatsApp links (`wa.me/918688403181`, `wa.me/12146994991`) are real. The header WhatsApp button uses the India number.
