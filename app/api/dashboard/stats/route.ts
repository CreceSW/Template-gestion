import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener conteos y estadísticas
    const [
      totalCustomers,
      activeCustomers,
      totalProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      recentOrders,
    ] = await Promise.all([
      // Clientes
      prisma.customer.count({
        where: { userId: session.user.id },
      }),
      prisma.customer.count({
        where: { userId: session.user.id, status: 'ACTIVE' },
      }),
      // Productos
      prisma.product.count({
        where: { userId: session.user.id },
      }),
      prisma.product.count({
        where: {
          userId: session.user.id,
          stock: { lte: prisma.product.fields.minStock },
        },
      }),
      // Órdenes
      prisma.order.count({
        where: {
          customer: {
            userId: session.user.id,
          },
        },
      }),
      prisma.order.count({
        where: {
          customer: {
            userId: session.user.id,
          },
          status: 'PENDING',
        },
      }),
      prisma.order.count({
        where: {
          customer: {
            userId: session.user.id,
          },
          status: 'DELIVERED',
        },
      }),
      prisma.order.count({
        where: {
          customer: {
            userId: session.user.id,
          },
          status: 'CANCELLED',
        },
      }),
      // Órdenes recientes
      prisma.order.findMany({
        where: {
          customer: {
            userId: session.user.id,
          },
        },
        include: {
          customer: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      }),
    ])

    // Calcular ingresos totales
    const ordersWithTotal = await prisma.order.aggregate({
      where: {
        customer: {
          userId: session.user.id,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      _sum: {
        total: true,
      },
    })

    const totalRevenue = ordersWithTotal._sum.total || 0

    // Productos con stock bajo
    const lowStockProductsList = await prisma.product.findMany({
      where: {
        userId: session.user.id,
        stock: {
          lte: prisma.product.fields.minStock,
        },
      },
      take: 5,
      orderBy: {
        stock: 'asc',
      },
    })

    // Calcular tendencias (comparar con mes anterior - simulado por ahora)
    const customersTrend = 5.2
    const productsTrend = -2.1
    const ordersTrend = 8.7
    const revenueTrend = 12.5

    return NextResponse.json({
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        trend: customersTrend,
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
        trend: productsTrend,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        trend: ordersTrend,
      },
      revenue: {
        total: Number(totalRevenue),
        trend: revenueTrend,
      },
      recentActivity: recentOrders.map(order => ({
        id: order.id,
        type: 'order',
        description: `Nueva orden de ${order.customer.name}`,
        amount: Number(order.total),
        date: order.createdAt,
        status: order.status,
      })),
      alerts: lowStockProductsList.map(product => ({
        id: product.id,
        type: 'stock',
        product: product.name,
        current: product.stock,
        minimum: product.minStock,
        severity: product.stock === 0 ? 'high' : 'medium',
      })),
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
