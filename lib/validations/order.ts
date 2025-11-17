import { z } from 'zod'

export const orderItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.coerce.number().int().positive('La cantidad debe ser mayor a 0'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
})

export const orderSchema = z.object({
  customerId: z.string().cuid('Cliente inválido'),
  items: z.array(orderItemSchema).min(1, 'Debe haber al menos un item'),
  notes: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).default('PENDING'),
})

export const updateOrderSchema = orderSchema.partial()

export type OrderFormData = z.infer<typeof orderSchema>
export type OrderItemFormData = z.infer<typeof orderItemSchema>
