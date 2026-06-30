import { z } from 'zod'

export const CreatePledgeSchema = z.object({
  borrowerName: z.string().min(2, 'Name must be at least 2 characters'),
  borrowerEmail: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  borrowerPhone: z
    .string()
    .min(11, 'Enter a valid Nigerian phone number'),
  amount: z.number().positive('Amount must be greater than zero'),
  purpose: z.string().min(3, 'Describe the purpose of this pledge'),
  dueDate: z.string().datetime(),
  reminderPreference: z.enum(['LIGHT', 'STANDARD', 'STRICT']),
})

export type CreatePledgeInput = z.infer<typeof CreatePledgeSchema>
