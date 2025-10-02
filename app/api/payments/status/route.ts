import { type NextRequest, NextResponse } from "next/server"
import { paymentService } from "@/lib/payment-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { checkoutRequestId } = body

    if (!checkoutRequestId) {
      return NextResponse.json({ error: "Missing checkoutRequestId" }, { status: 400 })
    }

    const status = await paymentService.checkPaymentStatus(checkoutRequestId)

    return NextResponse.json({
      success: true,
      status,
    })
  } catch (error) {
    console.error("[v0] Payment status API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
