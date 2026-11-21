# Serein — The Pilates Studio

A fictional boutique Pilates studio. The experience showcases small-group reformer and mat Pilates, private sessions, the studio, and first-visit guidance.

## Run locally

Use Node.js 24 and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Use the class tabs to compare sessions and the first-visit questions to explore the format.

## Build and test

```bash
npm run build
npx playwright install chromium
npm test
```

Set `CHROMIUM_PATH` to use a system Chromium or `SEREIN_URL` to test an already running server.

## Capture for Dribbble

With the site running, run `npm run capture`. Playwright captures the page and Remotion renders an eight-second 1600 × 1200 reel and a matching cover in `artifacts/`. The outer frame surrounds a 1440 × 900 browser viewport. Set `SEREIN_URL` if the site uses a different port or `SEREIN_OUTPUT` to set the output directory.
