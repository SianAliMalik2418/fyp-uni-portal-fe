import type { CourseFormValues } from '../schemas/course.schemas'
import type { Course, CoursePayload } from '../types/course.types'

export const emptyCourseValues: CourseFormValues = {
  code: '',
  title: '',
  creditHours: 3,
  departmentId: '',
  programId: '',
  semesterId: '',
  description: '',
  isActive: true,
}

export function courseValues(course: Course): CourseFormValues {
  return {
    code: course.code,
    title: course.title,
    creditHours: course.creditHours,
    departmentId: course.department.id,
    programId: course.program.id,
    semesterId: course.semester.id,
    description: course.description ?? '',
    isActive: course.isActive,
  }
}

export function toCoursePayload(values: CourseFormValues): CoursePayload {
  return {
    code: values.code.trim(),
    title: values.title.trim(),
    creditHours: values.creditHours,
    departmentId: values.departmentId,
    programId: values.programId,
    semesterId: values.semesterId,
    description: values.description?.trim() || undefined,
    isActive: values.isActive,
  }
}
