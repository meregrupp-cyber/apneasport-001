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
  await expect(page.getByRole('heading', { name: 'Veevõitlus', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Merineitsisport', exact: true })).toBeVisible();
  await context.close();
});

test('athlete name opens that athlete profile dialog and returns focus on close', async ({
  page,
}) => {
  await page.goto('/spordialad/vabasukeldumine/');
  const names = page.locator('.athlete-name-button');
  await expect(names.first()).toBeEnabled();

  const melnikov = names.filter({ hasText: 'MELNIKOV' });
  await melnikov.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { level: 2 })).toContainText('Dmitri MELNIKOV');
  await expect(dialog).toContainText('AIDA athlete');
  await expect(dialog).toContainText('INACTIVE');
  await expect(dialog.getByRole('rowheader')).toHaveCount(8);
  // Confirmed AIDA personal best and national record reach the dialog.
  await expect(dialog).toContainText('7:43');
  await expect(dialog).toContainText('DYN 272 m');
  await expect(page).toHaveURL(/\/spordialad\/vabasukeldumine\/$/);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(melnikov).toBeFocused();

  // An athlete with no confirmed AIDA data shows em dashes, never a guess.
  await names.filter({ hasText: 'PEDAK' }).click();
  const pedak = page.getByRole('dialog');
  await expect(pedak.getByRole('heading', { level: 2 })).toContainText('Kristin PEDAK');
  await expect(pedak).not.toContainText(/\b(null|undefined|N\/A)\b/);
  await page.getByRole('button', { name: 'Sulge sportlase profiil' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
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
