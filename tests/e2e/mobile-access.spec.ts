import { expect, test } from '@playwright/test';

test.describe('mobile access smoke test', () => {
  test('login page is usable on small screens without console errors or horizontal overflow', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.goto('/');

    await expect(page).toHaveTitle(/Warungku Stock Management/i);
    await expect(page.getByRole('heading', { name: /Masuk Dashboard/i })).toBeVisible();
    await expect(page.getByPlaceholder('nama@warungbudami.id')).toBeVisible();
    await expect(page.getByPlaceholder('Masukkan password')).toBeVisible();
    await expect(page.getByRole('button', { name: /Masuk ke dashboard/i })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );

    expect(hasHorizontalOverflow).toBe(false);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});
