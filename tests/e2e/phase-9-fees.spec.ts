import { expect, test } from '@playwright/test'
import { mockAuthMe, users } from './helpers/portal-fixtures.js'

const fee = {
  id: 'fee-1',
  student: {
    id: 'student-1',
    fullName: 'Ayesha Noor',
    registrationNumber: 'NCBAE-2026-CS-001',
  },
  semester: {
    id: 'semester-1',
    name: 'Fall Semester',
    academicYear: '2026-2027',
  },
  totalAmount: 100000,
  paidAmount: 40000,
  remainingAmount: 60000,
  dueDate: '2030-09-15',
  paymentDate: '2026-08-10',
  notes: 'First installment received',
  status: 'partially_paid',
}

test.describe('phase 9 - fee information', () => {
  test('admin selects a student and saves a calculated fee record', async ({ page }) => {
    await mockAuthMe(page, users.admin)
    await page.route('**/api/users', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          users: [
            {
              id: 'student-1',
              fullName: 'Ayesha Noor',
              email: 'ayesha@example.com',
              role: 'student',
              registrationNumber: 'NCBAE-2026-CS-001',
              semester: {
                ...fee.semester,
                isActive: true,
                isClosed: false,
              },
              accountStatus: 'active',
              isActive: true,
              passwordChangeRequired: false,
            },
          ],
        }),
      })
    })
    await page.route('**/api/fees/students/student-1', async (route) => {
      if (route.request().method() === 'PUT') {
        expect(route.request().postDataJSON()).toEqual({
          totalAmount: 100000,
          paidAmount: 40000,
          dueDate: '2030-09-15',
          paymentDate: '2026-08-10',
          notes: 'First installment received',
        })
        await route.fulfill({
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Fee information saved', fee }),
        })
        return
      }

      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ fee: null }) })
    })

    await page.goto('/fees')
    await page.getByRole('button', { name: 'Manage fee for Ayesha Noor' }).click()
    await page.getByLabel('Total semester fee').fill('100000')
    await page.getByLabel('Paid amount').fill('40000')
    await page.getByLabel('Due date').fill('2030-09-15')
    await page.getByLabel('Payment date').fill('2026-08-10')
    await page.getByLabel('Notes').fill('First installment received')
    await page.getByRole('button', { name: 'Save fee information' }).click()

    await expect(page.getByRole('heading', { name: 'Fee information saved' })).toBeVisible()
    await expect(page.getByText('PKR 60,000')).toBeVisible()
  })

  test('student sees only their own recorded fee information', async ({ page }) => {
    await mockAuthMe(page, users.student)
    await page.route('**/api/fees/me', async (route) => {
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ fee }) })
    })

    await page.goto('/fees')

    await expect(page.getByText('PKR 100,000')).toBeVisible()
    await expect(page.getByText('PKR 40,000')).toBeVisible()
    await expect(page.getByText('PKR 60,000')).toBeVisible()
    await expect(page.getByText('Partially paid').first()).toBeVisible()
    await expect(page.getByText('First installment received')).toBeVisible()
    await expect(page.getByRole('button', { name: /pay/i })).toHaveCount(0)
  })
})
