import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export type UserRole = 'USER' | 'ADMIN' | 'MANAGER'

// Permisos por rol
const rolePermissions: Record<UserRole, string[]> = {
  USER: [
    'read:own',
    'create:own',
    'update:own',
    'delete:own',
  ],
  MANAGER: [
    'read:own',
    'create:own',
    'update:own',
    'delete:own',
    'read:all',
    'export:data',
  ],
  ADMIN: [
    'read:own',
    'create:own',
    'update:own',
    'delete:own',
    'read:all',
    'create:all',
    'update:all',
    'delete:all',
    'manage:users',
    'export:data',
    'import:data',
    'manage:settings',
  ],
}

export async function getAuthSession() {
  const session = await getServerSession(authOptions)
  return session
}

export async function requireAuth() {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
      session: null,
    }
  }

  return { error: null, session }
}

export async function requireRole(requiredRoles: UserRole[]) {
  const { error, session } = await requireAuth()

  if (error) {
    return { error, session: null }
  }

  const userRole = (session?.user?.role as UserRole) || 'USER'

  if (!requiredRoles.includes(userRole)) {
    return {
      error: NextResponse.json(
        { error: 'No tienes permisos para realizar esta acción' },
        { status: 403 }
      ),
      session: null,
    }
  }

  return { error: null, session }
}

export function hasPermission(role: UserRole, permission: string): boolean {
  return rolePermissions[role]?.includes(permission) || false
}

export async function requirePermission(permission: string) {
  const { error, session } = await requireAuth()

  if (error) {
    return { error, session: null }
  }

  const userRole = (session?.user?.role as UserRole) || 'USER'

  if (!hasPermission(userRole, permission)) {
    return {
      error: NextResponse.json(
        { error: 'No tienes permisos para realizar esta acción' },
        { status: 403 }
      ),
      session: null,
    }
  }

  return { error: null, session }
}

// Verificar que el usuario es admin
export async function requireAdmin() {
  return requireRole(['ADMIN'])
}

// Verificar que el usuario es admin o manager
export async function requireAdminOrManager() {
  return requireRole(['ADMIN', 'MANAGER'])
}

// Crear notificación para el usuario
export async function createNotification(
  userId: string,
  type: 'ORDER_CREATED' | 'LOW_STOCK' | 'NEW_CUSTOMER' | 'SYSTEM',
  title: string,
  message: string,
  data?: Record<string, unknown>
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data || {},
      },
    })
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}
