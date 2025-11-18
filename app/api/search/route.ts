import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const userId = session.user.id

    // Buscar en paralelo en todas las entidades
    const [customers, products, orders] = await Promise.all([
      // Buscar clientes
      prisma.customer.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        take: 5,
      }),

      // Buscar productos
      prisma.product.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { sku: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          sku: true,
        },
        take: 5,
      }),

      // Buscar órdenes
      prisma.order.findMany({
        where: {
          customer: {
            userId,
          },
          OR: [
            { orderNumber: { contains: query, mode: 'insensitive' } },
            { customer: { name: { contains: query, mode: 'insensitive' } } },
          ],
        },
        select: {
          id: true,
          orderNumber: true,
          customer: {
            select: {
              name: true,
            },
          },
        },
        take: 5,
      }),
    ])

    const results = {
      customers: customers.map((c) => ({
        id: c.id,
        type: 'customer' as const,
        title: c.name,
        subtitle: c.email,
        href: `/dashboard/customers?id=${c.id}`,
      })),
      products: products.map((p) => ({
        id: p.id,
        type: 'product' as const,
        title: p.name,
        subtitle: p.sku,
        href: `/dashboard/products?id=${p.id}`,
      })),
      orders: orders.map((o) => ({
        id: o.id,
        type: 'order' as const,
        title: `Orden #${o.orderNumber}`,
        subtitle: o.customer.name,
        href: `/dashboard/orders?id=${o.id}`,
      })),
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error en búsqueda:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
