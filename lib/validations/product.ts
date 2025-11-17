import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  description: z.string().optional().nullable(),
  sku: z.string().min(3, 'SKU debe tener al menos 3 caracteres').max(50),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  cost: z.coerce.number().positive('El costo debe ser mayor a 0').optional().nullable(),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo').default(0),
  minStock: z.coerce.number().int().min(0, 'El stock mínimo no puede ser negativo').default(0),
  category: z.string().max(50).optional().nullable(),
  image: z.string().url().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).default('ACTIVE'),
})

export const updateProductSchema = productSchema.partial()

export type ProductFormData = z.infer<typeof productSchema>
