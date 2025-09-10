// Mock Quikk API M-Pesa Integration Service
// In production, replace with actual Quikk API calls

export interface MpesaPaymentRequest {
  amount: number
  phoneNumber: string
  accountReference: string
  transactionDesc: string
  callbackUrl?: string
}

export interface MpesaPaymentResponse {
  success: boolean
  checkoutRequestId?: string
  responseCode?: string
  responseDescription?: string
  customerMessage?: string
  errorMessage?: string
}

export interface PaymentStatus {
  checkoutRequestId: string
  resultCode: string
  resultDesc: string
  amount?: number
  mpesaReceiptNumber?: string
  transactionDate?: string
  phoneNumber?: string
}

class PaymentService {
  private baseUrl = process.env.QUIKK_API_BASE_URL || "https://api.quikk.dev"
  private apiKey = process.env.QUIKK_API_KEY || "mock-api-key"

  async initiateMpesaPayment(request: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    try {
      // Mock implementation - replace with actual Quikk API call
      console.log("[v0] Initiating M-Pesa payment:", request)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock validation
      if (!this.isValidPhoneNumber(request.phoneNumber)) {
        return {
          success: false,
          errorMessage: "Invalid phone number format. Use format: 254XXXXXXXXX",
        }
      }

      if (request.amount < 1) {
        return {
          success: false,
          errorMessage: "Amount must be at least KES 1",
        }
      }

      // Mock successful response
      const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        success: true,
        checkoutRequestId,
        responseCode: "0",
        responseDescription: "Success. Request accepted for processing",
        customerMessage: `STK Push sent to ${request.phoneNumber}. Please enter your M-Pesa PIN to complete the payment.`,
      }
    } catch (error) {
      console.error("[v0] M-Pesa payment error:", error)
      return {
        success: false,
        errorMessage: "Payment service temporarily unavailable. Please try again.",
      }
    }
  }

  async checkPaymentStatus(checkoutRequestId: string): Promise<PaymentStatus> {
    try {
      console.log("[v0] Checking payment status for:", checkoutRequestId)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock payment status - in production, this would query the actual status
      const mockStatuses = [
        {
          resultCode: "0",
          resultDesc: "The service request is processed successfully.",
          amount: 100,
          mpesaReceiptNumber: `NLJ7RT61SV`,
          transactionDate: new Date().toISOString(),
          phoneNumber: "254712345678",
        },
        {
          resultCode: "1032",
          resultDesc: "Request cancelled by user",
        },
        {
          resultCode: "1037",
          resultDesc: "DS timeout user cannot be reached",
        },
      ]

      // Randomly select a status for demo purposes
      const status = mockStatuses[Math.floor(Math.random() * mockStatuses.length)]

      return {
        checkoutRequestId,
        ...status,
      }
    } catch (error) {
      console.error("[v0] Payment status check error:", error)
      return {
        checkoutRequestId,
        resultCode: "1001",
        resultDesc: "Unable to check payment status",
      }
    }
  }

  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Kenyan phone number validation (254XXXXXXXXX format)
    const phoneRegex = /^254[0-9]{9}$/
    return phoneRegex.test(phoneNumber)
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Convert various formats to 254XXXXXXXXX
    let formatted = phoneNumber.replace(/\s+/g, "").replace(/[^\d]/g, "")

    if (formatted.startsWith("0")) {
      formatted = "254" + formatted.substring(1)
    } else if (formatted.startsWith("+254")) {
      formatted = formatted.substring(1)
    } else if (formatted.startsWith("254")) {
      // Already in correct format
    } else if (formatted.length === 9) {
      formatted = "254" + formatted
    }

    return formatted
  }
}

export const paymentService = new PaymentService()
