import { test, expect } from '@playwright/test';

test('verify about page content', async ({ page }) => {
  await page.goto('http://localhost:3001/about');

  // Wait for the main heading
  await expect(page.locator('h1')).toContainText('О нас');

  // Check for history section
  await expect(page.locator('h2').filter({ hasText: 'Наша история' })).toBeVisible();

  // Check for achievements
  await expect(page.locator('text=100% Безопасность')).toBeVisible();

  // Check for staff
  await expect(page.locator('text=Кортиева Лела Л.')).toBeVisible();
  await expect(page.locator('text=Елена Бигаева')).toBeVisible();
  await expect(page.locator('text=Дмитрий Техников')).toBeVisible();

  // Check for PMC Vector in footer or trust section
  await expect(page.locator('text=ЧВК ВЕКТОР')).toBeVisible();
});
