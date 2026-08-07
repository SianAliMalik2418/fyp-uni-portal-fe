import { expect, test } from '@playwright/test'

test('loads the starter app and updates the counter', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Get started' })).toBeVisible()
  await page.getByRole('button', { name: /count is 0/i }).click()
  await expect(page.getByRole('button', { name: /count is 1/i })).toBeVisible()
})
