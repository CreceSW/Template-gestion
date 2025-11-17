import { z } from 'zod'

export const customerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido').optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PROSPECT']).default('ACTIVE'),
})

export const updateCustomerSchema = customerSchema.partial()

export type CustomerFormData = z.infer<typeof customerSchema>
