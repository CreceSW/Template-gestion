import { Package, Plus, Search, MoreVertical, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
          <p className="text-slate-500 mt-1">Gestiona tu inventario de productos</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Productos</p>
                <p className="text-3xl font-bold text-slate-900">456</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">En Stock</p>
                <p className="text-3xl font-bold text-green-600">423</p>
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
                <p className="text-sm font-medium text-slate-500">Stock Bajo</p>
                <p className="text-3xl font-bold text-orange-600">28</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Sin Stock</p>
                <p className="text-3xl font-bold text-red-600">5</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <span className="text-xl">✕</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Productos</CardTitle>
              <CardDescription>Todos tus productos en inventario</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                placeholder="Buscar productos..."
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
                  <th className="pb-3">Producto</th>
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Categoría</th>
                  <th className="pb-3">Precio</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <ProductRow
                  name="Laptop HP Pavilion"
                  sku="SKU-001"
                  category="Electrónica"
                  price="€899.00"
                  stock={45}
                  minStock={10}
                  status="ACTIVE"
                />
                <ProductRow
                  name="Mouse Logitech MX"
                  sku="SKU-002"
                  category="Accesorios"
                  price="€79.99"
                  stock={120}
                  minStock={20}
                  status="ACTIVE"
                />
                <ProductRow
                  name="Teclado Mecánico"
                  sku="SKU-003"
                  category="Accesorios"
                  price="€149.99"
                  stock={8}
                  minStock={15}
                  status="ACTIVE"
                />
                <ProductRow
                  name="Monitor 27 pulgadas"
                  sku="SKU-004"
                  category="Electrónica"
                  price="€299.00"
                  stock={0}
                  minStock={5}
                  status="OUT_OF_STOCK"
                />
                <ProductRow
                  name="Webcam HD"
                  sku="SKU-005"
                  category="Accesorios"
                  price="€59.99"
                  stock={65}
                  minStock={10}
                  status="ACTIVE"
                />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProductRow({
  name,
  sku,
  category,
  price,
  stock,
  minStock,
  status,
}: {
  name: string
  sku: string
  category: string
  price: string
  stock: number
  minStock: number
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
}) {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-slate-100 text-slate-800',
    OUT_OF_STOCK: 'bg-red-100 text-red-800',
  }

  const statusLabels = {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    OUT_OF_STOCK: 'Sin Stock',
  }

  const isLowStock = stock > 0 && stock < minStock
  const stockColor = stock === 0 ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-slate-900'

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="py-4 font-medium text-slate-900">{name}</td>
      <td className="py-4 text-slate-600">{sku}</td>
      <td className="py-4 text-slate-600">{category}</td>
      <td className="py-4 font-medium text-slate-900">{price}</td>
      <td className="py-4">
        <span className={`font-medium ${stockColor}`}>
          {stock}
          {isLowStock && ' ⚠️'}
        </span>
      </td>
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
