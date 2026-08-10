import type { Program } from '@/features/programs/types/program.types'

export type AcademicStructureTab = 'batches' | 'semesters' | 'sections'

export type DeleteAcademicStructureTarget =
  | { kind: 'batch'; id: string; label: string }
  | { kind: 'semester'; id: string; label: string }
  | { kind: 'section'; id: string; label: string }

export type AcademicStatus = {
  isActive: boolean
}

export type Batch = AcademicStatus & {
  id: string
  name: string
  program: Pick<Program, 'id' | 'name' | 'code' | 'isActive'>
  startingYear: number
  expectedGraduationYear: number
  createdAt?: string
  updatedAt?: string
}

export type Semester = {
  id: string
  name: string
  academicYear: string
  startsAt?: string
  endsAt?: string
  isActive: boolean
  isClosed: boolean
  closedAt?: string
  createdAt?: string
  updatedAt?: string
}

export type Section = AcademicStatus & {
  id: string
  name: string
  program: Pick<Program, 'id' | 'name' | 'code' | 'isActive'>
  batch: Pick<Batch, 'id' | 'name' | 'startingYear' | 'expectedGraduationYear' | 'isActive'>
  semester: Pick<Semester, 'id' | 'name' | 'academicYear' | 'isActive' | 'isClosed'>
  createdAt?: string
  updatedAt?: string
}

export type BatchPayload = {
  name: string
  programId: string
  startingYear: number
  expectedGraduationYear: number
  isActive: boolean
}

export type SemesterPayload = {
  name: string
  academicYear: string
  startsAt?: string
  endsAt?: string
  isActive: boolean
  isClosed: boolean
}

export type SectionPayload = {
  name: string
  programId: string
  batchId: string
  semesterId: string
  isActive: boolean
}

export type BatchesResponse = {
  batches: Batch[]
}

export type BatchResponse = {
  message: string
  batch: Batch
}

export type SemestersResponse = {
  semesters: Semester[]
}

export type SemesterResponse = {
  message: string
  semester: Semester
}

export type SectionsResponse = {
  sections: Section[]
}

export type SectionResponse = {
  message: string
  section: Section
}
