export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
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
        }
        Insert: {
          id?: string
          customer_id: string
          total_amount: number
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          payment_method?: "mpesa" | "card" | null
          shipping_address: {
            address: string
            city: string
            postal_code: string
            phone: string
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          total_amount?: number
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          payment_method?: "mpesa" | "card" | null
          shipping_address?: {
            address: string
            city: string
            postal_code: string
            phone: string
          }
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          book_id: string
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          order_id: string
          book_id: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          order_id?: string
          book_id?: string
          quantity?: number
          price?: number
        }
      }
      payments: {
        Row: {
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
        }
        Insert: {
          id?: string
          order_id: string
          amount: number
          payment_method: "mpesa" | "card"
          transaction_id?: string
          mpesa_receipt_number?: string
          phone_number?: string
          status?: "pending" | "completed" | "failed" | "cancelled"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          amount?: number
          payment_method?: "mpesa" | "card"
          transaction_id?: string
          mpesa_receipt_number?: string
          phone_number?: string
          status?: "pending" | "completed" | "failed" | "cancelled"
          updated_at?: string
        }
      }
    }
  }
}