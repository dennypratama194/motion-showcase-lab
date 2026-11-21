import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const url = process.env.ATELIER_URL || 'http://localhost:3000';
const output = resolve(process.env.ATELIER_OUTPUT || 'artifacts');
const duration = 8;
const temporary = await mkdtemp(join(tmpdir(), 'atelier-capture-'));
await mkdir(output, { recursive: true });

try {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const cover = await browser.newPage({ viewport: { width: 1600, height: 1200 }, reducedMotion: 'reduce' });
    await cover.goto(url);
    await cover.locator('.hero-image').evaluate((image) => image.decode());
    await cover.screenshot({ path: join(output, 'atelier-cover.png') });
    await cover.close();

    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    // Warm the assets and application so the capture starts with the entrance.
    await page.goto(url);
    await page.evaluate(async () => {
      const paths = ['/images/still-house.webp', '/images/pine-residence.webp', '/images/limestone-chapel.webp'];
      await Promise.all(paths.map(async (path) => {
        const image = new Image();
        image.src = path;
        await image.decode();
      }));
    });
    const session = await page.context().newCDPSession(page);
    const frames = [];
    session.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
      if (metadata.timestamp) frames.push({ data, time: metadata.timestamp });
      void session.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
    });
    await session.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1440, maxHeight: 1000 });
    const start = Date.now();
    const at = (seconds) => delay(Math.max(0, start + seconds * 1000 - Date.now()));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await at(2.45);
    await page.getByRole('button', { name: 'Projects' }).click();
    const nav = page.getByRole('navigation', { name: 'Project index' });
    await at(3.70);
    await nav.getByRole('button', { name: /Pine Residence/ }).hover();
    await at(4.95);
    await nav.getByRole('button', { name: /Limestone Chapel/ }).hover();
    await at(6.20);
    await page.getByRole('button', { name: 'Projects' }).click();
    await nav.waitFor({ state: 'hidden' });
    await session.send('Page.stopScreencast');
    const settled = await page.screenshot({ type: 'jpeg', quality: 92 });
    frames.push({ data: settled.toString('base64'), time: Date.now() / 1000 });

    const startSeconds = start / 1000;
    const captured = frames.filter(({ time }) => time >= startSeconds && time < startSeconds + duration);
    if (captured.length < 30) throw new Error(`Only ${captured.length} motion frames were captured`);
    const entries = [];
    for (const [index, frame] of captured.entries()) {
      const filename = `frame-${index}.jpg`;
      await writeFile(join(temporary, filename), Buffer.from(frame.data, 'base64'));
      const nextTime = captured[index + 1]?.time ?? (captured[0].time + duration);
      entries.push(`file '${filename}'\noption framerate 60\nduration ${nextTime - frame.time}`);
    }
    await writeFile(join(temporary, 'frames.txt'), entries.join('\n'));
    execFileSync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', join(temporary, 'frames.txt'),
      '-vf', 'fps=30,tpad=stop_mode=clone:stop_duration=8', '-t', String(duration), '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
      '-crf', '17', '-movflags', '+faststart', join(output, 'atelier-dribbble.mp4'),
    ], { stdio: 'inherit' });
    console.log(`Exported the cover and ${duration}s browser recording to ${output}`);
  } finally {
    await browser.close();
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
