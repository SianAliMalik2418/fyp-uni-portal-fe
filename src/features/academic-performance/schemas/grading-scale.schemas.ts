import { z } from 'zod'

const rangeSchema = z
  .object({
    minimumPercentage: z.coerce.number<number>().min(0).max(100),
    maximumPercentage: z.coerce.number<number>().min(0).max(100),
    letterGrade: z.string().trim().min(1, 'Letter grade is required').max(10),
    gradePoint: z.coerce.number<number>().min(0).max(4),
  })
  .refine((range) => range.minimumPercentage <= range.maximumPercentage, {
    path: ['maximumPercentage'],
    message: 'Maximum must be greater than or equal to minimum.',
  })

export const gradingScaleSchema = z
  .object({ ranges: z.array(rangeSchema).min(1).max(20) })
  .superRefine((values, context) => {
    const ranges = values.ranges.toSorted(
      (left, right) => left.minimumPercentage - right.minimumPercentage
    )
    const grades = new Set(values.ranges.map((range) => range.letterGrade.toUpperCase()))
    if (grades.size !== values.ranges.length) {
      context.addIssue({
        code: 'custom',
        path: ['ranges'],
        message: 'Letter grades must be unique.',
      })
    }
    if (ranges[0]?.minimumPercentage !== 0 || ranges.at(-1)?.maximumPercentage !== 100) {
      context.addIssue({
        code: 'custom',
        path: ['ranges'],
        message: 'The scale must cover 0 through 100 percent.',
      })
    }

    for (let index = 1; index < ranges.length; index += 1) {
      if (
        Math.round(ranges[index]!.minimumPercentage * 100) !==
        Math.round(ranges[index - 1]!.maximumPercentage * 100) + 1
      ) {
        context.addIssue({
          code: 'custom',
          path: ['ranges'],
          message: 'Ranges must not overlap or leave percentage gaps.',
        })
        break
      }
    }
  })

export type GradingScaleFormValues = z.infer<typeof gradingScaleSchema>
