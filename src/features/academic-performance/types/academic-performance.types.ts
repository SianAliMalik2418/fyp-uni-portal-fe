import type {
  Section,
  Semester,
} from '@/features/academic-structure/types/academic-structure.types'
import type { CourseOffering } from '@/features/courses/types/course.types'

export type AttendanceStatus = 'present' | 'absent' | 'leave'

export type AttendanceConfiguration = {
  minimumAttendancePercentage: number
  updatedAt?: string
}

export type AttendanceConfigurationPayload = Pick<
  AttendanceConfiguration,
  'minimumAttendancePercentage'
>

export type AttendanceConfigurationResponse = {
  configuration: AttendanceConfiguration
  message?: string
}

export type AcademicPerformanceContext = {
  currentSemester: Semester | null
  activeSections: Section[]
  studentSection: AcademicPerformanceStudentRelation | null
  students: AcademicPerformanceStudent[]
  canResolveStudentSection: boolean
}

export type AcademicPerformanceStudentRelation = {
  id: string
  name: string
  code?: string
  academicYear?: string
}

export type AcademicPerformanceStudent = {
  id: string
  name: string
  registrationNumber: string
  academicStatus?: 'active' | 'frozen' | 'repeating' | 'dropped' | 'graduated'
  isActive: boolean
  department: AcademicPerformanceStudentRelation | null
  program: AcademicPerformanceStudentRelation | null
  batch: AcademicPerformanceStudentRelation | null
  semester: AcademicPerformanceStudentRelation | null
  section: AcademicPerformanceStudentRelation | null
}

export type AcademicPerformanceOfferingsResponse = {
  offerings: CourseOffering[]
}

export type AcademicPerformanceOfferingStudentsResponse = {
  offering: CourseOffering
  students: AcademicPerformanceStudent[]
}

export type AttendanceRecordPayload = {
  studentId: string
  status: AttendanceStatus
}

export type AttendanceSessionPayload = {
  offeringId: string
  date: string
  records: AttendanceRecordPayload[]
}

export type AttendanceRecord = {
  student: AcademicPerformanceStudent
  status: AttendanceStatus
}

export type AttendanceSession = {
  id: string
  offering: CourseOffering
  date: string
  records: AttendanceRecord[]
  studentCount: number
  createdAt?: string
  updatedAt?: string
}

export type AttendanceSessionResponse = {
  message: string
  session: AttendanceSession
}

export type AttendanceSessionsResponse = {
  sessions: AttendanceSession[]
}

export type AttendanceCourseSummary = {
  offering: CourseOffering
  totalClasses: number
  present: number
  absent: number
  leave: number
  attendancePercentage: number
  requiredPercentage: number
  isBelowThreshold: boolean
}

export type StudentAttendanceResponse = {
  summaries: AttendanceCourseSummary[]
}

export type AttendanceShortage = AttendanceCourseSummary & {
  student: AcademicPerformanceStudent
}

export type AttendanceShortagesResponse = {
  shortages: AttendanceShortage[]
}
