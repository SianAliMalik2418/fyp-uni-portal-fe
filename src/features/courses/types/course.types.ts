import type { Department } from '@/features/departments/types/department.types'
import type { Program } from '@/features/programs/types/program.types'
import type {
  Section,
  Semester,
} from '@/features/academic-structure/types/academic-structure.types'

export type Course = {
  id: string
  code: string
  title: string
  creditHours: number
  department: Pick<Department, 'id' | 'name' | 'code' | 'isActive'>
  program: Pick<Program, 'id' | 'name' | 'code' | 'isActive'>
  semester: Pick<Semester, 'id' | 'name' | 'academicYear' | 'isActive' | 'isClosed'>
  description?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export type CoursePayload = {
  code: string
  title: string
  creditHours: number
  departmentId: string
  programId: string
  semesterId: string
  description?: string
  isActive: boolean
}

export type CourseOffering = {
  id: string
  course: Course
  section: Pick<Section, 'id' | 'name' | 'isActive'> & {
    program: Pick<Program, 'id' | 'name' | 'code' | 'isActive'>
    semester: Pick<Semester, 'id' | 'name' | 'academicYear' | 'isActive' | 'isClosed'>
  }
  teacher?: {
    id: string
    fullName: string
    email: string
    employeeId?: string
    department?: Pick<Department, 'id' | 'name' | 'code' | 'isActive'>
  }
  studentCount: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export type AssignableTeacher = {
  id: string
  fullName: string
  email: string
  employeeId?: string
  department?: Pick<Department, 'id' | 'name' | 'code' | 'isActive'>
}

export type CoursesResponse = {
  courses: Course[]
}

export type CourseResponse = {
  message: string
  course: Course
}

export type CourseOfferingsResponse = {
  offerings: CourseOffering[]
}

export type AssignableTeachersResponse = {
  teachers: AssignableTeacher[]
}

export type CourseOfferingResponse = {
  message: string
  offering: CourseOffering
}

export type SectionCourseAssignmentPayload = {
  courseIds: string[]
}

export type SectionCourseAssignmentResponse = {
  message: string
  offerings: CourseOffering[]
}
