import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Bienvenido al sistema de gestión</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clientes"
          value="1,234"
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Productos"
          value="456"
          icon={Package}
          trend={{ value: 8.2, isPositive: true }}
          iconColor="text-green-600"
        />
        <StatCard
          title="Órdenes"
          value="89"
          icon={ShoppingCart}
          trend={{ value: -3.1, isPositive: false }}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Ingresos"
          value="€45,678"
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
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
            <div className="space-y-4">
              <ActivityItem
                action="Nueva orden creada"
                user="Juan Pérez"
                time="Hace 5 minutos"
                icon={ShoppingCart}
                iconColor="text-green-600"
              />
              <ActivityItem
                action="Cliente registrado"
                user="María García"
                time="Hace 1 hora"
                icon={Users}
                iconColor="text-blue-600"
              />
              <ActivityItem
                action="Producto actualizado"
                user="Carlos López"
                time="Hace 2 horas"
                icon={Package}
                iconColor="text-orange-600"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos con Stock Bajo</CardTitle>
            <CardDescription>Productos que necesitan reabastecimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <LowStockItem
                name="Producto A"
                sku="SKU-001"
                stock={5}
                minStock={10}
              />
              <LowStockItem
                name="Producto B"
                sku="SKU-002"
                stock={3}
                minStock={15}
              />
              <LowStockItem
                name="Producto C"
                sku="SKU-003"
                stock={8}
                minStock={20}
              />
            </div>
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
              <p className="text-xs text-slate-400 mt-1">Integrar librería de charts (recharts, chart.js)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ActivityItem({
  action,
  user,
  time,
  icon: Icon,
  iconColor,
}: {
  action: string
  user: string
  time: string
  icon: React.ElementType
  iconColor: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`rounded-full bg-slate-100 p-2 ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-slate-900">{action}</p>
        <p className="text-xs text-slate-500">
          {user} • {time}
        </p>
      </div>
    </div>
  )
}

function LowStockItem({
  name,
  sku,
  stock,
  minStock,
}: {
  name: string
  sku: string
  stock: number
  minStock: number
}) {
  const percentage = (stock / minStock) * 100
  const isVeryLow = percentage < 30

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{sku}</p>
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
