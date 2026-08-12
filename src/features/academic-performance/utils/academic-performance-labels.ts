import type { CourseOffering } from '@/features/courses/types/course.types'
import type { AssessmentCategory, MarkStatus } from '../types/academic-performance.types'

export function courseOfferingLabel(offering: CourseOffering) {
  return `${offering.course.code} - ${offering.section.program.code} ${offering.section.semester.name} ${offering.section.name}`
}

export const assessmentCategoryLabels: Record<AssessmentCategory, string> = {
  quiz: 'Quizzes',
  assignment: 'Assignments',
  attendance: 'Attendance',
  presentation: 'Presentation',
  midterm: 'Midterm',
  final: 'Final',
}

export const markStatusLabels: Record<MarkStatus, string> = {
  absent: 'Absent',
  exempted: 'Exempted',
  result_withheld: 'Result withheld',
}
