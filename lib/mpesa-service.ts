import { generateQuikkHeaders, type QuikkAuthParams } from './quikk-utils'

interface SearchTransactionRequest {
  data: {
    type: 'search'
    attributes: {
      search_type: 'transaction'
      search_value: string 
    }
  }
}

interface SearchBalanceRequest {
  data: {
    type: 'search'
    attributes: {
      search_type: 'balance'
      shortcode: string
    }
  }
}

interface TransactionSearchResponse {
  data: {
    type: 'transaction'
    id: string
    attributes: {
      status: string
      amount: number
      transaction_date: string
      phone_number: string
      mpesa_receipt_number?: string
      result_code?: string
      result_description?: string
    }
  }
}

interface BalanceSearchResponse {
  data: {
    type: 'balance'
    id: string
    attributes: {
      working_balance: number
      utility_balance: number
      charges_paid_account_balance: number
      merchant_commission: number
      timestamp: string
    }
  }
}

export class MpesaService {
  private baseUrl = process.env.NEXT_PUBLIC_MPESA_API_URL
  private apiKey = process.env.MPESA_API_KEY!
  private apiSecret = process.env.MPESA_API_SECRET!

  async searchTransaction(searchValue: string): Promise<TransactionSearchResponse> {
    const payload: SearchTransactionRequest = {
      data: {
        type: 'search',
        attributes: {
          search_type: 'transaction',
          search_value: searchValue
        }
      }
    }

    const headers = generateQuikkHeaders({
      keyId: this.apiKey,
      secret: this.apiSecret
    })

    const response = await fetch(`${this.baseUrl}/v1/mpesa/searches/transaction`, {
      method: 'POST',
      headers: {
        ...headers
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.errors?.[0]?.detail || 'Failed to search transaction')
    }

    return response.json()
  }

  async getBalance(): Promise<BalanceSearchResponse> {
    const payload: SearchBalanceRequest = {
      data: {
        type: 'search',
        attributes: {
          search_type: 'balance',
          shortcode: process.env.MPESA_SHORTCODE!
        }
      }
    }

    const headers = generateQuikkHeaders({
      keyId: this.apiKey,
      secret: this.apiSecret
    })

    const response = await fetch(`${this.baseUrl}/v1/mpesa/searches/balance`, {
      method: 'POST',
      headers: {
        ...headers
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.errors?.[0]?.detail || 'Failed to get balance')
    }

    return response.json()
  }
}

export const mpesaService = new MpesaService()