import type { AttendanceCourseSummary } from '@/features/academic-performance/types/academic-performance.types'

export type StudentDashboardResponse = {
  attendance: {
    summaries: AttendanceCourseSummary[]
  }
}
