import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
})

// GET - Obtener una orden
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        customer: {
          userId: session.user.id,
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

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Error al obtener orden' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar orden (principalmente para cambiar estado)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateOrderSchema.parse(body)

    // Verificar que la orden existe y pertenece al usuario
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: params.id,
        customer: {
          userId: session.user.id,
        },
      },
      include: {
        items: true,
      },
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Si se cancela la orden, restaurar el stock
    if (validatedData.status === 'CANCELLED' && existingOrder.status !== 'CANCELLED') {
      for (const item of existingOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        })
      }
    }

    const order = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: validatedData,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Error al actualizar orden' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar orden (solo si está en estado PENDING)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar que la orden existe y pertenece al usuario
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: params.id,
        customer: {
          userId: session.user.id,
        },
      },
      include: {
        items: true,
      },
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    if (existingOrder.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Solo se pueden eliminar órdenes en estado PENDING' },
        { status: 400 }
      )
    }

    // Restaurar el stock
    for (const item of existingOrder.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      })
    }

    await prisma.order.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Orden eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Error al eliminar orden' },
      { status: 500 }
    )
  }
}
