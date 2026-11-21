import { expect, test } from '@playwright/test';

test('reveals the hero, previews a project on hover and closes the index', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const heading = page.getByRole('heading', { name: 'Architecture in its quietest form.' });
  await expect(heading).toBeVisible();
  const { curtainEnd, textStarts } = await page.evaluate(() => {
    const toMilliseconds = (time) => Number.parseFloat(time) * (time.endsWith('ms') ? 1 : 1000);
    const curtainEnd = Math.max(...Array.from(document.querySelectorAll('.hero-mask, .hero-image'), (element) => {
      const style = getComputedStyle(element);
      return toMilliseconds(style.animationDelay) + toMilliseconds(style.animationDuration);
    }));
    const textStarts = Array.from(document.querySelectorAll('.intro-detail, .hero-word, .hero-caption'),
      (element) => toMilliseconds(getComputedStyle(element).animationDelay));
    return { curtainEnd, textStarts };
  });
  expect(curtainEnd).toBeGreaterThan(0);
  expect(textStarts).toHaveLength(7);
  expect(Math.min(...textStarts)).toBeGreaterThan(curtainEnd);
  await expect.poll(() => page.locator('.hero-mask').evaluate((element) => getComputedStyle(element).clipPath)).toBe('none');
  const hero = page.getByRole('region', { name: 'Featured project' });
  await expect.poll(() => hero.getByRole('img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);

  const index = page.getByRole('button', { name: 'Projects' });
  await index.hover();
  const nav = page.getByRole('navigation', { name: 'Project index' });
  await expect(nav).toBeVisible();
  await nav.getByRole('button', { name: /Pine Residence/ }).hover();
  await expect(index).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.getByRole('img')).toHaveAccessibleName('A dark concrete residence at the edge of a pine forest');
  await expect(nav.getByText('Oslo, Norway')).toBeVisible();
  await page.mouse.move(4, 200);
  await expect(page.locator('#project-index')).toBeHidden();
  await index.hover();
  await expect(nav).toBeVisible();
  await page.locator('.menu-backdrop').click({ position: { x: 4, y: 30 } });
  await expect(page.locator('#project-index')).toBeHidden();
  await expect(index).toHaveAttribute('aria-expanded', 'false');
  await expect(hero.getByRole('link', { name: 'The Still House', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('supports keyboard navigation, returning focus on Escape and selecting a project', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const index = page.getByRole('button', { name: 'Projects' });
  await expect(index).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /The Still House/ })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /Pine Residence/ })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(index).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Pine Residence' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Featured project' })).toBeFocused();
});

test('fits a narrow touch viewport and cycles projects', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 320, height: 700 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  try {
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
    expect(await page.locator('.hero-image').boundingBox()).toEqual({ x: 0, y: 0, width: 320, height: 700 });
    const cta = page.getByRole('link', { name: 'View project' });
    await expect(cta).toBeInViewport({ ratio: 1 });
    await cta.tap();
    await expect(page).toHaveURL(/#project-detail$/);
    await page.goto('/');
    await page.getByRole('button', { name: 'Projects' }).tap();
    const nav = page.getByRole('navigation', { name: 'Project index' });
    await expect(nav.getByRole('button')).toHaveCount(4);
    await nav.getByRole('button', { name: /The Desert Court/ }).tap();
    await expect(page.getByRole('heading', { name: 'The Desert Court' })).toBeVisible();
    await page.getByRole('button', { name: 'Next project' }).tap();
    await expect(page.getByRole('heading', { name: 'The Still House', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Previous project' }).tap();
    await expect(page.getByRole('heading', { name: 'The Desert Court' })).toBeVisible();
  } finally {
    await page.close();
  }
});
