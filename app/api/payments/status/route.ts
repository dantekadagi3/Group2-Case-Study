import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { checkoutRequestId } = body

    if (!checkoutRequestId) {
      return NextResponse.json({ error: "Missing checkoutRequestId" }, { status: 400 })
    }

    const supabase = await createClient()
    // First, try to find payment by transaction_id (where we stored Quikk checkout id)
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', checkoutRequestId)
      .limit(1)
      .single()

    if (error) {
      console.error('[v0] Payment status lookup error:', error)
      // As a fallback, create a failed payment audit record so the system tracks the unknown payment
      try {
        const { error: createErr } = await supabase.from('payments').insert({
          order_id: null,
          amount: 0,
          payment_method: 'mpesa',
          transaction_id: checkoutRequestId,
          mpesa_receipt_number: null,
          phone_number: null,
          status: 'failed',
        })
        if (createErr) console.error('[v0] Failed to create fallback failed payment record:', createErr)
      } catch (e) {
        console.error('[v0] Error creating fallback payment record:', e)
      }

      return NextResponse.json({ success: false, error: 'Unable to find payment' }, { status: 500 })
    }

    return NextResponse.json({ success: true, status: data })
  } catch (error) {
    console.error("[v0] Payment status API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
