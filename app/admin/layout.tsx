'use client'

import type React from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LayoutDashboard, ShoppingCart, CreditCard, Users, BookOpen, LogOut, Menu } from 'lucide-react'


const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/customers', label: 'Customers', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    console.log('AdminLayout: isLoading=', isLoading, 'user=', user)
    if (isLoading) return
    if (!user) {
      console.log('Redirecting to login')
      router.push('/auth/login?redirect=/admin')
      return
    }
    if (user.role !== 'admin') {
      console.log('Redirecting to home, role=', user.role)
      router.push('/')
      return
    }
  }, [user, router, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-center mt-4">Loading...</p>
        </Card>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="p-6 max-w-md mx-auto">
          <h1 className="text-xl font-semibold mb-4">Access Denied</h1>
          <p className="mb-4">You need admin privileges to access this area.</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black" suppressHydrationWarning>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[90] lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed top-0 left-0 z-[100] w-64 h-screen bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:z-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">BookStore</h1>
                <p className="text-xs">Admin Panel</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.firstName?.[0] || 'A'}
                  {user.lastName?.[0] || 'D'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs truncate">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
      <div className="lg:ml-64 relative min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 lg:hidden shadow-sm">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => {
              console.log('Toggling sidebar, current:', sidebarOpen)
              setSidebarOpen(true)
            }}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <div />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}