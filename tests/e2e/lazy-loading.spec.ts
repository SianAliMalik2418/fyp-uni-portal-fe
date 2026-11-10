import { expect, test } from '@playwright/test'

test('login does not download authenticated portal modules', async ({ page }) => {
  await page.route('**/api/auth/me', (route) => route.fulfill({ json: { user: null } }))
  const portalRequests: string[] = []
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.includes('/features/portal/pages/PortalPage')) {
      portalRequests.push(request.url())
    }
  })
  await page.goto('/')
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  expect(portalRequests).toEqual([])
})

test('a failed screen download keeps navigation available and can be reloaded', async ({
  page,
}) => {
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({
      json: {
        user: {
          id: 'student-1',
          name: 'Student',
          email: 'student@example.com',
          role: 'student',
          accountStatus: 'active',
          isActive: true,
          passwordChangeRequired: false,
        },
      },
    })
  )
  await page.route('**/api/notifications', (route) =>
    route.fulfill({ json: { notifications: [], unreadCount: 0 } })
  )
  await page.route('**/api/exams/me/student', (route) => route.fulfill({ json: { exams: [] } }))
  const screenModule = '**/src/features/exams/pages/ExamsPage.tsx'
  await page.route(screenModule, (route) => route.abort('failed'))
  await page.goto('/exams')
  await expect(page.getByRole('navigation', { name: 'Student navigation' })).toBeVisible()
  await expect(page.getByRole('alert')).toContainText("This page didn't load")
  await page.unroute(screenModule)
  await page.getByRole('button', { name: 'Reload page' }).click()
  await expect(page.getByRole('heading', { name: 'Exams' })).toBeVisible()
  await expect(page.getByText('No exams have been scheduled for your courses yet.')).toBeVisible()
})
