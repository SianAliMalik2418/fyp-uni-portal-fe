import { z } from 'zod'

export const announcementFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(160),
    description: z.string().trim().min(1, 'Description is required').max(5000),
    publishDate: z.string().min(1, 'Publish date is required'),
    expiryDate: z.string(),
    isPinned: z.boolean(),
    isActive: z.boolean(),
    attachment: z.instanceof(File).optional(),
    removeAttachment: z.boolean(),
  })
  .refine(
    (value) => !value.expiryDate || new Date(value.expiryDate) > new Date(value.publishDate),
    { path: ['expiryDate'], message: 'Expiry date must be after the publish date' }
  )

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>
