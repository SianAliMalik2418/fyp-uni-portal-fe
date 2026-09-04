import { expect, test } from '@playwright/test'
import { mockAuthMe, users } from './helpers/portal-fixtures.js'

test.describe('phase 18 - AI academic assistant', () => {
  test('student asks a grounded question and a contextual follow-up on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockPortalShell(page, users.student)
    const requests: Array<{ message: string; conversation: unknown[] }> = []
    await page.route('**/api/ai-assistant/chat', async (route) => {
      const request = route.request().postDataJSON() as {
        message: string
        conversation: unknown[]
      }
      requests.push(request)
      const answer = requests.length === 1 ? 'Your CGPA is 3.1.' : 'Your term GPA is 3.2.'
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          answer,
          grounded: true,
          knowledgeKeys: [],
          contextSections: ['gpa'],
        }),
      })
    })

    await page.goto('/announcements')
    await page.getByRole('button', { name: 'Open AI academic assistant' }).click()

    const dialog = page.getByRole('dialog', { name: 'AI academic assistant' })
    await expect(dialog).toBeVisible()
    const bounds = await dialog.boundingBox()
    expect(bounds?.x).toBeGreaterThanOrEqual(0)
    expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(390)

    await page.getByRole('button', { name: 'What is my CGPA?' }).click()
    await expect(dialog.getByText('Your CGPA is 3.1.')).toBeVisible()

    await page.getByLabel('Ask the AI academic assistant').fill('What about this term?')
    await page.getByRole('button', { name: 'Send question' }).click()
    await expect(dialog.getByText('Your term GPA is 3.2.')).toBeVisible()
    expect(requests).toEqual([
      { message: 'What is my CGPA?', conversation: [] },
      {
        message: 'What about this term?',
        conversation: [
          { role: 'user', content: 'What is my CGPA?' },
          { role: 'assistant', content: 'Your CGPA is 3.1.' },
        ],
      },
    ])

    await page.getByRole('button', { name: 'Clear conversation' }).click()
    await expect(dialog.getByText('Ask about your academic information')).toBeVisible()
  })

  test('non-student roles do not receive the chatbot entry point', async ({ page }) => {
    await mockPortalShell(page, users.teacher)
    await page.goto('/announcements')

    await expect(page.getByRole('button', { name: 'Open AI academic assistant' })).toHaveCount(0)
  })
})

async function mockPortalShell(
  page: Parameters<typeof mockAuthMe>[0],
  user: (typeof users)[keyof typeof users]
) {
  await mockAuthMe(page, user)
  await page.route('**/api/notifications', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ notifications: [], unreadCount: 0 }),
    })
  })
  await page.route('**/api/announcements', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ announcements: [], page: 1, limit: 20, total: 0, totalPages: 0 }),
    })
  })
}
