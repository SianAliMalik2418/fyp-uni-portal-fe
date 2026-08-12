import type { AttendanceCourseSummary } from '@/features/academic-performance/types/academic-performance.types'
import type {
  AssessmentCategory,
  MarkStatus,
} from '@/features/academic-performance/types/academic-performance.types'
import type { CourseOffering } from '@/features/courses/types/course.types'
import type { StudentCourseResult } from '@/features/academic-performance/types/academic-performance.types'

export type StudentNotification = {
  id: string
  type: 'result_published'
  title: string
  message: string
  resultId?: string
  isRead: boolean
  createdAt?: string
}

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
  results: {
    latest: StudentCourseResult | null
    gpa: number
    cgpa: number
  }
  notifications: StudentNotification[]
}

export type NotificationResponse = {
  message: string
  notification: StudentNotification
}
