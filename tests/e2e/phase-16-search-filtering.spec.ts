import { expect, test } from '@playwright/test'
import { academicStudent, mockAuthMe, mockReferenceData, users } from './helpers/portal-fixtures.js'

test.describe('phase 16 - search and filtering', () => {
  test('admin student search uses the server query and replaces the visible results', async ({
    page,
  }) => {
    await mockAuthMe(page, users.admin)
    await mockReferenceData(page)
    await page.route('**/api/users?*', async (route) => {
      const search = new URL(route.request().url()).searchParams.get('search')
      const student =
        search === 'zara'
          ? {
              ...academicStudent,
              id: 'student-2',
              fullName: 'Zara Khan',
              email: 'zara@example.com',
              registrationNumber: 'NCBAE-2026-CS-002',
              role: 'student',
              accountStatus: 'active',
              passwordChangeRequired: false,
            }
          : {
              ...academicStudent,
              fullName: academicStudent.name,
              email: 'ayesha@example.com',
              role: 'student',
              accountStatus: 'active',
              passwordChangeRequired: false,
            }

      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          users: [student],
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        }),
      })
    })

    await page.goto('/students', { waitUntil: 'domcontentloaded' })

    await expect(page.getByText(academicStudent.name)).toBeVisible()
    await page.getByPlaceholder('Search students').fill('zara')
    await expect(page.getByText('Zara Khan')).toBeVisible()
    await expect(page.getByText(academicStudent.name)).toBeHidden()
  })
})
