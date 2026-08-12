import { type Page } from '@playwright/test'

export const users = {
  admin: user('admin', 'Sian Admin', 'admin@example.com'),
  hod: user('hod', 'Hammad HOD', 'hod@example.com'),
  teacher: user('teacher', 'Tayabba Teacher', 'teacher@example.com'),
  student: user('student', 'Hammad Student', 'student@example.com'),
}

export const department = {
  id: 'department-1',
  name: 'Computer Science',
  code: 'CS',
  description: 'School of computing',
  isActive: true,
}

export const program = {
  id: 'program-1',
  name: 'BS Computer Science',
  code: 'BSCS',
  department,
  totalSemesters: 8,
  duration: 4,
  durationUnit: 'years',
  isActive: true,
}

export const batch = {
  id: 'batch-1',
  name: 'Fall 2026',
  program,
  startingYear: 2026,
  expectedGraduationYear: 2030,
  isActive: true,
}

export const semester = {
  id: 'semester-1',
  name: 'Fall Semester',
  academicYear: '2026-2027',
  startsAt: '2026-09-01',
  endsAt: '2027-01-15',
  isActive: true,
  isClosed: false,
}

export const section = {
  id: 'section-1',
  name: 'A',
  program,
  batch,
  semester,
  isActive: true,
}

export const course = {
  id: 'course-1',
  code: 'PF',
  title: 'Programming Fundamentals',
  creditHours: 3,
  department,
  program,
  semester,
  description: 'Introductory programming course',
  isActive: true,
}

export const offering = {
  id: 'offering-1',
  course,
  section,
  teacher: {
    id: 'teacher-1',
    fullName: users.teacher.name,
    email: users.teacher.email,
    employeeId: 'EMP-001',
    department,
  },
  studentCount: 1,
  isActive: true,
}

export const academicStudent = {
  id: 'student-1',
  name: 'Ayesha Noor',
  registrationNumber: 'NCBAE-2026-CS-001',
  academicStatus: 'active',
  isActive: true,
  department: { id: department.id, name: department.name, code: department.code },
  program: { id: program.id, name: program.name, code: program.code },
  batch: { id: batch.id, name: batch.name },
  semester: { id: semester.id, name: semester.name, academicYear: semester.academicYear },
  section: { id: section.id, name: section.name },
}

export const assessmentStructure = {
  categories: [
    { id: 'assignment', label: 'Assignments', weightPercentage: 15 },
    { id: 'quiz', label: 'Quizzes', weightPercentage: 10 },
    { id: 'attendance', label: 'Attendance', weightPercentage: 10 },
    { id: 'presentation', label: 'Presentations', weightPercentage: 5 },
    { id: 'midterm', label: 'Midterm', weightPercentage: 30 },
    { id: 'final', label: 'Final', weightPercentage: 30 },
  ],
  totalPercentage: 100,
}

export const assessment = {
  id: 'assessment-1',
  offering,
  name: 'Quiz 1',
  category: 'quiz',
  maximumMarks: 10,
}

export async function mockAuthMe(page: Page, portalUser = users.admin) {
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ user: portalUser }),
    })
  })
}

export async function mockReferenceData(page: Page) {
  await page.route('**/api/departments', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ departments: [department] }),
    })
  })
  await page.route('**/api/programs', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ programs: [program] }),
    })
  })
  await page.route('**/api/batches', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ batches: [batch] }),
    })
  })
  await page.route('**/api/semesters', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ semesters: [semester] }),
    })
  })
  await page.route('**/api/sections', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ sections: [section] }),
    })
  })
}

export async function mockCourses(page: Page) {
  await page.route('**/api/courses', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ courses: [course] }),
    })
  })
  await page.route('**/api/courses/offerings', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ offerings: [offering] }),
    })
  })
  await page.route('**/api/courses/me/student', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ offerings: [offering] }),
    })
  })
  await page.route('**/api/courses/me/teacher', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ offerings: [offering] }),
    })
  })
  await page.route('**/api/courses/teachers', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        teachers: [
          {
            id: 'teacher-1',
            fullName: users.teacher.name,
            email: users.teacher.email,
            employeeId: 'EMP-001',
            department,
          },
        ],
      }),
    })
  })
  await page.route('**/api/courses/sections/*/offerings', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ offerings: [offering] }),
    })
  })
}

export async function selectByLabel(page: Page, label: string | RegExp, option: string | RegExp) {
  await page.getByRole('combobox', { name: label }).click()
  const visibleOptions = page.locator('[role="listbox"]:visible [role="option"]')
  await visibleOptions
    .filter({ hasText: option })
    .evaluate((element) => (element as HTMLElement).click())
}

function user(role: 'admin' | 'hod' | 'teacher' | 'student', name: string, email: string) {
  return {
    id: `${role}-1`,
    name,
    email,
    role,
    accountStatus: 'active',
    isActive: true,
    passwordChangeRequired: false,
  }
}
