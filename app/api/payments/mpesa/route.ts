import { type NextRequest, NextResponse } from "next/server"
import { paymentService } from "@/lib/payment-service"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, phoneNumber, orderReference, orderId } = body

    // Validate required fields
    if (!amount || !phoneNumber || !orderReference || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields: amount, phoneNumber, orderReference, orderId" },
        { status: 400 },
      )
    }

    // Lightweight phone formatting (don't rely on private service method)
    const formatPhone = (num: string) => {
      let formatted = (num || '').toString().replace(/\s+/g, "").replace(/[^\d]/g, "")
      if (formatted.startsWith("0")) formatted = "254" + formatted.substring(1)
      if (formatted.startsWith("+254")) formatted = formatted.substring(1)
      if (formatted.length === 9) formatted = "254" + formatted
      return formatted
    }

    const formattedPhone = formatPhone(phoneNumber)

    // Initiate M-Pesa payment through Quikk
    const paymentResponse = await paymentService.initiateMpesaPayment({
      amount: Number.parseFloat(amount),
      phoneNumber: formattedPhone,
      accountReference: orderReference,
      transactionDesc: `BookStore Order ${orderReference}`,
      callbackUrl: process.env.NEXT_PUBLIC_QUIKK_CALLBACK_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`,
    })

    if (!paymentResponse.success) {
      console.error("[v0] Quikk payment initiation failed:", paymentResponse.errorMessage);
      return NextResponse.json({ 
        error: paymentResponse.errorMessage || "Payment initiation failed",
        code: "PAYMENT_FAILED"
      }, { 
        status: 400 
      })
    }

    // Save checkoutRequestId to payments placeholder for later correlation (use transaction_id column)
    try {
      const supabase = await createClient()
      const { error: upsertError } = await supabase
        .from('payments')
        .update({ transaction_id: paymentResponse.checkoutRequestId, phone_number: formattedPhone })
        .eq('order_id', orderId)

      if (upsertError) console.error('[v0] Failed to save transaction id to payment record:', upsertError)
    } catch (e) {
      console.error('[v0] Supabase update error:', e)
    }

    return NextResponse.json({
      success: true,
      checkoutRequestId: paymentResponse.checkoutRequestId,
      message: paymentResponse.customerMessage,
      transactionReference: orderReference,
    })
  } catch (error) {
    console.error("[v0] M-Pesa API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
