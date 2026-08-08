import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('Estonian home is semantic and switches to the equivalent English page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'et');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Üks hingetõmme. Mitu maailma.');
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    'https://apneasport.ee/en/',
  );
  await page.locator('.language-switcher').click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('One breath. Many worlds.');
});

test('document archive filters without blocking no-JS content', async ({ page }) => {
  await page.goto('/dokumendid/');
  await expect(page.locator('[data-document]')).toHaveCount(2);
  await page.getByRole('searchbox').fill('eetikakoodeks');
  await expect(page.locator('[data-document]:visible')).toHaveCount(1);
  await expect(page.getByText('Eetikakoodeks / Code of Ethics')).toBeVisible();
});

test('reduced motion keeps the static hero and skips canvas enhancement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForTimeout(1_600);
  await expect(page.locator('[data-depth-root]')).not.toHaveAttribute('data-enhanced', 'true');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('core content stays visible without client-side JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Vabasukeldumine', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Allveevõitlus/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Merineitsisport', exact: true })).toBeVisible();
  await context.close();
});

test('key pages have no serious automated accessibility violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['/', '/en/', '/dokumendid/', '/spordialad/vabasukeldumine/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact ?? ''),
      ),
    ).toEqual([]);
  }
});
