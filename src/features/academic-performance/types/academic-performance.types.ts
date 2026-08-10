import type {
  Section,
  Semester,
} from '@/features/academic-structure/types/academic-structure.types'

export type AcademicPerformanceContext = {
  currentSemester: Semester | null
  activeSections: Section[]
  studentSection: Section | null
  canResolveStudentSection: boolean
}
