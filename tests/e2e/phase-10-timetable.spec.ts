import { expect, test } from '@playwright/test'
import {
  mockAuthMe,
  mockReferenceData,
  offering,
  section,
  users,
} from './helpers/portal-fixtures.js'

const timetableEntry = {
  id: 'timetable-entry-1',
  dayOfWeek: 'monday',
  startTime: '09:00',
  endTime: '10:30',
  room: 'Lab 1',
  slotType: 'lecture',
  notes: 'Bring your lab manuals',
  courseOffering: offering,
}

function timetable(status: 'draft' | 'published') {
  return {
    id: `timetable-${status}`,
    section,
    status,
    version: 1,
    notes: 'Fall teaching schedule',
    publishedAt: status === 'published' ? '2026-08-17T09:00:00.000Z' : null,
    entries: [timetableEntry],
  }
}

test('admin saves a configurable timetable draft before publishing it', async ({ page }) => {
  await mockAuthMe(page, users.admin)
  await mockReferenceData(page)

  let draftTimetable: ReturnType<typeof timetable> | null = null
  let publishedTimetable: ReturnType<typeof timetable> | null = null

  await page.route('**/api/timetable/sections/*/draft', async (route) => {
    const payload = route.request().postDataJSON() as {
      entries: Array<{ courseOfferingId: string; room: string }>
      notes?: string
    }

    expect(payload.entries[0]).toMatchObject({
      courseOfferingId: offering.id,
      room: 'Lab 1',
    })
    draftTimetable = timetable('draft')
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Timetable draft saved', timetable: draftTimetable }),
    })
  })

  await page.route('**/api/timetable/sections/*/publish', async (route) => {
    expect(draftTimetable).not.toBeNull()
    publishedTimetable = timetable('published')
    draftTimetable = null
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Timetable published', timetable: publishedTimetable }),
    })
  })

  await page.route('**/api/timetable/sections/*', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        section,
        availableCourseOfferings: [offering],
        draftTimetable,
        publishedTimetable,
      }),
    })
  })

  await page.goto('/timetables')

  const publishButton = page.getByRole('button', { name: 'Publish timetable' })
  await expect(page.getByText('Schedule editor', { exact: true })).toBeVisible()
  await expect(publishButton).toBeDisabled()
  await expect(page.getByText('Save a draft before publishing')).toBeVisible()

  await page.getByRole('combobox', { name: 'Course offering 1' }).click()
  await page.getByRole('option', { name: /programming fundamentals/i }).click()
  await page.getByLabel('Room').fill('Lab 1')
  await page.getByLabel('Slot notes').fill('Bring your lab manuals')
  await page.getByRole('button', { name: 'Save draft' }).click()

  await expect(page.getByRole('heading', { name: 'Timetable draft saved' })).toBeVisible()
  await expect(publishButton).toBeEnabled()
  await publishButton.click()

  await expect(page.getByRole('heading', { name: 'Timetable published' })).toBeVisible()
  await expect(page.getByText('Current published timetable', { exact: true })).toBeVisible()
  await expect(page.getByText('Programming Fundamentals').first()).toBeVisible()
  await expect(page.getByText('Room: Lab 1')).toBeVisible()
})

test('student sees only the published timetable returned for their section', async ({ page }) => {
  await mockAuthMe(page, users.student)
  await page.route('**/api/timetable/me/student', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ timetable: timetable('published') }),
    })
  })

  await page.goto('/timetable')

  await expect(page.getByRole('heading', { name: 'Timetable' })).toBeVisible()
  await expect(page.getByText('Programming Fundamentals').first()).toBeVisible()
  await expect(page.getByText('Teacher: Tayabba Teacher')).toBeVisible()
  await expect(page.getByText('09:00 - 10:30')).toBeVisible()
})

test('teacher sees only timetable slots returned for current course assignments', async ({
  page,
}) => {
  await mockAuthMe(page, users.teacher)
  await page.route('**/api/timetable/me/teacher', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ timetables: [timetable('published')] }),
    })
  })

  await page.goto('/timetable')

  await expect(page.getByRole('heading', { name: 'Timetable' })).toBeVisible()
  await expect(page.getByText('Programming Fundamentals').first()).toBeVisible()
  await expect(page.getByText('Room: Lab 1')).toBeVisible()
  await expect(page.getByText('Teacher: Tayabba Teacher')).toHaveCount(0)
})
