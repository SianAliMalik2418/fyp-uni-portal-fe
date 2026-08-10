import type { DepartmentFormValues } from '../schemas/department.schemas'
import type { Department, DepartmentPayload } from '../types/department.types'

export const emptyDepartmentValues: DepartmentFormValues = {
  name: '',
  code: '',
  description: '',
  isActive: true,
}

function cleanOptional(value?: string) {
  const cleaned = value?.trim()
  return cleaned ? cleaned : undefined
}

export function departmentValues(department: Department): DepartmentFormValues {
  return {
    name: department.name,
    code: department.code,
    description: department.description ?? '',
    isActive: department.isActive,
  }
}

export function toDepartmentPayload(values: DepartmentFormValues): DepartmentPayload {
  return {
    name: values.name.trim(),
    code: values.code.trim().toUpperCase(),
    description: cleanOptional(values.description),
    isActive: values.isActive,
  }
}
