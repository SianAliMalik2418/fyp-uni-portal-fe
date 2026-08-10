import type { ProgramFormValues } from '../schemas/program.schemas'
import type { Program, ProgramPayload } from '../types/program.types'

export const emptyProgramValues: ProgramFormValues = {
  name: '',
  code: '',
  departmentId: '',
  totalSemesters: 8,
  duration: 4,
  durationUnit: 'years',
  isActive: true,
}

export function programValues(program: Program): ProgramFormValues {
  return {
    name: program.name,
    code: program.code,
    departmentId: program.department.id,
    totalSemesters: program.totalSemesters,
    duration: program.duration,
    durationUnit: program.durationUnit,
    isActive: program.isActive,
  }
}

export function toProgramPayload(values: ProgramFormValues): ProgramPayload {
  return {
    name: values.name.trim(),
    code: values.code.trim().toUpperCase(),
    departmentId: values.departmentId,
    totalSemesters: values.totalSemesters,
    duration: values.duration,
    durationUnit: values.durationUnit,
    isActive: values.isActive,
  }
}
