import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const baseURL = process.env.SHOWCASE_URL || process.env.ATELIER_URL || 'http://localhost:3000';
const outputDir = process.env.STATIC_QA_OUTPUT || 'artifacts/static-qa';
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];
const report = { url: baseURL, generatedAt: new Date().toISOString(), mode: 'static-only', results: [] };
let browser;
let errorCount = 0;

try {
  await mkdir(outputDir, { recursive: true });
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 45_000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images).map(img => img.complete ? Promise.resolve() : new Promise(resolve => { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true }); })));
    });
    const findings = await page.evaluate(() => {
      const doc = document.documentElement;
      const images = [...document.images];
      return {
        title: document.title,
        horizontalOverflowPx: Math.max(0, doc.scrollWidth - window.innerWidth),
        brokenImages: images.filter(img => !img.complete || (img.currentSrc && img.naturalWidth === 0)).map(img => img.currentSrc || img.src),
        missingImageAlt: images.filter(img => !img.hasAttribute('alt')).map(img => img.currentSrc || img.src),
        h1Count: document.querySelectorAll('h1').length,
        emptyLinks: [...document.querySelectorAll('a')].filter(a => !a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]')).length,
      };
    });
    const screenshot = join(outputDir, `${viewport.name}-${viewport.width}x${viewport.height}.png`);
    await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
    const problems = [
      ...(response && !response.ok() ? [`HTTP ${response.status()}`] : []),
      ...(findings.horizontalOverflowPx ? [`Horizontal overflow: ${findings.horizontalOverflowPx}px`] : []),
      ...(findings.brokenImages.length ? [`${findings.brokenImages.length} broken image(s)`] : []),
      ...(findings.missingImageAlt.length ? [`${findings.missingImageAlt.length} img missing alt attribute(s)`] : []),
      ...(findings.h1Count !== 1 ? [`Expected 1 h1; found ${findings.h1Count}`] : []),
      ...(findings.emptyLinks ? [`${findings.emptyLinks} unlabeled link(s)`] : []),
      ...errors.map(x => `Browser exception: ${x}`),
    ];
    errorCount += problems.length;
    report.results.push({ viewport, screenshot, findings, problems });
    console.log(`${viewport.name}: ${problems.length ? problems.join('; ') : 'basic checks passed'} | ${screenshot}`);
    await page.close();
  }
} catch (error) {
  errorCount++;
  report.fatalError = error instanceof Error ? error.message : String(error);
  console.error(report.fatalError);
} finally {
  if (browser) await browser.close();
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
}
if (errorCount) process.exitCode = 1;
