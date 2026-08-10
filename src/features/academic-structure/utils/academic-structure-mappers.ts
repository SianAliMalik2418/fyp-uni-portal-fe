import type {
  BatchFormValues,
  SectionFormValues,
  SemesterFormValues,
} from '../schemas/academic-structure.schemas'
import type {
  Batch,
  BatchPayload,
  Section,
  SectionPayload,
  Semester,
  SemesterPayload,
} from '../types/academic-structure.types'
import { formatInputDate } from '@/shared/utils/date-format'

const currentYear = new Date().getFullYear()

export const emptyBatchValues: BatchFormValues = {
  name: '',
  programId: '',
  startingYear: currentYear,
  expectedGraduationYear: currentYear + 4,
  isActive: true,
}

export const emptySemesterValues: SemesterFormValues = {
  name: '',
  academicYear: `${currentYear}-${currentYear + 1}`,
  startsAt: '',
  endsAt: '',
  isActive: false,
  isClosed: false,
}

export const emptySectionValues: SectionFormValues = {
  name: '',
  programId: '',
  batchId: '',
  semesterId: '',
  isActive: true,
}

export function batchValues(batch: Batch): BatchFormValues {
  return {
    name: batch.name,
    programId: batch.program.id,
    startingYear: batch.startingYear,
    expectedGraduationYear: batch.expectedGraduationYear,
    isActive: batch.isActive,
  }
}

export function semesterValues(semester: Semester): SemesterFormValues {
  return {
    name: semester.name,
    academicYear: semester.academicYear,
    startsAt: formatInputDate(semester.startsAt),
    endsAt: formatInputDate(semester.endsAt),
    isActive: semester.isActive,
    isClosed: semester.isClosed,
  }
}

export function sectionValues(section: Section): SectionFormValues {
  return {
    name: section.name,
    programId: section.program.id,
    batchId: section.batch.id,
    semesterId: section.semester.id,
    isActive: section.isActive,
  }
}

export function toBatchPayload(values: BatchFormValues): BatchPayload {
  return {
    name: values.name.trim(),
    programId: values.programId,
    startingYear: values.startingYear,
    expectedGraduationYear: values.expectedGraduationYear,
    isActive: values.isActive,
  }
}

export function toSemesterPayload(values: SemesterFormValues): SemesterPayload {
  return {
    name: values.name.trim(),
    academicYear: values.academicYear.trim(),
    startsAt: values.startsAt || undefined,
    endsAt: values.endsAt || undefined,
    isActive: values.isActive,
    isClosed: values.isClosed,
  }
}

export function toSectionPayload(values: SectionFormValues): SectionPayload {
  return {
    name: values.name.trim().toUpperCase(),
    programId: values.programId,
    batchId: values.batchId,
    semesterId: values.semesterId,
    isActive: values.isActive,
  }
}
