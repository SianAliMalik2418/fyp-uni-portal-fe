import { expect, test } from '@playwright/test'

const adminUser = {
  id: 'admin-1',
  name: 'Sian Admin',
  email: 'admin@example.com',
  role: 'admin',
  accountStatus: 'active',
  isActive: true,
  passwordChangeRequired: false,
}

test('logs in with email/password and shows the admin portal shell', async ({ page }) => {
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Authentication required' }),
    })
  })

  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        user: adminUser,
        expiresAt: '2030-01-01T00:00:00.000Z',
      }),
    })
  })

  await page.goto('/')

  await expect(page.getByLabel('Email')).toBeVisible()
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill('temporary-password')
  await page.getByRole('button', { name: 'Login' }).click()

  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Students' })).toBeVisible()
  await expect(page.getByText('Admin protected area')).toBeVisible()
})
