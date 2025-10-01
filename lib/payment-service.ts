import { generateQuikkHeaders, validateQuikkPayload } from './quikk-utils';

export interface MpesaPaymentRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
  callbackUrl?: string;
}

export interface MpesaPaymentResponse {
  success: boolean;
  checkoutRequestId?: string;
  responseCode?: string;
  responseDescription?: string;
  customerMessage?: string;
  errorMessage?: string;
}

export interface PaymentStatus {
  checkoutRequestId: string;
  resultCode: string;
  resultDesc: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
}

class PaymentService {
  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private shortCode: string;

  constructor() {
    this.baseUrl = "https://tryapi.quikk.dev";
    this.apiKey = process.env.QUIKK_API_KEY || "fb44dec835b8126a70a7c6000d542292";
    this.apiSecret = process.env.QUIKK_API_SECRET || "f072e0b7cf852a76eb49687c43761a29";
    this.shortCode = process.env.MPESA_SHORTCODE || "174379";
    // this.apiKey = "fb44dec835b8126a70a7c6000d542292";
    // this.apiSecret = "f072e0b7cf852a76eb49687c43761a29";
    // this.shortCode = "174379";
    console.log("[Debug] API Credentials:", {
      apiKey: this.apiKey.substring(0, 5) + "...",
      apiSecret: this.apiSecret.substring(0, 5) + "...",
      baseUrl: this.baseUrl,
      shortCode: this.shortCode
    });
  }

  async initiateMpesaPayment(request: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
  try {
    const formattedPhone = this.formatPhoneNumber(request.phoneNumber);
    
    if (!this.isValidPhoneNumber(formattedPhone)) {
      return {
        success: false,
        errorMessage: "Invalid phone number format. Please enter a valid Kenyan phone number.",
      };
    }

    if (request.amount < 1) {
      return {
        success: false,
        errorMessage: "Amount must be at least KES 1",
      };
    }

    // Format request body exactly as in working example
    const requestBody = {
      data: {
        type: "charge",
        attributes: {
          // Convert amount to cents (smallest currency unit) and ensure it's an integer
          amount: Math.round(request.amount),
          posted_at: new Date().toISOString(),
          reference: request.accountReference,
          short_code: this.shortCode,
          
          customer_type: "msisdn",
          customer_no: formattedPhone
        }
      }
    };

    // Generate headers using simplified method matching the working example
    const headers = {
      ...generateQuikkHeaders({
        keyId: this.apiKey,
        secret: this.apiSecret
      }),
      'Host': new URL(this.baseUrl).host
    };

    console.log("[Quikk Payment] Request:", {
      url: `${this.baseUrl}/v1/mpesa/charge`,
      headers: {
        ...headers,
        Authorization: headers.Authorization.substring(0, 50) + '...'
      },
      body: JSON.stringify(requestBody, null, 2)
    });

    const response = await fetch(`${this.baseUrl}/v1/mpesa/charge`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();
    console.log("[Quikk Payment] Response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.errors?.[0]?.detail || responseData.message || 'Payment initiation failed');
    }

    return {
      success: true,
      checkoutRequestId: responseData.data.id,
      responseCode: "0",
      responseDescription: "Success. Request accepted for processing",
      customerMessage: `STK Push sent to ${formattedPhone}. Please enter your M-Pesa PIN to complete the payment.`,
    };
  } catch (error: unknown) {
    console.error("[Quikk Payment] Error:", error);
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Payment service temporarily unavailable',
      responseCode: '1',
      responseDescription: 'Error processing payment'
    };
  }
}
  async checkPaymentStatus(checkoutRequestId: string): Promise<PaymentStatus> {
    try {
      console.log("[v0] Checking payment status for:", checkoutRequestId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
      ];
      const status = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      return {
        checkoutRequestId,
        ...status,
      };
    } catch (error) {
      console.error("[v0] Payment status check error:", error);
      return {
        checkoutRequestId,
        resultCode: "1001",
        resultDesc: "Unable to check payment status",
      };
    }
  }

  private isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^254[0-9]{9}$/;
    const isValid = phoneRegex.test(phoneNumber);
    console.log("[Payment Service] Phone number validation:", {
      phoneNumber,
      isValid,
      format: "254XXXXXXXXX required"
    });
    return isValid;
  }

  private formatPhoneNumber(phoneNumber: string): string {
    let formatted = phoneNumber.replace(/\s+/g, "").replace(/[^\d]/g, "");
    if (formatted.startsWith("0")) {
      formatted = "254" + formatted.substring(1);
    } else if (formatted.startsWith("+254")) {
      formatted = formatted.substring(1);
    } else if (formatted.startsWith("254")) {
      // Already in correct format
    } else if (formatted.length === 9) {
      formatted = "254" + formatted;
    } else if (formatted.length === 10 && formatted.startsWith("7")) {
      formatted = "254" + formatted;
    }
    console.log("[Payment Service] Phone number formatting:", {
      original: phoneNumber,
      formatted: formatted
    });
    return formatted;
  }
}

export const paymentService = new PaymentService();