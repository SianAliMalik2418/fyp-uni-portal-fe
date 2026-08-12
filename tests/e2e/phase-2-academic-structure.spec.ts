import { expect, test, type Page } from '@playwright/test'
import {
  batch,
  department,
  mockAuthMe,
  program,
  section,
  selectByLabel,
  semester,
  users,
} from './helpers/portal-fixtures'

test.describe('phase 2 - academic structure', () => {
  test('admin creates the full academic structure used by later phases', async ({ page }) => {
    const state = createAcademicState()
    await mockAuthMe(page, users.admin)
    await mockAcademicStructureRoutes(page, state)

    await page.goto('/departments')
    await page.getByRole('button', { name: 'Add department' }).click()
    await page.getByLabel('Department name').fill(department.name)
    await page.getByLabel('Department code').fill(department.code)
    await page.getByLabel('Description').fill(department.description)
    await page.getByRole('button', { name: 'Add department' }).click()

    await expect(page.getByText('Department created')).toBeVisible()
    await expect(page.getByText(department.name).first()).toBeVisible()
    expect(state.lastDepartmentPayload).toMatchObject({
      name: department.name,
      code: department.code,
      description: department.description,
      isActive: true,
    })

    await page.goto('/programs')
    await page.getByRole('button', { name: 'Add program' }).click()
    await page.getByLabel('Program name').fill(program.name)
    await page.getByLabel('Program code').fill(program.code)
    await selectByLabel(page, 'Department', /Computer Science \(CS\)/)
    await page.getByLabel('Total semesters').fill(String(program.totalSemesters))
    await page.getByLabel('Duration', { exact: true }).fill(String(program.duration))
    await page.getByRole('button', { name: 'Add program' }).click()

    await expect(page.getByText('Program created')).toBeVisible()
    await expect(page.getByText(program.name).first()).toBeVisible()
    expect(state.lastProgramPayload).toMatchObject({
      name: program.name,
      code: program.code,
      departmentId: department.id,
      totalSemesters: program.totalSemesters,
      duration: program.duration,
      durationUnit: 'years',
      isActive: true,
    })

    await page.goto('/academic-structure')
    await page.getByRole('button', { name: 'Add batch' }).click()
    await page.getByLabel('Batch name').fill(batch.name)
    await selectByLabel(page, 'Program', /BS Computer Science \(BSCS\)/)
    await page.getByLabel('Starting year').fill(String(batch.startingYear))
    await page.getByLabel('Graduation year').fill(String(batch.expectedGraduationYear))
    await page.getByRole('button', { name: 'Add batch' }).click()

    await expect(page.getByText('Batch saved')).toBeVisible()
    await expect(page.getByText(batch.name).first()).toBeVisible()
    expect(state.lastBatchPayload).toMatchObject({
      name: batch.name,
      programId: program.id,
      startingYear: batch.startingYear,
      expectedGraduationYear: batch.expectedGraduationYear,
      isActive: true,
    })

    await page.getByRole('tab', { name: 'Semesters' }).click()
    await page.getByRole('button', { name: 'Add semester' }).click()
    await page.getByLabel('Semester name').fill(semester.name)
    await page.getByLabel('Academic year').fill(semester.academicYear)
    await page.getByRole('button', { name: 'Add semester' }).click()

    await expect(page.getByText('Semester saved')).toBeVisible()
    await expect(page.getByText(semester.name).first()).toBeVisible()
    expect(state.lastSemesterPayload).toMatchObject({
      name: semester.name,
      academicYear: semester.academicYear,
      isActive: true,
      isClosed: false,
    })

    await page.getByRole('tab', { name: 'Sections' }).click()
    await page.getByRole('button', { name: 'Add section' }).click()
    await page.getByLabel('Section name').fill(section.name)
    await selectByLabel(page, 'Program', /BS Computer Science \(BSCS\)/)
    await selectByLabel(page, 'Batch', /Fall 2026 \(2026\)/)
    await selectByLabel(page, 'Semester', /Fall Semester \(2026-2027\)/)
    await page.getByRole('button', { name: 'Add section' }).click()

    await expect(page.getByText('Section saved')).toBeVisible()
    await expect(page.getByText('BSCS').first()).toBeVisible()
    expect(state.lastSectionPayload).toMatchObject({
      name: section.name,
      programId: program.id,
      batchId: batch.id,
      semesterId: semester.id,
      isActive: true,
    })
  })
})

function createAcademicState() {
  return {
    departments: [] as unknown[],
    programs: [] as unknown[],
    batches: [] as unknown[],
    semesters: [] as unknown[],
    sections: [] as unknown[],
    lastDepartmentPayload: undefined as unknown,
    lastProgramPayload: undefined as unknown,
    lastBatchPayload: undefined as unknown,
    lastSemesterPayload: undefined as unknown,
    lastSectionPayload: undefined as unknown,
  }
}

async function mockAcademicStructureRoutes(
  page: Page,
  state: ReturnType<typeof createAcademicState>
) {
  await page.route('**/api/departments', async (route) => {
    if (route.request().method() === 'POST') {
      state.lastDepartmentPayload = route.request().postDataJSON()
      state.departments = [department]
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Department created', department }),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ departments: state.departments }),
    })
  })

  await page.route('**/api/programs', async (route) => {
    if (route.request().method() === 'POST') {
      state.lastProgramPayload = route.request().postDataJSON()
      state.programs = [program]
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Program created', program }),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ programs: state.programs }),
    })
  })

  await page.route('**/api/batches', async (route) => {
    if (route.request().method() === 'POST') {
      state.lastBatchPayload = route.request().postDataJSON()
      state.batches = [batch]
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Batch saved', batch }),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ batches: state.batches }),
    })
  })

  await page.route('**/api/semesters', async (route) => {
    if (route.request().method() === 'POST') {
      state.lastSemesterPayload = route.request().postDataJSON()
      state.semesters = [semester]
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Semester saved', semester }),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ semesters: state.semesters }),
    })
  })

  await page.route('**/api/sections', async (route) => {
    if (route.request().method() === 'POST') {
      state.lastSectionPayload = route.request().postDataJSON()
      state.sections = [section]
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Section saved', section }),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ sections: state.sections }),
    })
  })
}
