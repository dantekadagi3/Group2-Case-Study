export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  items: Array<{
    bookId: string
    title: string
    author: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: "mpesa" | "card"
  mpesaReceiptNumber?: string
  checkoutRequestId?: string
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    phone: string
  }
  createdAt: string
  updatedAt: string
}

export interface PaymentTransaction {
  id: string
  orderId: string
  orderNumber: string
  amount: number
  currency: "KES" | "USD"
  paymentMethod: "mpesa" | "card"
  status: "pending" | "completed" | "failed" | "cancelled"
  mpesaReceiptNumber?: string
  checkoutRequestId?: string
  phoneNumber?: string
  resultCode?: string
  resultDescription?: string
  transactionDate: string
  customerName: string
  customerEmail: string
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
    orderNumber: "ORD-001234",
    customerId: "1",
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
    subtotal: 40.97,
    shipping: 5.99,
    total: 46.96,
    status: "delivered",
    paymentStatus: "completed",
    paymentMethod: "mpesa",
    mpesaReceiptNumber: "NLJ7RT61SV",
    checkoutRequestId: "ws_CO_1234567890",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Nairobi",
      postalCode: "00100",
      phone: "254712345678",
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "2",
    orderNumber: "ORD-001235",
    customerId: "2",
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
    subtotal: 11.99,
    shipping: 5.99,
    total: 17.98,
    status: "processing",
    paymentStatus: "completed",
    paymentMethod: "mpesa",
    mpesaReceiptNumber: "NLJ8RT62SV",
    shippingAddress: {
      firstName: "Jane",
      lastName: "Smith",
      address: "456 Oak Ave",
      city: "Mombasa",
      postalCode: "80100",
      phone: "254723456789",
    },
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
  {
    id: "3",
    orderNumber: "ORD-001236",
    customerId: "3",
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
    subtotal: 10.99,
    shipping: 5.99,
    total: 16.98,
    status: "pending",
    paymentStatus: "failed",
    paymentMethod: "mpesa",
    checkoutRequestId: "ws_CO_1234567891",
    shippingAddress: {
      firstName: "Bob",
      lastName: "Wilson",
      address: "789 Pine St",
      city: "Kisumu",
      postalCode: "40100",
      phone: "254734567890",
    },
    createdAt: "2024-01-16T15:45:00Z",
    updatedAt: "2024-01-16T15:45:00Z",
  },
]

export const mockTransactions: PaymentTransaction[] = [
  {
    id: "1",
    orderId: "1",
    orderNumber: "ORD-001234",
    amount: 46.96,
    currency: "USD",
    paymentMethod: "mpesa",
    status: "completed",
    mpesaReceiptNumber: "NLJ7RT61SV",
    checkoutRequestId: "ws_CO_1234567890",
    phoneNumber: "254712345678",
    resultCode: "0",
    resultDescription: "The service request is processed successfully.",
    transactionDate: "2024-01-15T10:35:00Z",
    customerName: "John Doe",
    customerEmail: "john@example.com",
  },
  {
    id: "2",
    orderId: "2",
    orderNumber: "ORD-001235",
    amount: 17.98,
    currency: "USD",
    paymentMethod: "mpesa",
    status: "completed",
    mpesaReceiptNumber: "NLJ8RT62SV",
    checkoutRequestId: "ws_CO_1234567891",
    phoneNumber: "254723456789",
    resultCode: "0",
    resultDescription: "The service request is processed successfully.",
    transactionDate: "2024-01-16T09:20:00Z",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
  },
  {
    id: "3",
    orderId: "3",
    orderNumber: "ORD-001236",
    amount: 16.98,
    currency: "USD",
    paymentMethod: "mpesa",
    status: "failed",
    checkoutRequestId: "ws_CO_1234567892",
    phoneNumber: "254734567890",
    resultCode: "1032",
    resultDescription: "Request cancelled by user",
    transactionDate: "2024-01-16T15:50:00Z",
    customerName: "Bob Wilson",
    customerEmail: "bob@example.com",
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
  return mockOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)
}

export function getRecentTransactions(limit = 10): PaymentTransaction[] {
  return mockTransactions
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
    .slice(0, limit)
}
