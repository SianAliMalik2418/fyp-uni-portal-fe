import type { AttendanceCourseSummary } from '@/features/academic-performance/types/academic-performance.types'
import type { CourseOffering } from '@/features/courses/types/course.types'

export type TeacherDashboardResponse = {
  role: 'teacher'
  summary: {
    assignedCourses: number
    sections: number
    students: number
    attendanceSessions: number
    completedMarkSheets: number
    totalAssessments: number
    draftResults: number
    pendingResults: number
    returnedResults: number
  }
  assignedCourses: CourseOffering[]
  attendanceActivity: Array<{
    id: string
    date: string
    courseCode: string
    courseTitle: string
    sectionName: string
    studentCount: number
  }>
}

export type HodDashboardResponse = {
  role: 'hod'
  department: { id: string; name: string; code?: string } | null
  summary: {
    students: number
    teachers: number
    courses: number
    lowAttendance: number
    pendingApprovals: number
    recentlyApproved: number
  }
  lowAttendance: Array<
    Pick<AttendanceCourseSummary, 'attendancePercentage' | 'requiredPercentage'> & {
      student: { id: string; name: string; registrationNumber: string }
      offering: Pick<CourseOffering, 'id'> & {
        course: Pick<CourseOffering['course'], 'code' | 'title'>
      }
    }
  >
  recentlyApprovedResults: Array<{
    id: string
    courseCode: string
    courseTitle: string
    approvedAt?: string
    studentCount: number
  }>
  academicSummary: {
    approvedResults: number
    studentsAssessed: number
    averagePercentage: number
    passRate: number
  }
}

export type AdminDashboardResponse = {
  role: 'admin'
  summary: {
    students: number
    teachers: number
    departments: number
    programs: number
    sections: number
    courses: number
  }
  currentSemester: {
    id: string
    name: string
    academicYear?: string
  } | null
  recentImports: Array<{
    id: string
    fileName: string
    importedAt: string
    importedCount: number
  }>
  recentActivity: Array<{
    id: string
    label: string
    detail: string
    occurredAt?: string
  }>
}

export type StaffDashboardResponse =
  TeacherDashboardResponse | HodDashboardResponse | AdminDashboardResponse
