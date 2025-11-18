'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bell, Search, LogOut, Settings, Users, Package, ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SearchResult {
  id: string
  type: 'customer' | 'product' | 'order'
  title: string
  subtitle: string
  href: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{
    customers: SearchResult[]
    products: SearchResult[]
    orders: SearchResult[]
  }>({ customers: [], products: [], orders: [] })
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const data = await res.json()
          setNotifications(data.notifications || [])
          setUnreadCount(data.unreadCount || 0)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true)
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
          if (res.ok) {
            const data = await res.json()
            setSearchResults(data.results)
            setShowSearch(true)
          }
        } catch (error) {
          console.error('Error searching:', error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults({ customers: [], products: [], orders: [] })
        setShowSearch(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (href: string) => {
    router.push(href)
    setShowSearch(false)
    setSearchQuery('')
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      })
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'customer':
        return <Users className="w-4 h-4 text-blue-500" />
      case 'product':
        return <Package className="w-4 h-4 text-green-500" />
      case 'order':
        return <ShoppingCart className="w-4 h-4 text-purple-500" />
      default:
        return null
    }
  }

  const totalResults =
    searchResults.customers.length +
    searchResults.products.length +
    searchResults.orders.length

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6">
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Buscar clientes, productos, órdenes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />

          {/* Search Results Dropdown */}
          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  Buscando...
                </div>
              ) : totalResults === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  No se encontraron resultados para "{searchQuery}"
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.customers.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50">
                        Clientes
                      </div>
                      {searchResults.customers.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.href)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left"
                        >
                          {getResultIcon(result.type)}
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {result.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {result.subtitle}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchResults.products.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50">
                        Productos
                      </div>
                      {searchResults.products.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.href)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left"
                        >
                          {getResultIcon(result.type)}
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {result.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {result.subtitle}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchResults.orders.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50">
                        Órdenes
                      </div>
                      {searchResults.orders.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.href)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left"
                        >
                          {getResultIcon(result.type)}
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {result.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {result.subtitle}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Marcar todas
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No hay notificaciones
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-slate-100 last:border-0 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          {new Date(notification.createdAt).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-3 text-center text-sm text-slate-600 hover:bg-slate-50 border-t border-slate-200"
                  onClick={() => setShowNotifications(false)}
                >
                  Configurar notificaciones
                </Link>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-medium">
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-slate-900">
                {session?.user?.name || 'Usuario'}
              </div>
              <div className="text-xs text-slate-500">
                {session?.user?.role || 'USER'}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                <div className="px-4 py-3 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-900">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session?.user?.email}
                  </p>
                </div>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  Configuración
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
