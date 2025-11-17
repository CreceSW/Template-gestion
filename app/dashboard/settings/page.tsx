import { Settings, User, Lock, Bell, Database } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-500 mt-1">Personaliza tu sistema de gestión</p>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Perfil de Usuario</CardTitle>
                <CardDescription>Gestiona tu información personal</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Guardar Cambios</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <Lock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>Protege tu cuenta</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Contraseña Actual</label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Nueva Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Confirmar Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Actualizar Contraseña</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-100 p-2">
                <Bell className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Configura tus preferencias de notificación</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <NotificationToggle
              title="Nuevas órdenes"
              description="Recibe notificaciones cuando se cree una nueva orden"
              defaultChecked
            />
            <NotificationToggle
              title="Stock bajo"
              description="Alerta cuando un producto tenga stock bajo"
              defaultChecked
            />
            <NotificationToggle
              title="Nuevos clientes"
              description="Notificaciones de nuevos registros de clientes"
            />
            <NotificationToggle
              title="Reportes semanales"
              description="Recibe un resumen semanal por email"
              defaultChecked
            />
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Base de Datos</CardTitle>
                <CardDescription>Configuración de PostgreSQL y Prisma</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Estado de Conexión</p>
                  <p className="text-xs text-slate-500 mt-1">PostgreSQL conectado</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                  Conectado
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Ejecutar Migraciones</Button>
              <Button variant="outline">Abrir Prisma Studio</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NotificationToggle({
  title,
  description,
  defaultChecked = false,
}: {
  title: string
  description: string
  defaultChecked?: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-900 peer-focus:ring-offset-2"></div>
      </label>
    </div>
  )
}
