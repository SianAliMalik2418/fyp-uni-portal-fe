import { z } from 'zod'

export const feeFormSchema = z
  .object({
    totalAmount: z
      .number()
      .positive('Total semester fee must be greater than zero')
      .max(1_000_000_000)
      .multipleOf(0.01),
    paidAmount: z
      .number()
      .min(0, 'Paid amount cannot be negative')
      .max(1_000_000_000)
      .multipleOf(0.01),
    dueDate: z.string().min(1, 'Due date is required'),
    paymentDate: z.string(),
    notes: z.string().trim().max(1000, 'Notes cannot exceed 1000 characters'),
  })
  .refine((value) => value.paidAmount <= value.totalAmount, {
    message: 'Paid amount cannot exceed total semester fee',
    path: ['paidAmount'],
  })

export type FeeFormValues = z.infer<typeof feeFormSchema>
