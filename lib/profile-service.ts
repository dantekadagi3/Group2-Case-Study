import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Database } from './database-types'

type Profile = Database['public']['Tables']['customers']['Row']
type Order = Database['public']['Tables']['orders']['Row']
type OrderItem = Database['public']['Tables']['order_items']['Row']

export const getProfile = async (user: User): Promise<Profile | null> => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getProfile:', error)
    return null
  }
}

export const updateProfile = async (
  user: User,
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', user.id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An error occurred while updating profile'
    }
  }
}

export const getUserOrders = async (user: User): Promise<Order[]> => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserOrders:', error)
    return []
  }
}

export const createOrder = async (
  user: User,
  orderData: {
    total_amount: number
    payment_method: 'mpesa' | 'card' | null
    shipping_address: {
      address: string
      city: string
      postal_code: string
      phone: string
    }
    items: Array<{
      book_id: string
      quantity: number
      price: number
    }>
  }
): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  const supabase = createClient()
  
  try {
    // Start a transaction
    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: user.id,
        total_amount: orderData.total_amount,
        status: 'pending',
        payment_status: 'pending',
        payment_method: orderData.payment_method,
        shipping_address: orderData.shipping_address
      } as Database['public']['Tables']['orders']['Insert'])
      .select()
      .single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = orderData.items.map(item => ({
      order_id: orderResult?.id,
      book_id: item.book_id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems as Database['public']['Tables']['order_items']['Insert'][])

    if (itemsError) throw itemsError

    return { 
      success: true,
      orderId: orderResult?.id
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while creating the order'
    }
  }
}