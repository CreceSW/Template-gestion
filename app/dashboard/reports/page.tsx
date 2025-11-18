'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Download, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toast } from '@/components/ui/toast'

interface ReportStats {
  revenue: {
    total: number
    trend: number
  }
  orders: {
    total: number
    trend: number
  }
  customers: {
    total: number
    active: number
    trend: number
  }
  products: {
    total: number
    lowStock: number
  }
}

interface TopProduct {
  name: string
  totalSold: number
  revenue: number
}

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Obtener estadísticas del dashboard
      const statsResponse = await fetch('/api/dashboard/stats')
      if (!statsResponse.ok) throw new Error('Error al cargar estadísticas')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Obtener órdenes para calcular productos más vendidos
      const ordersResponse = await fetch('/api/orders')
      if (ordersResponse.ok) {
        const orders = await ordersResponse.json()

        // Calcular productos más vendidos
        const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}

        orders.forEach((order: any) => {
          order.items.forEach((item: any) => {
            const productId = item.product.id
            if (!productSales[productId]) {
              productSales[productId] = {
                name: item.product.name,
                quantity: 0,
                revenue: 0,
              }
            }
            productSales[productId].quantity += item.quantity
            productSales[productId].revenue += item.subtotal
          })
        })

        const sorted = Object.values(productSales)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)
          .map(p => ({
            name: p.name,
            totalSold: p.quantity,
            revenue: p.revenue,
          }))

        setTopProducts(sorted)
      }
    } catch (error) {
      setToast({ message: 'Error al cargar datos', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    if (!stats) return

    // Crear CSV con los datos
    const csvContent = `Reporte de Ventas\n\nMétrica,Valor,Tendencia\nIngresos Totales,$${stats.revenue.total.toFixed(2)},${stats.revenue.trend}%\nTotal Órdenes,${stats.orders.total},${stats.orders.trend}%\nTotal Clientes,${stats.customers.total},${stats.customers.trend}%\nClientes Activos,${stats.customers.active},-\n\nProductos Más Vendidos\nProducto,Unidades,Ingresos\n${topProducts.map(p => `${p.name},${p.totalSold},$${p.revenue.toFixed(2)}`).join('\n')}`

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `reporte-${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    setToast({ message: 'Reporte exportado exitosamente', type: 'success' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-slate-400" />
      </div>
    )
  }

  const avgTicket = stats && stats.orders.total > 0
    ? stats.revenue.total / stats.orders.total
    : 0

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reportes</h1>
          <p className="text-slate-500 mt-1">Análisis y estadísticas del negocio</p>
        </div>
        <Button className="gap-2" variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Ingresos Totales</p>
              <p className="text-3xl font-bold text-slate-900">
                ${stats?.revenue.total.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0'}
              </p>
              <p className={`text-sm font-medium ${stats?.revenue.trend && stats.revenue.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.revenue.trend && stats.revenue.trend >= 0 ? '+' : ''}{stats?.revenue.trend || 0}% vs mes anterior
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Total Órdenes</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.orders.total || 0}</p>
              <p className={`text-sm font-medium ${stats?.orders.trend && stats.orders.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.orders.trend && stats.orders.trend >= 0 ? '+' : ''}{stats?.orders.trend || 0}% vs mes anterior
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Ticket Promedio</p>
              <p className="text-3xl font-bold text-slate-900">
                ${avgTicket.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-slate-500">Por orden</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Clientes Activos</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.customers.active || 0}</p>
              <p className={`text-sm font-medium ${stats?.customers.trend && stats.customers.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.customers.trend && stats.customers.trend >= 0 ? '+' : ''}{stats?.customers.trend || 0}% vs mes anterior
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Ventas</CardTitle>
            <CardDescription>Resumen por estado de órdenes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Órdenes Completadas</span>
                <span className="font-semibold text-green-600">{stats?.orders.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Órdenes Pendientes</span>
                <span className="font-semibold text-orange-600">{stats?.orders.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Órdenes Canceladas</span>
                <span className="font-semibold text-red-600">{stats?.orders.cancelled || 0}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">Total</span>
                  <span className="font-bold text-slate-900">{stats?.orders.total || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del Inventario</CardTitle>
            <CardDescription>Resumen de productos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Productos</span>
                <span className="font-semibold text-slate-900">{stats?.products.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Con Stock Suficiente</span>
                <span className="font-semibold text-green-600">
                  {(stats?.products.total || 0) - (stats?.products.lowStock || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Stock Bajo / Sin Stock</span>
                <span className="font-semibold text-red-600">{stats?.products.lowStock || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Más Vendidos</CardTitle>
          <CardDescription>Top 5 por ingresos generados</CardDescription>
        </CardHeader>
        <CardContent>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <TopProductItem
                  key={product.name}
                  name={product.name}
                  sales={product.totalSold}
                  revenue={`$${product.revenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                  rank={index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No hay datos de ventas disponibles
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TopProductItem({
  name,
  sales,
  revenue,
  rank,
}: {
  name: string
  sales: number
  revenue: string
  rank: number
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-bold">
        {rank}
      </div>
      <div className="flex-1">
        <p className="font-medium text-slate-900">{name}</p>
        <p className="text-sm text-slate-500">{sales} unidades vendidas</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-slate-900">{revenue}</p>
      </div>
    </div>
  )
}
