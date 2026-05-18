import { expect, test } from '@playwright/test';

const STATIC_PAGES = [
  { url: '/', name: 'Accueil' },
  { url: '/recherche-territoire', name: 'Rechercher son territoire' },
  { url: '/ressources', name: 'Ressources' },
  { url: '/accessibilite', name: 'Accessibilité' },
  { url: '/budget', name: 'Budget' },
  { url: '/mentions-legales', name: 'Mentions légales' },
  { url: '/plan-du-site', name: 'Plan du site' },
  {
    url: '/politique-de-confidentialite',
    name: 'Politique de confidentialité'
  },
  { url: '/politique-des-cookies', name: 'Politique des cookies' }
];

for (const { url, name } of STATIC_PAGES) {
  test(`${name} (${url}) charge sans erreur`, async ({ page }) => {
    const response = await page.goto(url);

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('text="Something went wrong"')).not.toBeVisible();
    await expect(page.locator('text="404"')).not.toBeVisible();
    await expect(page.locator('h1:visible').first()).toBeAttached();
  });
}
