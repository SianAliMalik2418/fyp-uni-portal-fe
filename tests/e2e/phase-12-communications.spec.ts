import { expect, test } from '@playwright/test'
import { mockAuthMe, users } from './helpers/portal-fixtures.js'

const announcement = {
  id: 'announcement-1',
  title: 'Registration deadline',
  description: 'Complete your semester registration before Friday.',
  publishDate: '2026-08-17T08:00:00.000Z',
  expiryDate: '2026-08-25T08:00:00.000Z',
  isPinned: true,
  isActive: true,
}

test('admin creates and manages announcements', async ({ page }) => {
  await mockAuthMe(page, users.admin)
  let announcements: (typeof announcement)[] = []
  await page.route('**/api/notifications', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify({ notifications: [] }) })
  )
  await page.route('**/api/announcements?*', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        announcements,
        page: 1,
        limit: 20,
        total: announcements.length,
        totalPages: 1,
      }),
    })
  )
  await page.route('**/api/announcements', async (route) => {
    announcements = [announcement]
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Announcement created.', announcement }),
    })
  })

  await page.goto('/announcements')
  await page.getByRole('button', { name: 'Create announcement' }).click()
  await page.getByLabel('Title').fill(announcement.title)
  await page.getByLabel('Description').fill(announcement.description)
  await page.getByLabel('Publish date').fill('2026-08-17T08:00')
  await page.getByLabel('Expiry date').fill('2026-08-25T08:00')
  await page.getByRole('checkbox', { name: 'Pin announcement' }).click()
  await page.getByRole('button', { name: 'Create announcement' }).last().click()

  await expect(page.getByRole('heading', { name: 'Announcement created' })).toBeVisible()
  await expect(page.getByText(announcement.title)).toBeVisible()
  await expect(page.getByText('Pinned')).toBeVisible()
  await expect(page.getByRole('button', { name: `Edit ${announcement.title}` })).toBeVisible()
})

test('all users can read announcements and manage notification read state', async ({ page }) => {
  await mockAuthMe(page, users.student)
  let isRead = false
  await page.route('**/api/announcements?*', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        announcements: [announcement],
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      }),
    })
  )
  await page.route('**/api/notifications', async (route) => {
    if (route.request().method() === 'PATCH') {
      isRead = true
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'All notifications marked as read.', updatedCount: 1 }),
      })
      return
    }
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        notifications: [
          {
            id: 'notification-1',
            type: 'attendance_updated',
            title: 'Attendance updated',
            message: 'Your attendance for 2026-08-17 has been updated.',
            resourcePath: '/attendance',
            isRead,
          },
        ],
      }),
    })
  })
  await page.route('**/api/notifications/read-all', async (route) => {
    isRead = true
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ message: 'All notifications marked as read.', updatedCount: 1 }),
    })
  })

  await page.goto('/announcements')
  await expect(page.getByText(announcement.title)).toBeVisible()
  await expect(page.getByRole('button', { name: `Edit ${announcement.title}` })).toHaveCount(0)

  await page.getByLabel('Notifications, 1 unread').click()
  await expect(page.getByText('Attendance updated')).toBeVisible()
  await page.getByRole('button', { name: 'Mark all as read' }).click()
  await expect(page.getByLabel('Notifications, 0 unread')).toBeVisible()
})
