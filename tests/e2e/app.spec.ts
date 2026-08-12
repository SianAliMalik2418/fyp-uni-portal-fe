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
  await page.getByLabel(/^Password$/).fill('temporary-password')
  await page.getByRole('button', { name: 'Login' }).click()

  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Students' })).toBeVisible()
  await expect(page.getByText('Admin protected area')).toBeVisible()
})

test('opens the profile menu and logs out', async ({ page }) => {
  let isLoggedIn = true

  await page.route('**/api/auth/me', async (route) => {
    if (!isLoggedIn) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Authentication required' }),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ user: adminUser }),
    })
  })

  await page.route('**/api/auth/logout', async (route) => {
    isLoggedIn = false

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Logout successful' }),
    })
  })

  await page.goto('/')

  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible()
  await page.getByRole('button', { name: 'Open profile menu' }).click()
  await page.getByText(/^Logout$/).click()

  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
})

test('updates the admin attendance threshold', async ({ page }) => {
  let minimumAttendancePercentage = 75

  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ user: adminUser }),
    })
  })

  await page.route('**/api/attendance/configuration', async (route) => {
    if (route.request().method() === 'PUT') {
      const payload = route.request().postDataJSON() as {
        minimumAttendancePercentage: number
      }
      minimumAttendancePercentage = payload.minimumAttendancePercentage
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Attendance settings updated.',
        configuration: { minimumAttendancePercentage },
      }),
    })
  })

  await page.goto('/attendance')

  const input = page.getByLabel('Minimum attendance percentage')
  await expect(input).toHaveValue('75')
  await input.fill('80')
  await page.getByRole('button', { name: 'Save setting' }).click()

  await expect(input).toHaveValue('80')
  await expect(page.getByText('The minimum attendance requirement is now 80%.')).toBeVisible()
  expect(minimumAttendancePercentage).toBe(80)
})
