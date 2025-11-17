'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Search, Eye, Loader2, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toast } from '@/components/ui/toast'

interface Order {
  id: string
  orderNumber: string
  customer: {
    id: string
    name: string
    email: string
  }
  items: Array<{
    id: string
    product: {
      id: string
      name: string
      sku: string
    }
    quantity: number
    price: number
    subtotal: number
  }>
  subtotal: number
  tax: number
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  notes: string | null
  createdAt: string
  updatedAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredOrders(filtered)
  }, [searchTerm, orders])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('Error al cargar órdenes')
      const data = await response.json()
      setOrders(data)
      setFilteredOrders(data)
    } catch (error) {
      setToast({ message: 'Error al cargar órdenes', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Error al actualizar estado')

      setToast({ message: 'Estado actualizado exitosamente', type: 'success' })
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        const updatedOrder = await response.json()
        setSelectedOrder(updatedOrder)
      }
    } catch (error) {
      setToast({ message: 'Error al actualizar estado', type: 'error' })
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    completed: orders.filter((o) => o.status === 'DELIVERED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-slate-400" />
      </div>
    )
  }

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
          <h1 className="text-3xl font-bold text-slate-900">Órdenes</h1>
          <p className="text-slate-500 mt-1">Gestiona todas las órdenes de compra</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Órdenes</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
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
                <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
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
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
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
                <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchTerm ? 'No se encontraron órdenes' : 'No hay órdenes registradas'}
              </p>
            </div>
          ) : (
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
                  {filteredOrders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onView={setSelectedOrder}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Orden {selectedOrder.orderNumber}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(selectedOrder.createdAt).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Cliente</h3>
                <p className="text-slate-700">{selectedOrder.customer.name}</p>
                <p className="text-sm text-slate-500">{selectedOrder.customer.email}</p>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Productos</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.product.name}</p>
                        <p className="text-xs text-slate-500">SKU: {item.product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-700">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                        <p className="font-semibold text-slate-900">
                          ${item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Impuestos:</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t">
                  <span>Total:</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Estado</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="CONFIRMED">Confirmada</option>
                  <option value="PROCESSING">Procesando</option>
                  <option value="SHIPPED">Enviada</option>
                  <option value="DELIVERED">Entregada</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Notas</h3>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OrderRow({
  order,
  onView,
  onStatusChange,
}: {
  order: Order
  onView: (order: Order) => void
  onStatusChange: (id: string, status: string) => void
}) {
  const statusColors = {
    PENDING: 'bg-orange-100 text-orange-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-cyan-100 text-cyan-800',
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
      <td className="py-4 font-mono text-xs font-medium text-slate-900">
        {order.orderNumber}
      </td>
      <td className="py-4">
        <div>
          <p className="font-medium text-slate-900">{order.customer.name}</p>
          <p className="text-xs text-slate-500">{order.customer.email}</p>
        </div>
      </td>
      <td className="py-4 text-slate-600">
        {new Date(order.createdAt).toLocaleDateString('es-MX')}
      </td>
      <td className="py-4 text-slate-600">{order.items.length}</td>
      <td className="py-4 font-semibold text-slate-900">
        ${order.total.toFixed(2)}
      </td>
      <td className="py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusColors[order.status]
          }`}
        >
          {statusLabels[order.status]}
        </span>
      </td>
      <td className="py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(order)}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Ver
        </Button>
      </td>
    </tr>
  )
}
