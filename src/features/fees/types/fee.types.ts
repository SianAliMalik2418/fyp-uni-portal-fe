export type FeeStatus = 'paid' | 'partially_paid' | 'unpaid' | 'overdue'

export type StudentFee = {
  id: string
  student: {
    id: string
    fullName: string
    registrationNumber?: string
  }
  semester: {
    id: string
    name: string
    academicYear: string
  }
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  dueDate: string
  paymentDate?: string
  notes?: string
  status: FeeStatus
  updatedAt?: string
}

export type FeeResponse = {
  fee: StudentFee | null
}

export type SaveFeePayload = {
  totalAmount: number
  paidAmount: number
  dueDate: string
  paymentDate?: string
  notes?: string
}

export type SaveFeeResponse = FeeResponse & {
  message: string
}
