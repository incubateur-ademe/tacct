import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display main content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main, #main-content')).toBeVisible();
  });
});

test.describe('Recherche territoire', () => {
  test('should load the search page', async ({ page }) => {
    await page.goto('/recherche-territoire');
    await expect(page).toHaveURL(/recherche-territoire/);
  });

  test('should load the patch4 search page', async ({ page }) => {
    await page.goto('/recherche-territoire-patch4');
    await expect(page).toHaveURL(/recherche-territoire-patch4/);
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('Données territoire', () => {
  test('should load donnees page for PNR de Camargue', async ({ page }) => {
    await page.goto(
      '/donnees?code=FR8000011&libelle=PNR%20de%20Camargue&type=pnr&thematique=Gestion%20des%20risques'
    );
    await expect(page).toHaveURL(/donnees/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load patch4c page for PNR de Camargue', async ({ page }) => {
    await page.goto(
      '/patch4c?code=FR8000011&libelle=PNR%20de%20Camargue&type=pnr'
    );
    await expect(page).toHaveURL(/patch4c/);
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('Ressources', () => {
  test('should load ressources index', async ({ page }) => {
    await page.goto('/ressources');
    await expect(page).toHaveURL(/ressources/);
    await expect(page.locator('main h1').first()).toBeAttached();
  });

  test('should load demarrer-diagnostic-vulnerabilite', async ({ page }) => {
    await page.goto('/ressources/demarrer-diagnostic-vulnerabilite');
    await expect(page).toHaveURL(/demarrer-diagnostic-vulnerabilite/);
    await expect(page.locator('main h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('should load analyser-diagnostic-vulnerabilite', async ({ page }) => {
    await page.goto(
      '/ressources/demarrer-diagnostic-vulnerabilite/analyser-diagnostic-vulnerabilite'
    );
    await expect(page).toHaveURL(/analyser-diagnostic-vulnerabilite/);
    await expect(page.locator('main h1').first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Pages statiques', () => {
  test('accessibilite should load', async ({ page }) => {
    await page.goto('/accessibilite');
    await expect(page).toHaveURL(/accessibilite/);
    await expect(page.locator('main h1').first()).toBeVisible();
  });

  test('mentions-legales should load', async ({ page }) => {
    await page.goto('/mentions-legales');
    await expect(page).toHaveURL(/mentions-legales/);
    await expect(page.locator('main h1').first()).toBeVisible();
  });

  test('budget should load', async ({ page }) => {
    await page.goto('/budget');
    await expect(page).toHaveURL(/budget/);
    await expect(page.locator('main h1').first()).toBeVisible();
  });
});

test.describe('Erreurs', () => {
  test('should show 404 page for unknown routes', async ({ page }) => {
    const response = await page.goto('/cette-page-nexiste-pas');
    expect(response?.status()).toBe(404);
  });
});
