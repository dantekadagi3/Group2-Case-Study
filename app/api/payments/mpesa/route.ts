import { type NextRequest, NextResponse } from "next/server"
import { paymentService } from "@/lib/payment-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, phoneNumber, orderReference } = body

    // Validate required fields
    if (!amount || !phoneNumber || !orderReference) {
      return NextResponse.json(
        { error: "Missing required fields: amount, phoneNumber, orderReference" },
        { status: 400 },
      )
    }

    // Format phone number
    const formattedPhone = paymentService.formatPhoneNumber(phoneNumber)

    // Initiate M-Pesa payment through Quikk
    const paymentResponse = await paymentService.initiateMpesaPayment({
      amount: Number.parseFloat(amount),
      phoneNumber: formattedPhone,
      accountReference: orderReference,
      transactionDesc: `BookStore Order ${orderReference}`,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`,
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
