export type Department = {
  id: string
  name: string
  code: string
  description?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export type DepartmentsResponse = {
  departments: Department[]
}

export type DepartmentResponse = {
  message: string
  department: Department
}

export type DepartmentPayload = {
  name: string
  code: string
  description?: string
  isActive: boolean
}
