import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, cartItems, totalAmount, shippingAddress, orderReference } = body

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'cartItems required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Create order in pending state
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: userId || null,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'mpesa',
        shipping_address: shippingAddress || null,
  // order_reference not present in schema; drop this field
      })
      .select()
      .single()

    if (orderError || !orderData) {
      console.error('[v0] Create pending order error:', orderError)
      const debug = {
        message: orderError?.message || 'Unknown supabase error',
        details: (orderError as any)?.details || null,
        hint: (orderError as any)?.hint || null,
      }
      return NextResponse.json({ error: 'Failed to create order', debug }, { status: 500 })
    }

    const orderItems = cartItems.map((item: any) => ({
      order_id: orderData.id,
      book_id: item.id,
      quantity: item.quantity || 1,
      price: item.price || 0,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) console.error('[v0] Create order items error:', itemsError)

    // Create a payment placeholder so callback can update it later
    const { error: paymentError } = await supabase.from('payments').insert({
      order_id: orderData.id,
      amount: totalAmount,
      payment_method: 'mpesa',
      mpesa_receipt_number: null,
      phone_number: null,
      status: 'pending',
      checkout_request_id: null,
    })

    if (paymentError) console.error('[v0] Create payment placeholder error:', paymentError)

    return NextResponse.json({ success: true, orderId: orderData.id, orderReference })
  } catch (err) {
    console.error('[v0] create-pending error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
