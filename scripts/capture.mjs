import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { chromium } from 'playwright';
import { duration, fps, viewport } from '../remotion/format.mjs';

const url = process.env.ATELIER_URL || 'http://localhost:3000';
const output = resolve(process.env.ATELIER_OUTPUT || 'artifacts');
const browserExecutable = process.env.CHROMIUM_PATH || chromium.executablePath();

async function captureCover(browser, publicDir) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  try {
    await page.goto(url);
    await page.locator('.hero-image').evaluate((image) => image.decode());
    await page.getByRole('button', { name: 'Projects' }).hover();
    const menu = page.getByRole('navigation', { name: 'Project index' });
    await menu.getByRole('button', { name: /Pine Residence/ }).hover();
    await menu.getByRole('img', { name: /forest/ }).evaluate((image) => image.decode());
    await page.screenshot({ path: join(publicDir, 'cover.png') });
  } finally {
    await page.close();
  }
}

async function captureMotion(browser) {
  const page = await browser.newPage({ viewport, reducedMotion: 'no-preference' });
  try {
    // Chromium's screencast omits the native cursor. Draw one for the recording only.
    await page.addInitScript(() => {
      let cursor;
      window.addEventListener('pointermove', (event) => {
        if (!cursor) {
          cursor = document.createElement('div');
          cursor.setAttribute('aria-hidden', 'true');
          cursor.style.cssText = 'position:fixed;inset:0 auto auto 0;z-index:2147483647;pointer-events:none;filter:drop-shadow(0 1px 2px #17120c);';
          const arrow = document.createElement('div');
          arrow.style.cssText = 'width:14px;height:20px;background:white;clip-path:polygon(0 0,100% 66%,55% 66%,74% 97%,54% 100%,36% 70%,0 94%);';
          cursor.append(arrow);
          document.body.append(cursor);
        }
        cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      });
    });

    await page.setContent('<body style="margin:0;background:#342c23"></body>');
    const session = await page.context().newCDPSession(page);
    const frames = [];
    session.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
      if (metadata.timestamp) frames.push({ data, time: metadata.timestamp });
      void session.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
    });
    await session.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: viewport.width, maxHeight: viewport.height });
    const start = Date.now();
    const at = (seconds) => delay(Math.max(0, start + seconds * 1000 - Date.now()));
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    let pointer = { x: 945, y: 38 };
    async function glide(x, y) {
      const from = pointer;
      for (let step = 1; step <= 12; step++) {
        const fraction = step / 12;
        await page.mouse.move(from.x + (x - from.x) * fraction, from.y + (y - from.y) * fraction);
        await delay(14);
      }
      pointer = { x, y };
    }

    async function hover(locator) {
      await locator.waitFor({ state: 'visible' });
      const box = await locator.boundingBox();
      await glide(box.x + box.width / 2, box.y + box.height / 2);
    }

    const trigger = page.getByRole('button', { name: 'Projects' });
    const menu = page.getByRole('navigation', { name: 'Project index' });
    await at(2.65);
    await page.mouse.move(pointer.x, pointer.y);
    await hover(trigger);
    await at(3.85);
    await hover(menu.getByRole('button', { name: /Pine Residence/ }));
    await menu.getByRole('img', { name: /forest/ }).waitFor();
    await at(5.05);
    await hover(menu.getByRole('button', { name: /Limestone Chapel/ }));
    await menu.getByRole('img', { name: /chapel/ }).waitFor();
    await at(6.4);
    await glide(260, 410);
    await menu.waitFor({ state: 'hidden' });
    await at(7.8);
    await session.send('Page.stopScreencast');

    const startSeconds = start / 1000;
    const captured = frames.filter(({ time }) => time >= startSeconds && time < startSeconds + duration);
    if (captured.length < 30) throw new Error(`Only ${captured.length} motion frames were captured`);
    return captured;
  } finally {
    await page.close();
  }
}

async function renderReel(captured, temporary, publicDir) {
  for (const [index, frame] of captured.entries()) {
    await writeFile(join(publicDir, `frame-${index}.jpg`), Buffer.from(frame.data, 'base64'));
  }

  let index = 0;
  const frames = Array.from({ length: duration * fps }, (_, frame) => {
    const time = captured[0].time + frame / fps;
    while (index + 1 < captured.length && captured[index + 1].time <= time) index++;
    return `frame-${index}.jpg`;
  });
  const inputProps = { frames };
  const serveUrl = await bundle({
    entryPoint: fileURLToPath(new URL('../remotion/index.jsx', import.meta.url)),
    publicDir,
    outDir: join(temporary, 'bundle'),
    onProgress: () => {},
  });
  const composition = await selectComposition({ serveUrl, id: 'AtelierReel', inputProps, browserExecutable });
  await renderMedia({
    composition,
    serveUrl,
    inputProps,
    browserExecutable,
    outputLocation: join(output, 'atelier-dribbble.mp4'),
    codec: 'h264',
    crf: 17,
    concurrency: 2,
  });
  const coverProps = { frames: ['cover.png'] };
  const cover = await selectComposition({ serveUrl, id: 'AtelierReel', inputProps: coverProps, browserExecutable });
  await renderStill({
    composition: cover,
    serveUrl,
    inputProps: coverProps,
    browserExecutable,
    frame: 0,
    imageFormat: 'png',
    output: join(output, 'atelier-cover.png'),
  });
}

await mkdir(output, { recursive: true });
const temporary = await mkdtemp(join(tmpdir(), 'atelier-capture-'));
try {
  const publicDir = join(temporary, 'public');
  await mkdir(publicDir);
  const browser = await chromium.launch({ executablePath: browserExecutable });
  let captured;
  try {
    captured = await captureMotion(browser);
    await captureCover(browser, publicDir);
  } finally {
    await browser.close();
  }
  console.log(`Captured ${captured.length} Chromium frames. Rendering with Remotion.`);
  await renderReel(captured, temporary, publicDir);
  console.log(`Exported the cover and ${duration}s reel to ${output}`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
