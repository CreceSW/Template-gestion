import { Users, Plus, Search, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-500 mt-1">Gestiona tu cartera de clientes</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Clientes</p>
                <p className="text-3xl font-bold text-slate-900">1,234</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Activos</p>
                <p className="text-3xl font-bold text-green-600">1,156</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Prospectos</p>
                <p className="text-3xl font-bold text-orange-600">78</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xl">★</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>Todos tus clientes registrados</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                placeholder="Buscar clientes..."
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
                  <th className="pb-3">Nombre</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Teléfono</th>
                  <th className="pb-3">Ciudad</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <CustomerRow
                  name="Juan Pérez"
                  email="juan@example.com"
                  phone="+34 600 123 456"
                  city="Madrid"
                  status="ACTIVE"
                />
                <CustomerRow
                  name="María García"
                  email="maria@example.com"
                  phone="+34 600 234 567"
                  city="Barcelona"
                  status="ACTIVE"
                />
                <CustomerRow
                  name="Carlos López"
                  email="carlos@example.com"
                  phone="+34 600 345 678"
                  city="Valencia"
                  status="PROSPECT"
                />
                <CustomerRow
                  name="Ana Martínez"
                  email="ana@example.com"
                  phone="+34 600 456 789"
                  city="Sevilla"
                  status="ACTIVE"
                />
                <CustomerRow
                  name="Pedro Sánchez"
                  email="pedro@example.com"
                  phone="+34 600 567 890"
                  city="Bilbao"
                  status="INACTIVE"
                />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CustomerRow({
  name,
  email,
  phone,
  city,
  status,
}: {
  name: string
  email: string
  phone: string
  city: string
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT'
}) {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-slate-100 text-slate-800',
    PROSPECT: 'bg-orange-100 text-orange-800',
  }

  const statusLabels = {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    PROSPECT: 'Prospecto',
  }

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="py-4 font-medium text-slate-900">{name}</td>
      <td className="py-4 text-slate-600">{email}</td>
      <td className="py-4 text-slate-600">{phone}</td>
      <td className="py-4 text-slate-600">{city}</td>
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
