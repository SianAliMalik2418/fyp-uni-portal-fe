import type {
  Section,
  Semester,
} from '@/features/academic-structure/types/academic-structure.types'
import type { CourseOffering } from '@/features/courses/types/course.types'

export type AttendanceStatus = 'present' | 'absent' | 'leave'
export type AssessmentCategory =
  'quiz' | 'assignment' | 'attendance' | 'presentation' | 'midterm' | 'final'
export type MarkStatus = 'absent' | 'exempted' | 'result_withheld'
export type ResultStatus = 'draft' | 'pending' | 'returned' | 'approved'

export type AssessmentCategoryDefinition = {
  id: AssessmentCategory
  label: string
  weightPercentage: number
}

export type AssessmentStructure = {
  categories: AssessmentCategoryDefinition[]
  totalPercentage: number
  updatedAt?: string
}

export type Assessment = {
  id: string
  offering: CourseOffering
  name: string
  category: AssessmentCategory
  maximumMarks: number
  createdAt?: string
  updatedAt?: string
}

export type AssessmentPayload = {
  offeringId: string
  name: string
  category: AssessmentCategory
  maximumMarks: number
}

export type AssessmentStructureResponse = {
  structure: AssessmentStructure
  message?: string
}

export type AssessmentStructurePayload = {
  categories: Array<Pick<AssessmentCategoryDefinition, 'id' | 'weightPercentage'>>
}

export type AssessmentsResponse = {
  assessments: Assessment[]
}

export type AssessmentResponse = {
  message: string
  assessment: Assessment
}

export type MarkRecordPayload = {
  studentId: string
  obtainedMarks?: number
  status?: MarkStatus
}

export type MarkRecord = {
  student: AcademicPerformanceStudent
  obtainedMarks?: number
  status?: MarkStatus
  missing: boolean
}

export type MarkSheet = {
  assessment: Assessment
  records: MarkRecord[]
  isDraft: true
  missingCount: number
  updatedAt?: string
}

export type MarkSheetPayload = {
  records: MarkRecordPayload[]
}

export type MarkSheetResponse = {
  message?: string
  sheet: MarkSheet
}

export type ResultCategoryTotal = {
  category: AssessmentCategory
  obtainedMarks: number
  maximumMarks: number
  percentage: number
  weightedMarks: number
}

export type ResultRecord = {
  student: AcademicPerformanceStudent
  categories: ResultCategoryTotal[]
  finalPercentage: number
  letterGrade: string
  gradePoint: number
}

export type ResultStatistics = {
  studentCount: number
  averagePercentage: number
  highestPercentage: number
  lowestPercentage: number
  passCount: number
}

export type CourseResult = {
  id?: string
  offering: CourseOffering
  status: ResultStatus
  records: ResultRecord[]
  statistics: ResultStatistics
  submissionReady: boolean
  hodComment?: string
  reopenReason?: string
  submittedAt?: string
  approvedAt?: string
  returnedAt?: string
  reopenedAt?: string
  updatedAt?: string
}

export type CourseResultResponse = {
  message?: string
  result: CourseResult
}

export type ResultCommentPayload = {
  comment: string
}

export type StudentCourseResult = {
  id: string
  offering: CourseOffering
  finalPercentage: number
  letterGrade: string
  gradePoint: number
  approvedAt?: string
}

export type StudentSemesterResult = {
  semester: Semester
  gpa: number
  courses: StudentCourseResult[]
}

export type PublishedStudentResultsResponse = {
  semesters: StudentSemesterResult[]
  cgpa: number
}

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
