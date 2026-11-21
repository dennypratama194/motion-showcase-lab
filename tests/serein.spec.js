import { expect, test } from '@playwright/test';

test('shows the hero and switches between all three classes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Move with intention.' })).toBeVisible();
  await expect.poll(() => page.locator('.hero-visual img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('link', { name: 'Explore the classes' }).click();
  await expect(page).toHaveURL(/#classes$/);
  const tab = page.getByRole('tab', { name: /Mat Pilates/ });
  await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('45 min');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Private Sessions/ })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('One to one');
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: /Reformer/ })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('50 min');
});

test('fits a 320px screen and opens first-visit guidance', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.getByRole('link', { name: 'Studio', exact: true }).click();
  await expect(page).toHaveURL(/#studio$/);
  await expect.poll(() => page.locator('.studio-visual img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('link', { name: 'Your first visit', exact: true }).click();
  await page.getByText('What should I bring?', { exact: true }).click();
  await expect(page.getByText(/Wear comfortable clothing/)).toBeVisible();
});
