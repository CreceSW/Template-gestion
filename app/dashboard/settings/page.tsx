'use client'

import { useEffect, useState } from 'react'
import { Settings, User, Lock, Bell, Database, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toast } from '@/components/ui/toast'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface NotificationSettings {
  newOrders: boolean
  lowStock: boolean
  newCustomers: boolean
  weeklyReports: boolean
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newOrders: true,
    lowStock: true,
    newCustomers: false,
    weeklyReports: true,
  })

  useEffect(() => {
    fetchProfile()
    loadNotificationSettings()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile')
      if (!response.ok) throw new Error('Error al cargar perfil')
      const data = await response.json()
      setProfile(data)
      setProfileForm({
        name: data.name || '',
        email: data.email || '',
      })
    } catch (error) {
      setToast({ message: 'Error al cargar perfil', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const loadNotificationSettings = () => {
    const saved = localStorage.getItem('notificationSettings')
    if (saved) {
      setNotifications(JSON.parse(saved))
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar perfil')
      }

      const data = await response.json()
      setProfile(data.user)
      setToast({ message: 'Perfil actualizado exitosamente', type: 'success' })
    } catch (error: any) {
      setToast({ message: error.message, type: 'error' })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast({ message: 'Las contraseñas no coinciden', type: 'error' })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setToast({ message: 'La contraseña debe tener al menos 6 caracteres', type: 'error' })
      return
    }

    setIsSavingPassword(true)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al cambiar contraseña')
      }

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setToast({ message: 'Contraseña actualizada exitosamente', type: 'success' })
    } catch (error: any) {
      setToast({ message: error.message, type: 'error' })
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    const updated = { ...notifications, [key]: value }
    setNotifications(updated)
    localStorage.setItem('notificationSettings', JSON.stringify(updated))
    setToast({ message: 'Preferencias guardadas', type: 'success' })
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
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configuracion</h1>
        <p className="text-slate-500 mt-1">Personaliza tu sistema de gestion</p>
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
                <CardDescription>Gestiona tu informacion personal</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Nombre</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="Tu nombre"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    placeholder="tu@email.com"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-500">
                  Rol: <span className="font-medium">{profile?.role || 'USER'}</span> |
                  Creado: <span className="font-medium">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-MX') : '-'}</span>
                </p>
                <Button type="submit" disabled={isSavingProfile}>
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
              </div>
            </form>
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
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Contrasena Actual</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="********"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Nueva Contrasena</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="********"
                    required
                    minLength={6}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Confirmar Contrasena</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="********"
                    required
                    minLength={6}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSavingPassword}>
                  {isSavingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Contrasena'
                  )}
                </Button>
              </div>
            </form>
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
                <CardDescription>Configura tus preferencias de notificacion</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <NotificationToggle
              title="Nuevas ordenes"
              description="Recibe notificaciones cuando se cree una nueva orden"
              checked={notifications.newOrders}
              onChange={(checked) => handleNotificationChange('newOrders', checked)}
            />
            <NotificationToggle
              title="Stock bajo"
              description="Alerta cuando un producto tenga stock bajo"
              checked={notifications.lowStock}
              onChange={(checked) => handleNotificationChange('lowStock', checked)}
            />
            <NotificationToggle
              title="Nuevos clientes"
              description="Notificaciones de nuevos registros de clientes"
              checked={notifications.newCustomers}
              onChange={(checked) => handleNotificationChange('newCustomers', checked)}
            />
            <NotificationToggle
              title="Reportes semanales"
              description="Recibe un resumen semanal por email"
              checked={notifications.weeklyReports}
              onChange={(checked) => handleNotificationChange('weeklyReports', checked)}
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
                <CardDescription>Configuracion de PostgreSQL y Prisma</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Estado de Conexion</p>
                  <p className="text-xs text-slate-500 mt-1">PostgreSQL conectado</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                  Conectado
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setToast({ message: 'Ejecuta "npx prisma migrate dev" en terminal', type: 'info' })}
              >
                Ejecutar Migraciones
              </Button>
              <Button
                variant="outline"
                onClick={() => setToast({ message: 'Ejecuta "npx prisma studio" en terminal', type: 'info' })}
              >
                Abrir Prisma Studio
              </Button>
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
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-900 peer-focus:ring-offset-2"></div>
      </label>
    </div>
  )
}
