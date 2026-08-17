# Keraj Trading One Member PLC — China ⇄ Ethiopia

A modern, futuristic marketing website for a freight & logistics company that ships cargo from China to Ethiopia (sea, air, rail and express), with customs clearance and door-to-door delivery.

> ⚠️ **Sample data** — all company details, rates, contacts, team members and testimonials are illustrative placeholders. Swap in the real company information before going live.

## Pages

| Page | Path | Highlights |
| --- | --- | --- |
| Home | `index.html` | Animated route visual (Shanghai → Djibouti → Addis Ababa), stats, services, routes & rates table, testimonials, FAQ |
| Services | `services.html` | Sea FCL/LCL, Air, Rail+Road, Express, Customs, Warehousing — with pricing cards, value-added services, industries |
| Get a Quote | `quote.html` | Interactive door-to-door cost calculator (live USD + ETB estimates) |
| Track Shipment | `tracking.html` | Demo tracker with milestone timeline (try `KT-88421-CN-ET`) |
| About | `about.html` | Story, values, milestone timeline, team, offices |
| Contact | `contact.html` | Contact form, office cards, WhatsApp, FAQ |

## Tech

- Pure HTML + CSS + JS — **no build step, no frameworks, no dependencies**
- Dark futuristic design system: glassmorphism, aurora gradients, animated SVG route, scroll reveals, count-up stats, cursor glow
- Fully responsive, with `prefers-reduced-motion` support

## Project structure

```
├── index.html          # Home
├── services.html       # Services & rates
├── quote.html          # Quote calculator
├── tracking.html       # Shipment tracking (demo)
├── about.html          # About
├── contact.html        # Contact
├── css/style.css       # Design system / styles
└── js/main.js          # Shared interactions + calculator + tracking demo
```

## Run locally

Any static server works — the site has no build step:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open `http://localhost:8000`.

## Deploy on Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repository.
3. Vercel auto-detects a static site — keep the default settings and click **Deploy**.
4. Framework preset: *Other* · Build command: *(none)* · Output directory: *(default, root)*

`vercel.json` (clean URLs) is included; no other configuration needed.
