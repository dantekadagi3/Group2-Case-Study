import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Quikk callback received:", body)

    // Basic payload validation
  const checkoutRequestId = body?.data?.id || null
    const attrs = body?.data?.attributes || {}
    const status = attrs.status || attrs.result || null
    const mpesaReceipt = attrs.mpesa_receipt || attrs.mpesa_receipt_number || attrs.receipt || null
    const transactionDate = attrs.transaction_date || attrs.posted_at || null
    const amount = attrs.amount || null

    if (!checkoutRequestId) {
      console.error('[v0] Callback missing checkout id')
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing checkout id' }, { status: 400 })
    }

    const supabase = await createClient()

    // Find payment record by transaction_id
    const { data: paymentRecord, error: findErr } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', checkoutRequestId)
      .limit(1)
      .single()

    if (findErr) console.error('[v0] Payment lookup error:', findErr)

    // Update payment record
    const updateData: any = {
      status: status === 'completed' || status === 'success' ? 'completed' : status,
      mpesa_receipt_number: mpesaReceipt,
      transaction_date: transactionDate,
      amount: amount,
      transaction_id: checkoutRequestId,
    }

    if (paymentRecord && paymentRecord.id) {
      const { error: updErr } = await supabase.from('payments').update(updateData).eq('id', paymentRecord.id)
      if (updErr) console.error('[v0] Payment update error:', updErr)

      // If completed, mark order as paid
      if (status === 'completed' || status === 'success') {
        const { error: orderErr } = await supabase.from('orders').update({ status: 'processing', payment_status: 'paid' }).eq('id', paymentRecord.order_id)
        if (orderErr) console.error('[v0] Order update error:', orderErr)
      }
    } else {
      // No matching payment record - create one for audit (failed or completed depending on status)
      const { error: createErr } = await supabase.from('payments').insert({
        order_id: null,
        amount,
        payment_method: 'mpesa',
        mpesa_receipt_number: mpesaReceipt,
        phone_number: attrs.customer_no || null,
        status: status === 'completed' || status === 'success' ? 'completed' : 'failed',
        transaction_id: checkoutRequestId,
      })
      if (createErr) console.error('[v0] Create payment record error:', createErr)
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Callback processed successfully",
    })
  } catch (error) {
    console.error("[v0] Callback processing error:", error)
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Callback processing failed" }, { status: 500 })
  }
}
