"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, ShoppingCart, CreditCard, AlertTriangle, TrendingUp, Users, Eye, BookOpen, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { adminService } from "@/lib/admin-service"
import { type Order, type PaymentTransaction, type AdminStats } from "@/lib/admin-data"



export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [recentTransactions, setRecentTransactions] = useState<PaymentTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [statsData, ordersData, transactionsData] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getRecentOrders(5),
        adminService.getRecentTransactions(5)
      ])
      setStats(statsData)
      setRecentOrders(ordersData)
      setRecentTransactions(transactionsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true)
        const [statsData, ordersData, transactionsData] = await Promise.all([
          adminService.getAdminStats(),
          adminService.getRecentOrders(5),
          adminService.getRecentTransactions(5)
        ])
        setStats(statsData)
        setRecentOrders(ordersData)
        setRecentTransactions(transactionsData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getStatusBadge = (status: string, type: "order" | "payment") => {
    const variants = {
      order: {
        pending: "secondary",
        processing: "default",
        shipped: "default",
        delivered: "default",
        cancelled: "destructive",
      },
      payment: {
        pending: "secondary",
        completed: "default",
        failed: "destructive",
        cancelled: "destructive",
      },
    }

    return <Badge variant={variants[type][status as keyof (typeof variants)[typeof type]] as any}>{status}</Badge>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-destructive">{error}</p>
          <Button onClick={loadDashboardData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ]">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your bookstore.</p>
        </div>
        {/**<Button 
          variant="outline" 
          onClick={loadDashboardData}
          disabled={isLoading}
          className="gap-2"
        >
         <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> 
          Refresh
        </Button>
        */} 
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              {stats.monthlyRevenue && stats.monthlyRevenue.length >= 2 
                ? `${((stats.monthlyRevenue[7] - stats.monthlyRevenue[6]) / stats.monthlyRevenue[6] * 100).toFixed(1)}%`
                : '0%'} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{stats.todayOrders} orders today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.failedPayments}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>M-Pesa</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{stats.paymentMethodStats.mpesa}</div>
                  <div className="text-xs text-muted-foreground">
                    {((stats.paymentMethodStats.mpesa / stats.totalOrders) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Credit Card</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{stats.paymentMethodStats.card}</div>
                  <div className="text-xs text-muted-foreground">
                    {((stats.paymentMethodStats.card / stats.totalOrders) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/payments">
                <CreditCard className="mr-2 h-4 w-4" />
                View All Payments
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin/orders">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Manage Orders
              </Link>
            </Button>
            {/* <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin/books">
                <BookOpen className="mr-2 h-4 w-4" />
                Add New Book
              </Link>
            </Button> */}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Order #{order.id}</span>
                      {getStatusBadge(order.status, "order")}
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${order.total_amount.toFixed(2)}</div>
                    {getStatusBadge(order.payment_status, "payment")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/payments">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{transaction.orderNumber}</span>
                      {getStatusBadge(transaction.status, "payment")}
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.mpesa_receipt_number || transaction.transaction_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${transaction.amount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground uppercase">{transaction.payment_method}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
