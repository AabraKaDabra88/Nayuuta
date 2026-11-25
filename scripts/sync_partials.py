#!/usr/bin/env python3
"""
Copy the shared partials (partials/*.html) into every page.

The site has no build step: every .html page is complete, static HTML that
works when opened directly or served from any host. To avoid editing the same
header/footer in six files, edit the partial once and run:

    python3 scripts/sync_partials.py

Each page marks where a partial goes:

    <!-- PARTIAL:header -->
    ...anything here is replaced...
    <!-- /PARTIAL:header -->

For the header, the nav link matching <body data-page="..."> gets
aria-current="page" so the current page is highlighted.

Standard library only (Python 3.7+). Safe to run repeatedly.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = ROOT / "partials"
BLOCK_RE = re.compile(
    r"(?P<indent>[ \t]*)<!-- PARTIAL:(?P<name>[\w-]+) -->.*?<!-- /PARTIAL:(?P=name) -->",
    re.S,
)
PAGE_RE = re.compile(r'<body[^>]*\bdata-page="([\w-]+)"')


def render(name, page, indent):
    path = PARTIALS / f"{name}.html"
    if not path.exists():
        sys.exit(f"error: missing partial {path.relative_to(ROOT)}")
    html = path.read_text(encoding="utf-8").strip("\n")
    if name == "header" and page:
        html = html.replace(f'data-nav="{page}"', f'data-nav="{page}" aria-current="page"')
    body = "\n".join((indent + line) if line.strip() else "" for line in html.splitlines())
    return (
        f"{indent}<!-- PARTIAL:{name} -->\n"
        f"{indent}<!-- Generated from partials/{name}.html. Edit that file, then run: python3 scripts/sync_partials.py -->\n"
        f"{body}\n"
        f"{indent}<!-- /PARTIAL:{name} -->"
    )


def main():
    changed = 0
    for page_path in sorted(ROOT.glob("*.html")):
        text = page_path.read_text(encoding="utf-8")
        m = PAGE_RE.search(text)
        page = m.group(1) if m else None
        new = BLOCK_RE.sub(lambda b: render(b["name"], page, b["indent"]), text)
        if new != text:
            page_path.write_text(new, encoding="utf-8")
            changed += 1
            print(f"updated {page_path.name}")
    print(f"done: {changed} file(s) updated")


if __name__ == "__main__":
    main()
