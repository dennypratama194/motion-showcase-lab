import { expect, test } from '@playwright/test';

test('reveals the hero, previews a project on hover and closes the index', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const heading = page.getByRole('heading', { name: 'Architecture in its quietest form.' });
  await expect(heading).toBeVisible();
  await expect.poll(() => page.locator('.hero-mask').evaluate((element) => getComputedStyle(element).clipPath)).toBe('none');
  const hero = page.getByRole('region', { name: 'Featured project' });
  await expect.poll(() => hero.getByRole('img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);

  const index = page.getByRole('button', { name: 'Projects' });
  await index.click();
  const nav = page.getByRole('navigation', { name: 'Project index' });
  await expect(nav).toBeVisible();
  await nav.getByRole('button', { name: /Pine Residence/ }).hover();
  await expect(nav.getByRole('img')).toHaveAccessibleName('A dark concrete residence at the edge of a pine forest');
  await expect(nav.getByText('Oslo, Norway')).toBeVisible();
  await page.getByRole('button', { name: 'Projects' }).click();
  await expect(nav).toBeHidden();
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
    await page.getByRole('button', { name: /Limestone Chapel/ }).tap();
    await expect(page.getByRole('heading', { name: 'The Limestone Chapel' })).toBeVisible();
    await page.getByRole('button', { name: 'Next project' }).tap();
    await expect(page.getByRole('heading', { name: 'The Still House', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Previous project' }).tap();
    await expect(page.getByRole('heading', { name: 'The Limestone Chapel' })).toBeVisible();
  } finally {
    await page.close();
  }
});
