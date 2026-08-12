import type { AttendanceCourseSummary } from '@/features/academic-performance/types/academic-performance.types'
import type {
  AssessmentCategory,
  MarkStatus,
} from '@/features/academic-performance/types/academic-performance.types'
import type { CourseOffering } from '@/features/courses/types/course.types'

export type PublishedStudentMark = {
  assessment: {
    id: string
    name: string
    category: AssessmentCategory
    maximumMarks: number
  }
  offering: CourseOffering
  obtainedMarks?: number
  status?: MarkStatus
  percentage?: number
  publishedAt?: string
}

export type StudentAcademicSummary = {
  publishedAssessments: number
  coursesWithMarks: number
  averagePercentage: number
  weightedPercentage: number
}

export type StudentDashboardResponse = {
  attendance: {
    summaries: AttendanceCourseSummary[]
  }
  academics: {
    recentMarks: PublishedStudentMark[]
    summary: StudentAcademicSummary
  }
}
