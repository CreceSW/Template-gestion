'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardStats {
  customers: {
    total: number
    active: number
    trend: number
  }
  products: {
    total: number
    lowStock: number
    trend: number
  }
  orders: {
    total: number
    pending: number
    completed: number
    cancelled: number
    trend: number
  }
  revenue: {
    total: number
    trend: number
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    amount: number
    date: string
    status: string
  }>
  alerts: Array<{
    id: string
    type: string
    product: string
    current: number
    minimum: number
    severity: string
  }>
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')

        if (!response.ok) {
          throw new Error('Error al cargar estadísticas')
        }

        const data = await response.json()
        setStats(data)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchStats()
    }
  }, [session])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Bienvenido, {session?.user?.name || 'Usuario'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clientes"
          value={stats.customers.total.toString()}
          icon={Users}
          trend={{ value: stats.customers.trend, isPositive: stats.customers.trend >= 0 }}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Productos"
          value={stats.products.total.toString()}
          icon={Package}
          trend={{ value: stats.products.trend, isPositive: stats.products.trend >= 0 }}
          iconColor="text-green-600"
        />
        <StatCard
          title="Órdenes"
          value={stats.orders.total.toString()}
          icon={ShoppingCart}
          trend={{ value: stats.orders.trend, isPositive: stats.orders.trend >= 0 }}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Ingresos"
          value={`$${stats.revenue.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend={{ value: stats.revenue.trend, isPositive: stats.revenue.trend >= 0 }}
          iconColor="text-purple-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    description={activity.description}
                    amount={activity.amount}
                    date={new Date(activity.date).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    status={activity.status}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No hay actividad reciente
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos con Stock Bajo</CardTitle>
            <CardDescription>Productos que necesitan reabastecimiento</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.alerts.length > 0 ? (
              <div className="space-y-4">
                {stats.alerts.map((alert) => (
                  <LowStockItem
                    key={alert.id}
                    name={alert.product}
                    stock={alert.current}
                    minStock={alert.minimum}
                    severity={alert.severity}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                Todos los productos tienen stock suficiente
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Órdenes Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats.orders.pending}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.customers.active}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              De {stats.customers.total} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {stats.products.lowStock}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Productos necesitan reabastecimiento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Ventas del Mes</CardTitle>
          <CardDescription>Resumen de ventas de los últimos 30 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Gráfico de ventas</p>
              <p className="text-xs text-slate-400 mt-1">
                Total de órdenes completadas: {stats.orders.completed}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ActivityItem({
  description,
  amount,
  date,
  status,
}: {
  description: string
  amount: number
  date: string
  status: string
}) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DELIVERED: 'text-green-600 bg-green-100',
      SHIPPED: 'text-blue-600 bg-blue-100',
      PENDING: 'text-orange-600 bg-orange-100',
      CANCELLED: 'text-red-600 bg-red-100',
    }
    return colors[status] || 'text-slate-600 bg-slate-100'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      DELIVERED: 'Entregada',
      SHIPPED: 'Enviada',
      PENDING: 'Pendiente',
      CANCELLED: 'Cancelada',
      CONFIRMED: 'Confirmada',
      PROCESSING: 'Procesando',
    }
    return labels[status] || status
  }

  return (
    <div className="flex items-start gap-3 border-b border-slate-100 last:border-0 pb-3 last:pb-0">
      <div className="rounded-full bg-slate-100 p-2 text-slate-600">
        <ShoppingCart className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-slate-900">{description}</p>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(status)}`}>
            {getStatusLabel(status)}
          </span>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
      </div>
      <div className="text-sm font-semibold text-slate-900">
        ${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      </div>
    </div>
  )
}

function LowStockItem({
  name,
  stock,
  minStock,
  severity,
}: {
  name: string
  stock: number
  minStock: number
  severity: string
}) {
  const percentage = (stock / minStock) * 100
  const isVeryLow = severity === 'high'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">
            {stock === 0 ? 'Sin stock' : `${stock} unidades disponibles`}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${isVeryLow ? 'text-red-600' : 'text-orange-600'}`}>
            {stock} / {minStock}
          </p>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${isVeryLow ? 'bg-red-500' : 'bg-orange-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
