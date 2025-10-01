"use client"

import { useState, useEffect } from "react"
import { adminService } from "@/lib/admin-service"
import { mpesaService } from "@/lib/mpesa-service"
import { type PaymentTransaction, type AdminStats } from "@/lib/admin-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CreditCard,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const searchTransaction = async (receiptNumber: string) => {
    try {
      setIsSearching(true)
      const result = await mpesaService.searchTransaction(receiptNumber)
      // Update the local transaction with the latest status
      setTransactions(prev => prev.map(tx => 
        tx.mpesa_receipt_number === receiptNumber
          ? {
              ...tx,
              status: result.data.attributes.status as PaymentTransaction['status'],
              result_code: result.data.attributes.result_code,
              result_description: result.data.attributes.result_description
            }
          : tx
      ))
    } catch (error) {
      console.error('Error searching transaction:', error)
      setError('Failed to search transaction status')
    } finally {
      setIsSearching(false)
    }
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [transactionsData, statsData] = await Promise.all([
        adminService.getTransactions(),
        adminService.getAdminStats()
      ])
      setTransactions(transactionsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading payment data:', error)
      setError('Failed to load payment data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction.orderNumber && transaction.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.customerName && transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.customerEmail && transaction.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transaction.mpesa_receipt_number &&
        transaction.mpesa_receipt_number.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesMethod = methodFilter === "all" || transaction.payment_method === methodFilter

    return matchesSearch && matchesStatus && matchesMethod
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      cancelled: "destructive",
    }

    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-destructive">{error}</p>
          <Button onClick={loadData} variant="outline">
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
          <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading payment data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-playfair)]">Payment Management</h1>
          <p className="text-muted-foreground">Monitor and manage all payment transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">{stats?.paymentMethodStats?.mpesa || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{stats.pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-xl font-bold">{stats.failedPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">M-Pesa</p>
                <p className="text-xl font-bold">{stats.paymentMethodStats.mpesa}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by order number, customer, or receipt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="mpesa">M-Pesa</SelectItem>
                <SelectItem value="card">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt/ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.orderNumber}</div>
                        <div className="text-xs text-muted-foreground">Order ID: {transaction.order_id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.customerName}</div>
                        <div className="text-xs text-muted-foreground">{transaction.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.payment_method === "mpesa" ? (
                          <Smartphone className="h-4 w-4 text-green-600" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="capitalize">{transaction.payment_method}</span>
                      </div>
                      {transaction.phone_number && (
                        <div className="text-xs text-muted-foreground">{transaction.phone_number}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        {getStatusBadge(transaction.status)}
                      </div>
                      {transaction.result_description && (
                        <div className="text-xs text-muted-foreground mt-1">{transaction.result_description}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {transaction.mpesa_receipt_number || transaction.transaction_id || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(transaction.created_at).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => transaction.mpesa_receipt_number && searchTransaction(transaction.mpesa_receipt_number)}
                          disabled={isSearching || !transaction.mpesa_receipt_number}
                        >
                          <RefreshCw className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
