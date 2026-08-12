import { z } from 'zod'

const categorySchema = z.object({
  id: z.enum(['quiz', 'assignment', 'attendance', 'presentation', 'midterm', 'final']),
  weightPercentage: z.coerce
    .number<number>()
    .positive('Weight must be greater than zero')
    .max(100, 'Weight cannot exceed 100'),
})

export const assessmentStructureSchema = z
  .object({
    categories: z.array(categorySchema).length(6),
  })
  .superRefine((values, context) => {
    const total = values.categories.reduce((sum, category) => sum + category.weightPercentage, 0)

    if (Math.abs(total - 100) > 0.001) {
      context.addIssue({
        code: 'custom',
        path: ['categories'],
        message: 'Assessment category weights must total 100%',
      })
    }
  })

export type AssessmentStructureFormValues = z.infer<typeof assessmentStructureSchema>
