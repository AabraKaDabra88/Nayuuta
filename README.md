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

## Before launch

The site contains no placeholder content. A few things still need attention:

| What | Where |
| --- | --- |
| **Contact form isn't connected.** It validates and shows a success message but sends nothing yet. | `submitForm()` in `assets/js/main.js` |
| **Site address.** Canonical/OG tags, `sitemap.xml`, `robots.txt` and JSON-LD use `https://aabrakadabra88.github.io/Nayuuta/`. If you move to your own domain, find and replace that URL in all of them. | every page `<head>`, `sitemap.xml`, `robots.txt` |
| **Review the site copy.** Hero slides, overview, card descriptions and About text were written as starter copy; check that claims fit your business. | `index.html`, `about.html`, `solutions.html`, `services.html` |
| **Privacy policy contact.** Confirm `www.nayuuta.com` and `privacy@nayuuta.com` are correct. | `privacy.html` |
| **Optional additions.** Emails, social profile links, a Singapore phone number and client testimonials were removed until real ones are available. | `partials/footer.html`, `contact.html`, `index.html` |
| **Image quality.** Several card images are only 550–610px wide; swap in larger originals when available. | `assets/images/*.jpg` |

Logo: `assets/images/logo.svg` (light backgrounds) and `logo-light.svg` (dark header/footer). Images come from dalhyd.com (company-owned). The India phone number (+91 8688403181) and WhatsApp link (`wa.me/918688403181`) are used site-wide.
