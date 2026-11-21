# ATELIER

An editorial architecture portfolio concept built with Next.js, Tailwind CSS, and GSAP. The four projects are fictional and use original generated architectural imagery.

## Run locally

Use Node.js 24 and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Hover over **Projects**, or activate it with a tap or the keyboard, to browse projects. Hovering or focusing a project changes its preview. Activating a project updates the featured work. Escape closes the index and returns focus to its toggle.

## Build and test

```bash
npm run build
npx playwright install chromium
npm test
```

Set `CHROMIUM_PATH` to use a system Chromium. The tests check hero readiness, pointer and keyboard navigation, reduced motion, and project selection on a 320 px touch viewport. Set `ATELIER_URL` to test an already running instance.

## Export the cover and video

Install Chromium with `npx playwright install chromium` or set `CHROMIUM_PATH` to a system Chromium. Run `npm run build` and `npm start`, then run this in a second terminal:

```bash
npm run capture
```

Playwright captures the live page from its first load through the hero reveal, index opening, two preview hovers, and index closing. Remotion places the 1440 × 900 browser capture inside a 1600 × 1200 canvas and renders an eight-second H.264 MP4 and a matching PNG cover to `artifacts/`. Set `ATELIER_URL`, `ATELIER_OUTPUT`, or `CHROMIUM_PATH` to override the server URL, output directory, or Chromium executable.
