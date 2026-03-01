# CLAUDE.md

## Project Overview

Personal portfolio/website for Parag Salgaonkar, hosted on GitHub Pages.

## Tech Stack

- HTML, CSS, JavaScript (vanilla — no frameworks)
- Google Fonts: Fraunces, JetBrains Mono
- GitHub Pages for hosting

## Project Structure

```
├── index.html        # Main entry point
├── css/style.css     # All styles
├── js/               # JavaScript modules
├── docs/             # Documentation / assets
├── favicon.svg       # Site favicon
├── CNAME             # Custom domain config
├── _config.yml       # Jekyll config (excludes CLAUDE.md, README, LICENSE from build)
└── CLAUDE.md
```

## Conventions

- Keep it simple: plain HTML/CSS/JS, no build tools or bundlers
- Mobile-first responsive design
- Semantic HTML with accessibility attributes (aria-labels, etc.)

## Development

- Open `index.html` directly in a browser, or use a local server:
  ```
  python3 -m http.server 8000
  ```
- Deploy by pushing to the `main` branch (GitHub Pages)

## Git

- Branch naming: `<type>/<description>` or `<author>/<description>` (e.g. `feat/dark-mode`, `parag/init`)
- Keep commits concise and descriptive
