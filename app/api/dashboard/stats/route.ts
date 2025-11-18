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

    // Calcular tendencias comparando con mes anterior
    const now = new Date()
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Obtener datos del mes actual y anterior para tendencias
    const [
      currentMonthCustomers,
      lastMonthCustomers,
      currentMonthProducts,
      lastMonthProducts,
      currentMonthOrders,
      lastMonthOrders,
      currentMonthRevenue,
      lastMonthRevenue,
    ] = await Promise.all([
      // Clientes mes actual
      prisma.customer.count({
        where: {
          userId: session.user.id,
          createdAt: { gte: startOfCurrentMonth },
        },
      }),
      // Clientes mes anterior
      prisma.customer.count({
        where: {
          userId: session.user.id,
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
      // Productos mes actual
      prisma.product.count({
        where: {
          userId: session.user.id,
          createdAt: { gte: startOfCurrentMonth },
        },
      }),
      // Productos mes anterior
      prisma.product.count({
        where: {
          userId: session.user.id,
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
      // Órdenes mes actual
      prisma.order.count({
        where: {
          customer: { userId: session.user.id },
          createdAt: { gte: startOfCurrentMonth },
        },
      }),
      // Órdenes mes anterior
      prisma.order.count({
        where: {
          customer: { userId: session.user.id },
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
      // Ingresos mes actual
      prisma.order.aggregate({
        where: {
          customer: { userId: session.user.id },
          status: { not: 'CANCELLED' },
          createdAt: { gte: startOfCurrentMonth },
        },
        _sum: { total: true },
      }),
      // Ingresos mes anterior
      prisma.order.aggregate({
        where: {
          customer: { userId: session.user.id },
          status: { not: 'CANCELLED' },
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
        _sum: { total: true },
      }),
    ])

    // Calcular porcentajes de tendencia
    const calculateTrend = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Number((((current - previous) / previous) * 100).toFixed(1))
    }

    const customersTrend = calculateTrend(currentMonthCustomers, lastMonthCustomers)
    const productsTrend = calculateTrend(currentMonthProducts, lastMonthProducts)
    const ordersTrend = calculateTrend(currentMonthOrders, lastMonthOrders)
    const revenueTrend = calculateTrend(
      Number(currentMonthRevenue._sum.total || 0),
      Number(lastMonthRevenue._sum.total || 0)
    )

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
