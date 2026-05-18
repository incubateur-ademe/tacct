import { expect, test } from '@playwright/test';

const TERRITORY = {
  code: '200054781',
  libelle: 'Métropole du Grand Paris',
  type: 'epci'
};

const params = new URLSearchParams({
  code: TERRITORY.code,
  libelle: TERRITORY.libelle,
  type: TERRITORY.type
}).toString();

test('Thématiques - roue systémique charge sans erreur', async ({ page }) => {
  const response = await page.goto(`/thematiques?${params}`);

  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator('text="Something went wrong"')).not.toBeVisible();
});

test('Parcours données - sans thématique', async ({ page }) => {
  const response = await page.goto(`/donnees?${params}`);

  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator('text="Something went wrong"')).not.toBeVisible();
});

const THEMATIQUES = [
  'Agriculture',
  'Aménagement',
  'Biodiversité',
  'Confort thermique',
  'Eau',
  'Forêts',
  'Gestion des risques',
  'Santé'
];

for (const thematique of THEMATIQUES) {
  test(`Parcours données - thématique "${thematique}"`, async ({ page }) => {
    const url = `/donnees?${params}&thematique=${encodeURIComponent(thematique)}`;
    const response = await page.goto(url);

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('text="Something went wrong"')).not.toBeVisible();
  });
}

const THEMATIQUES_IMPACTS = ['Agriculture', 'Confort thermique'];

for (const thematique of THEMATIQUES_IMPACTS) {
  test(`Parcours impacts - thématique "${thematique}"`, async ({ page }) => {
    const url = `/impacts?${params}&thematique=${encodeURIComponent(thematique)}`;
    const response = await page.goto(url);

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('text="Something went wrong"')).not.toBeVisible();
  });
}

test('Parcours Patch4°C charge sans erreur', async ({ page }) => {
  const response = await page.goto(`/patch4c?${params}`);

  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator('text="Something went wrong"')).not.toBeVisible();
});
