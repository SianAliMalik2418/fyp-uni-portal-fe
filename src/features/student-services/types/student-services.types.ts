import type {
  Section,
  Semester,
} from '@/features/academic-structure/types/academic-structure.types'

export type StudentServiceStructureScope = {
  canReferenceProgram: boolean
  canReferenceSemester: boolean
  canReferenceSection: boolean
}

export type StudentServiceRelation = {
  id: string
  name: string
  code?: string
  academicYear?: string
}

export type StudentServiceStudentContext = {
  userId: string
  name: string
  email: string
  registrationNumber: string | null
  program: StudentServiceRelation | null
  semester: StudentServiceRelation | null
  section: StudentServiceRelation | null
}

export type StudentServiceContext = {
  currentSemester: Semester | null
  availableSections: Section[]
  student: StudentServiceStudentContext | null
  timetableScope: StudentServiceStructureScope
  examScope: StudentServiceStructureScope
  aiScope: StudentServiceStructureScope
}
