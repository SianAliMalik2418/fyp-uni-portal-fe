import type { FeeFormValues } from '../schemas/fee.schemas'
import type { FeeStatus, SaveFeePayload, StudentFee } from '../types/fee.types'

export const feeStatusLabels: Record<FeeStatus, string> = {
  paid: 'Paid',
  partially_paid: 'Partially paid',
  unpaid: 'Unpaid',
  overdue: 'Overdue',
}

export function formatCurrency(amount: number) {
  return `PKR ${amount.toLocaleString('en-PK', { maximumFractionDigits: 2 })}`
}

export function emptyFeeFormValues(): FeeFormValues {
  return {
    totalAmount: 0,
    paidAmount: 0,
    dueDate: '',
    paymentDate: '',
    notes: '',
  }
}

export function feeToFormValues(fee: StudentFee | null): FeeFormValues {
  if (!fee) {
    return emptyFeeFormValues()
  }

  return {
    totalAmount: fee.totalAmount,
    paidAmount: fee.paidAmount,
    dueDate: fee.dueDate,
    paymentDate: fee.paymentDate ?? '',
    notes: fee.notes ?? '',
  }
}

export function feeFormToPayload(values: FeeFormValues): SaveFeePayload {
  return {
    totalAmount: values.totalAmount,
    paidAmount: values.paidAmount,
    dueDate: values.dueDate,
    paymentDate: values.paymentDate || undefined,
    notes: values.notes.trim() || undefined,
  }
}
