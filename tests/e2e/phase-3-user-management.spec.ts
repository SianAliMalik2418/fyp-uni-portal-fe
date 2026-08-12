import { expect, test, type Page } from '@playwright/test'
import {
  academicStudent,
  batch,
  department,
  mockAuthMe,
  mockReferenceData,
  program,
  section,
  selectByLabel,
  semester,
  users,
} from './helpers/portal-fixtures'

test.describe('phase 3 - student, teacher, and HOD management', () => {
  test('admin provisions student, teacher, and HOD accounts with the right relationships', async ({
    page,
  }) => {
    const state = {
      users: [] as unknown[],
      payloads: [] as unknown[],
    }

    await mockAuthMe(page, users.admin)
    await mockReferenceData(page)
    await mockUserRoutes(page, state)

    await page.goto('/students')
    await page.getByRole('button', { name: 'Create account' }).click()
    await page.getByLabel('Full name').fill(academicStudent.name)
    await page.getByLabel('Email').fill('ayesha.noor@example.com')
    await page.getByLabel('Registration no.').fill(academicStudent.registrationNumber)
    await selectByLabel(page, 'Department', /Computer Science \(CS\)/)
    await selectByLabel(page, 'Program', /BS Computer Science \(BSCS\)/)
    await selectByLabel(page, 'Batch', 'Fall 2026')
    await selectByLabel(page, 'Semester', /Fall Semester \(2026-2027\)/)
    await selectByLabel(page, 'Section', 'A')
    await selectByLabel(page, 'Academic status', 'Active')
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByText('Temporary password issued')).toBeVisible()
    expect(state.payloads.at(-1)).toMatchObject({
      fullName: academicStudent.name,
      email: 'ayesha.noor@example.com',
      role: 'student',
      registrationNumber: academicStudent.registrationNumber,
      departmentId: department.id,
      programId: program.id,
      batchId: batch.id,
      semesterId: semester.id,
      sectionId: section.id,
      academicStatus: 'active',
      isActive: true,
    })

    await page.goto('/teachers')
    await page.getByRole('button', { name: 'Create account' }).click()
    await page.getByLabel('Full name').fill(users.teacher.name)
    await page.getByLabel('Email').fill(users.teacher.email)
    await page.getByLabel('Employee ID').fill('EMP-001')
    await selectByLabel(page, 'Department', /Computer Science \(CS\)/)
    await page.getByLabel('Designation').fill('Lecturer')
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByText('Temporary password issued')).toBeVisible()
    expect(state.payloads.at(-1)).toMatchObject({
      fullName: users.teacher.name,
      email: users.teacher.email,
      role: 'teacher',
      employeeId: 'EMP-001',
      departmentId: department.id,
      designation: 'Lecturer',
      isActive: true,
    })

    await page.getByRole('button', { name: 'Create account' }).click()
    await page.getByLabel('Full name').fill(users.hod.name)
    await page.getByLabel('Email').fill(users.hod.email)
    await selectByLabel(page, 'Account type', 'HOD')
    await page.getByLabel('Employee ID').fill('HOD-001')
    await selectByLabel(page, 'Department', /Computer Science \(CS\)/)
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByText('Temporary password issued')).toBeVisible()
    expect(state.payloads.at(-1)).toMatchObject({
      fullName: users.hod.name,
      email: users.hod.email,
      role: 'hod',
      employeeId: 'HOD-001',
      departmentId: department.id,
      isActive: true,
    })

    await expect(page.getByText(users.teacher.name).first()).toBeVisible()
    await expect(page.getByText(users.hod.name).first()).toBeVisible()
  })
})

async function mockUserRoutes(page: Page, state: { users: unknown[]; payloads: unknown[] }) {
  await page.route('**/api/users', async (route) => {
    if (route.request().method() === 'POST') {
      const payload = route.request().postDataJSON()
      state.payloads.push(payload)
      const createdUser = {
        id: `user-${state.users.length + 1}`,
        accountStatus: payload.isActive ? 'active' : 'inactive',
        passwordChangeRequired: true,
        ...payload,
      }
      state.users.push(createdUser)
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'User account created',
          temporaryPassword: '@Abc1234',
          user: createdUser,
        }),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ users: state.users }),
    })
  })
}
