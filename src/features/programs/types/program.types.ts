import type { Department } from '@/features/departments/types/department.types'

export type Program = {
  id: string
  name: string
  code: string
  department: Pick<Department, 'id' | 'name' | 'code' | 'isActive'>
  totalSemesters: number
  duration: number
  durationUnit: ProgramDurationUnit
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export type ProgramDurationUnit = 'years' | 'months'

export type ProgramsResponse = {
  programs: Program[]
}

export type ProgramResponse = {
  message: string
  program: Program
}

export type ProgramPayload = {
  name: string
  code: string
  departmentId: string
  totalSemesters: number
  duration: number
  durationUnit: ProgramDurationUnit
  isActive: boolean
}
