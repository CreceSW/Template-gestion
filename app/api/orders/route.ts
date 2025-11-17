import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
})

const orderSchema = z.object({
  customerId: z.string(),
  items: z.array(orderItemSchema).min(1, 'Debe haber al menos un item'),
  tax: z.number().min(0).optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
})

// GET - Obtener todas las órdenes
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const orders = await prisma.order.findMany({
      where: {
        customer: {
          userId: session.user.id,
        },
        ...(status && { status: status as any }),
        ...(customerId && { customerId }),
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Error al obtener órdenes' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva orden
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = orderSchema.parse(body)

    // Verificar que el cliente existe y pertenece al usuario
    const customer = await prisma.customer.findFirst({
      where: {
        id: validatedData.customerId,
        userId: session.user.id,
      },
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que todos los productos existen y pertenecen al usuario
    const productIds = validatedData.items.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        userId: session.user.id,
      },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Uno o más productos no encontrados' },
        { status: 404 }
      )
    }

    // Calcular totales
    const subtotal = validatedData.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)

    const tax = validatedData.tax || 0
    const total = subtotal + tax

    // Generar número de orden único
    const orderCount = await prisma.order.count()
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`

    // Crear orden con items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: validatedData.customerId,
        subtotal,
        tax,
        total,
        status: validatedData.status || 'PENDING',
        notes: validatedData.notes,
        items: {
          create: validatedData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Actualizar stock de productos
    for (const item of validatedData.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al crear orden' },
      { status: 500 }
    )
  }
}
