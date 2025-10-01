export interface Order {
  id: string
  customer_id: string
  total_amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method: "mpesa" | "card" | null
  shipping_address: {
    address: string
    city: string
    postal_code: string
    phone: string
  }
  created_at: string
  updated_at: string
  // Frontend display fields
  customerName?: string
  customerEmail?: string
  items: Array<{
    bookId: string
    title: string
    author: string
    quantity: number
    price: number
  }>
}

export interface PaymentTransaction {
  id: string
  order_id: string
  amount: number
  payment_method: "mpesa" | "card"
  transaction_id?: string
  mpesa_receipt_number?: string
  phone_number?: string
  status: "pending" | "completed" | "failed" | "cancelled"
  created_at: string
  updated_at: string
  result_code?: string
  result_description?: string
  // Frontend display fields
  orderNumber?: string
  customerName?: string
  customerEmail?: string
}

export interface AdminStats {
  totalOrders: number
  totalRevenue: number
  pendingPayments: number
  failedPayments: number
  todayOrders: number
  todayRevenue: number
  monthlyRevenue: number[]
  paymentMethodStats: {
    mpesa: number
    card: number
  }
}

// Mock data
export const mockOrders: Order[] = [
  {
    id: "1",
    customer_id: "1",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [
      {
        bookId: "1",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        quantity: 1,
        price: 12.99,
      },
      {
        bookId: "2",
        title: "1984",
        author: "George Orwell",
        quantity: 2,
        price: 13.99,
      },
    ],
    total_amount: 46.96,
    status: "delivered",
    payment_status: "paid",
    payment_method: "mpesa",
    shipping_address: {
      address: "123 Main St",
      city: "Nairobi",
      postal_code: "00100",
      phone: "254712345678",
    },
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-16T14:20:00Z",
  },
  {
    id: "2",
    customer_id: "2",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    items: [
      {
        bookId: "3",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        quantity: 1,
        price: 11.99,
      },
    ],
    total_amount: 17.98,
    status: "processing",
    payment_status: "paid",
    payment_method: "mpesa",
    shipping_address: {
      address: "456 Oak Ave",
      city: "Mombasa",
      postal_code: "80100",
      phone: "254723456789",
    },
    created_at: "2024-01-16T09:15:00Z",
    updated_at: "2024-01-16T09:15:00Z",
  },
  {
    id: "3",
    customer_id: "3",
    customerName: "Bob Wilson",
    customerEmail: "bob@example.com",
    items: [
      {
        bookId: "4",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        quantity: 1,
        price: 10.99,
      },
    ],
    total_amount: 16.98,
    status: "pending",
    payment_status: "failed",
    payment_method: "mpesa",
    shipping_address: {
      address: "789 Pine St",
      city: "Kisumu",
      postal_code: "40100",
      phone: "254734567890",
    },
    created_at: "2024-01-16T15:45:00Z",
    updated_at: "2024-01-16T15:45:00Z",
  },
]

export const mockTransactions: PaymentTransaction[] = [
  {
    id: "1",
    order_id: "1",
    amount: 46.96,
    payment_method: "mpesa",
    status: "completed",
    mpesa_receipt_number: "NLJ7RT61SV",
    transaction_id: "ws_CO_1234567890",
    phone_number: "254712345678",
    created_at: "2024-01-15T10:35:00Z",
    updated_at: "2024-01-15T10:35:00Z",
    orderNumber: "ORD-001234",
    customerName: "John Doe",
    customerEmail: "john@example.com"
  },
  {
    id: "2",
    order_id: "2",
    amount: 17.98,
    payment_method: "mpesa",
    status: "completed",
    mpesa_receipt_number: "NLJ8RT62SV",
    transaction_id: "ws_CO_1234567891",
    phone_number: "254723456789",
    created_at: "2024-01-16T09:20:00Z",
    updated_at: "2024-01-16T09:20:00Z",
    orderNumber: "ORD-001235",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com"
  },
  {
    id: "3",
    order_id: "3",
    amount: 16.98,
    payment_method: "mpesa",
    status: "failed",
    transaction_id: "ws_CO_1234567892",
    phone_number: "254734567890",
    created_at: "2024-01-16T15:50:00Z",
    updated_at: "2024-01-16T15:50:00Z",
    orderNumber: "ORD-001236",
    customerName: "Bob Wilson",
    customerEmail: "bob@example.com"
  },
]

export const mockAdminStats: AdminStats = {
  totalOrders: 156,
  totalRevenue: 2847.5,
  pendingPayments: 3,
  failedPayments: 12,
  todayOrders: 8,
  todayRevenue: 156.75,
  monthlyRevenue: [1200, 1450, 1680, 1890, 2100, 2350, 2600, 2847.5],
  paymentMethodStats: {
    mpesa: 142,
    card: 14,
  },
}

// Helper functions
export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((order) => order.id === id)
}

export function getTransactionById(id: string): PaymentTransaction | undefined {
  return mockTransactions.find((transaction) => transaction.id === id)
}

export function getOrdersByStatus(status: Order["status"]): Order[] {
  return mockOrders.filter((order) => order.status === status)
}

export function getTransactionsByStatus(status: PaymentTransaction["status"]): PaymentTransaction[] {
  return mockTransactions.filter((transaction) => transaction.status === status)
}

export function getRecentOrders(limit = 10): Order[] {
  return mockOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, limit)
}

export function getRecentTransactions(limit = 10): PaymentTransaction[] {
  return mockTransactions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
}
