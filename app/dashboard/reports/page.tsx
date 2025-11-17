import { BarChart3, TrendingUp, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reportes</h1>
          <p className="text-slate-500 mt-1">Análisis y estadísticas del negocio</p>
        </div>
        <Button className="gap-2" variant="outline">
          <Download className="h-4 w-4" />
          Exportar Reportes
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Ventas del Mes</p>
              <p className="text-3xl font-bold text-slate-900">€45,678</p>
              <p className="text-sm text-green-600 font-medium">+15.3% vs mes anterior</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Órdenes del Mes</p>
              <p className="text-3xl font-bold text-slate-900">89</p>
              <p className="text-sm text-red-600 font-medium">-3.1% vs mes anterior</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Ticket Promedio</p>
              <p className="text-3xl font-bold text-slate-900">€513</p>
              <p className="text-sm text-green-600 font-medium">+8.7% vs mes anterior</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Nuevos Clientes</p>
              <p className="text-3xl font-bold text-slate-900">45</p>
              <p className="text-sm text-green-600 font-medium">+22.5% vs mes anterior</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Mes</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Gráfico de barras</p>
                <p className="text-xs text-slate-400 mt-1">Integrar recharts o chart.js</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crecimiento de Clientes</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Gráfico de líneas</p>
                <p className="text-xs text-slate-400 mt-1">Integrar recharts o chart.js</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Más Vendidos</CardTitle>
          <CardDescription>Top 5 del mes actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TopProductItem name="Laptop HP Pavilion" sales={45} revenue="€40,455" rank={1} />
            <TopProductItem name="Monitor 27 pulgadas" sales={38} revenue="€11,362" rank={2} />
            <TopProductItem name="Mouse Logitech MX" sales={120} revenue="€9,599" rank={3} />
            <TopProductItem name="Teclado Mecánico" sales={32} revenue="€4,800" rank={4} />
            <TopProductItem name="Webcam HD" sales={65} revenue="€3,899" rank={5} />
          </div>
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
