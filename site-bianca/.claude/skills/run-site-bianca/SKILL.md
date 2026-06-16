---
name: run-site-bianca
description: Run, screenshot, or verify the Estética Bianca Teo static site. Use when asked to run, start, build, screenshot, test, or view the site.
---

# run-site-bianca

Static one-page HTML site for Estética Bianca Teo (eyelash studio). No build step — pure HTML/CSS. Driven via `driver.mjs` which spins up a Node.js HTTP server and controls the browser with puppeteer.

## Prerequisites

- Node.js 18+ (present as `node`)
- puppeteer installed globally at `/opt/node22/lib/node_modules/puppeteer`

No `apt-get` installs needed. Puppeteer bundles its own Chromium.

## Run (agent path)

```bash
NODE_PATH=$(npm root -g) node .claude/skills/run-site-bianca/driver.mjs screenshot [output.png]
```

Takes a 1280×900 screenshot. Default output path: `screenshot.png` at the site root.

```bash
NODE_PATH=$(npm root -g) node .claude/skills/run-site-bianca/driver.mjs check
```

Prints the page title and hero `<h1>` text to stdout — useful for quick smoke checks.

Driver source: `.claude/skills/run-site-bianca/driver.mjs`

## Run (human path)

```bash
python3 -m http.server 8080 --directory /path/to/site-bianca
```

Then open `http://localhost:8080/` in a browser. Ctrl-C to stop.

## Gotchas

- `NODE_PATH=$(npm root -g)` is required — puppeteer is installed globally, not locally.
- Driver uses port **18080** internally to avoid conflicts with the human-path server on 8080.
- `resolve(import.meta.url, '../../../../')` resolves to `site-bianca/` — four levels up from the driver file's absolute path (file → skill-dir → skills → .claude → site-bianca).
- Google Fonts are loaded from the network; in a fully offline container the font falls back to sans-serif but the page renders fine.

## Troubleshooting

**`Cannot find module 'puppeteer'`** — missing `NODE_PATH=$(npm root -g)` prefix.

**`h1: undefined` / blank title** — ROOT path resolved wrong; double-check the `../../../../` in driver.mjs.

**Port already in use** — `kill $(lsof -ti:18080)` then retry.
