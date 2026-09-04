import type { AttendanceCourseSummary } from '@/features/academic-performance/types/academic-performance.types'
import type {
  AssessmentCategory,
  MarkStatus,
} from '@/features/academic-performance/types/academic-performance.types'
import type { CourseOffering } from '@/features/courses/types/course.types'
import type { StudentCourseResult } from '@/features/academic-performance/types/academic-performance.types'
import type { PortalNotification } from '@/features/notifications/types/notification.types'
import type { StudentFee } from '@/features/fees/types/fee.types'
import type { TimetableEntry } from '@/features/timetable/types/timetable.types'
import type { Exam } from '@/features/exams/types/exam.types'
import type { Announcement } from '@/features/announcements/types/announcement.types'

export type StudentNotification = PortalNotification

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
  role: 'student'
  student: {
    id: string
    name: string
    registrationNumber?: string
    department: DashboardRelation | null
    program: DashboardRelation | null
    semester: DashboardSemester | null
    section: DashboardRelation | null
  }
  currentSemester: DashboardSemester | null
  courses: CourseOffering[]
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
  fee: StudentFee | null
  todayClasses: TimetableEntry[]
  upcomingExams: Exam[]
  announcements: Announcement[]
  notifications: StudentNotification[]
}

type DashboardRelation = {
  id: string
  name: string
  code?: string
}

type DashboardSemester = DashboardRelation & {
  academicYear?: string
}
