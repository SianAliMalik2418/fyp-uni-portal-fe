import type {
  Section,
  Semester,
} from '@/features/academic-structure/types/academic-structure.types'

export type StudentServiceStructureScope = {
  canReferenceProgram: boolean
  canReferenceSemester: boolean
  canReferenceSection: boolean
}

export type StudentServiceContext = {
  currentSemester: Semester | null
  availableSections: Section[]
  timetableScope: StudentServiceStructureScope
  examScope: StudentServiceStructureScope
  aiScope: StudentServiceStructureScope
}
