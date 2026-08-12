import { expect, test } from '@playwright/test'
import { mockAuthMe, users } from './helpers/portal-fixtures'

test.describe('phase 1 - basic project user flow', () => {
  for (const [role, portalUser] of Object.entries(users)) {
    test(`${role} account opens the correct role navigation`, async ({ page }) => {
      await mockAuthMe(page, portalUser)

      await page.goto('/')

      await expect(
        page.getByRole('navigation', { name: new RegExp(`${role} navigation`, 'i') })
      ).toBeVisible()
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    })
  }

  test('blocks a student from opening admin-only sections', async ({ page }) => {
    await mockAuthMe(page, users.student)

    await page.goto('/students')

    await expect(page.getByText('Access blocked')).toBeVisible()
    await expect(page.getByText(/Student accounts cannot access "students"/)).toBeVisible()
  })

  test('forces temporary password change before portal access', async ({ page }) => {
    const temporaryUser = {
      ...users.student,
      passwordChangeRequired: true,
    }
    let submittedPayload: unknown

    await mockAuthMe(page, temporaryUser)
    await page.route('**/api/auth/change-password', async (route) => {
      submittedPayload = route.request().postDataJSON()
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          user: { ...temporaryUser, passwordChangeRequired: false },
        }),
      })
    })

    await page.goto('/')

    await expect(page.getByText('Change temporary password')).toBeVisible()
    await page.getByLabel('Current temporary password').fill('@Abc1234')
    await page.getByLabel('New password').fill('Permanent123!')
    await page.getByLabel('Confirm password').fill('Permanent123!')
    await page.getByRole('button', { name: 'Update password' }).click()

    await expect(page.getByRole('navigation', { name: 'Student navigation' })).toBeVisible()
    expect(submittedPayload).toEqual({
      currentPassword: '@Abc1234',
      newPassword: 'Permanent123!',
      confirmPassword: 'Permanent123!',
    })
  })

  test('blocks inactive account login', async ({ page }) => {
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Authentication required' }),
      })
    })
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Account is inactive.' }),
      })
    })

    await page.goto('/')
    await page.getByLabel('Email').fill('inactive@example.com')
    await page.getByLabel(/^Password$/).fill('@Abc1234')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('alert')).toContainText('Inactive account')
    await expect(page.getByRole('alert')).toContainText('Account is inactive.')
  })
})
