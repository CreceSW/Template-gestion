import { ShoppingCart, Plus, Search, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Órdenes</h1>
          <p className="text-slate-500 mt-1">Gestiona todas las órdenes de compra</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Orden
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Órdenes</p>
                <p className="text-3xl font-bold text-slate-900">89</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pendientes</p>
                <p className="text-3xl font-bold text-orange-600">23</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <span className="text-xl">⏱</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Completadas</p>
                <p className="text-3xl font-bold text-green-600">58</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <span className="text-xl">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Canceladas</p>
                <p className="text-3xl font-bold text-red-600">8</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <span className="text-xl">✕</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Órdenes</CardTitle>
              <CardDescription>Todas las órdenes registradas</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                placeholder="Buscar órdenes..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left text-sm font-medium text-slate-500">
                  <th className="pb-3">Nº Orden</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Fecha</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <OrderRow
                  orderNumber="ORD-001"
                  customer="Juan Pérez"
                  date="2025-11-15"
                  items={3}
                  total="€1,234.50"
                  status="DELIVERED"
                />
                <OrderRow
                  orderNumber="ORD-002"
                  customer="María García"
                  date="2025-11-16"
                  items={5}
                  total="€2,890.00"
                  status="PROCESSING"
                />
                <OrderRow
                  orderNumber="ORD-003"
                  customer="Carlos López"
                  date="2025-11-16"
                  items={2}
                  total="€567.99"
                  status="SHIPPED"
                />
                <OrderRow
                  orderNumber="ORD-004"
                  customer="Ana Martínez"
                  date="2025-11-17"
                  items={1}
                  total="€149.99"
                  status="PENDING"
                />
                <OrderRow
                  orderNumber="ORD-005"
                  customer="Pedro Sánchez"
                  date="2025-11-17"
                  items={4}
                  total="€1,899.00"
                  status="CONFIRMED"
                />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OrderRow({
  orderNumber,
  customer,
  date,
  items,
  total,
  status,
}: {
  orderNumber: string
  customer: string
  date: string
  items: number
  total: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}) {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  const statusLabels = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    PROCESSING: 'Procesando',
    SHIPPED: 'Enviada',
    DELIVERED: 'Entregada',
    CANCELLED: 'Cancelada',
  }

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="py-4 font-medium text-slate-900">{orderNumber}</td>
      <td className="py-4 text-slate-600">{customer}</td>
      <td className="py-4 text-slate-600">{date}</td>
      <td className="py-4 text-slate-600">{items} items</td>
      <td className="py-4 font-medium text-slate-900">{total}</td>
      <td className="py-4">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </td>
      <td className="py-4">
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  )
}
