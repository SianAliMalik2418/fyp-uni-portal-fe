import { expect, test } from '@playwright/test'
import {
  academicStudent,
  assessment,
  assessmentStructure,
  mockAuthMe,
  offering,
  users,
} from './helpers/portal-fixtures.js'

test.describe('phase 6 - assessments and marks', () => {
  test('admin configures structure and teacher creates assessment marks draft', async ({
    page,
  }) => {
    let structurePayload: unknown
    let assessmentPayload: unknown
    let marksPayload: unknown

    await mockAuthMe(page, users.admin)
    await page.route('**/api/assessments/structure', async (route) => {
      if (route.request().method() === 'PUT') {
        structurePayload = route.request().postDataJSON()
        await route.fulfill({
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Assessment structure saved.',
            structure: assessmentStructure,
          }),
        })
        return
      }

      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ structure: assessmentStructure }),
      })
    })

    await page.goto('/assessment-structure')
    await expect(page.getByLabel('Assignments')).toHaveValue('15')
    await page.getByLabel('Quizzes').fill('10')
    await page.getByRole('button', { name: 'Save structure' }).click()

    await expect(page.getByRole('heading', { name: 'Assessment structure saved' })).toBeVisible()
    expect(structurePayload).toEqual({
      categories: [
        { id: 'assignment', weightPercentage: 15 },
        { id: 'quiz', weightPercentage: 10 },
        { id: 'attendance', weightPercentage: 10 },
        { id: 'presentation', weightPercentage: 5 },
        { id: 'midterm', weightPercentage: 30 },
        { id: 'final', weightPercentage: 30 },
      ],
    })

    await page.unroute('**/api/auth/me')
    await mockAuthMe(page, users.teacher)
    await page.route('**/api/academic-performance/offerings', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ offerings: [offering] }),
      })
    })
    await page.route('**/api/assessments?*', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ assessments: [assessment] }),
      })
    })
    await page.route('**/api/assessments', async (route) => {
      assessmentPayload = route.request().postDataJSON()
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Assessment created.',
          assessment,
        }),
      })
    })

    await page.goto('/assessments')
    await page.getByLabel('Assessment name').fill(assessment.name)
    await page.getByLabel('Maximum marks').fill(String(assessment.maximumMarks))
    await page.getByRole('button', { name: 'Create assessment' }).click()

    await expect(page.getByRole('heading', { name: 'Assessment created' })).toBeVisible()
    expect(assessmentPayload).toMatchObject({
      offeringId: offering.id,
      name: assessment.name,
      category: 'quiz',
      maximumMarks: assessment.maximumMarks,
    })

    await page.route('**/api/marks/assessment-1', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          sheet: {
            assessment,
            records: [{ student: academicStudent, missing: true }],
            isDraft: true,
            missingCount: 1,
          },
        }),
      })
    })
    await page.route('**/api/marks/assessment-1/draft', async (route) => {
      marksPayload = route.request().postDataJSON()
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Marks draft saved successfully.',
          sheet: {
            assessment,
            records: [
              {
                student: academicStudent,
                obtainedMarks: 8.5,
                missing: false,
              },
            ],
            isDraft: true,
            missingCount: 0,
            updatedAt: '2026-08-12T00:00:00.000Z',
          },
        }),
      })
    })

    await page.goto('/marks')
    await page.getByRole('spinbutton', { name: `Marks for ${academicStudent.name}` }).fill('11')
    await expect(page.getByText('Cannot exceed 10.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save draft' })).toBeDisabled()

    await page.getByRole('spinbutton', { name: `Marks for ${academicStudent.name}` }).fill('8.5')
    await page.getByRole('button', { name: 'Save draft' }).click()

    await expect(page.getByRole('heading', { name: 'Marks draft saved' })).toBeVisible()
    expect(marksPayload).toEqual({
      records: [{ studentId: academicStudent.id, obtainedMarks: 8.5 }],
    })
  })
})
