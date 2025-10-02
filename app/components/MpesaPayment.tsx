"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Smartphone, CheckCircle, XCircle, Clock } from "lucide-react"

interface MpesaPaymentProps {
  amount: number
  orderReference: string
  onSuccess: (receiptNumber: string) => void
  onError: (error: string) => void
}

export default function MpesaPayment({ amount, orderReference, onSuccess, onError }: MpesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success" | "failed">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Format as 0XXX XXX XXX
    if (digits.length <= 10) {
      if (digits.startsWith("254")) {
        const local = digits.substring(3)
        return `0${local.substring(0, 3)} ${local.substring(3, 6)} ${local.substring(6, 9)}`
      } else if (digits.startsWith("0")) {
        return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7, 10)}`
      } else if (digits.length >= 9) {
        return `0${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)}`
      }
    }

    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  const initiatePayment = async () => {
    if (!phoneNumber.trim()) {
      onError("Please enter your phone number")
      return
    }

    setIsProcessing(true)
    setPaymentStatus("pending")

    try {
      const response = await fetch("/api/payments/mpesa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          phoneNumber: phoneNumber.replace(/\s/g, ""),
          orderReference,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Payment initiation failed")
      }

      setCheckoutRequestId(data.checkoutRequestId)
      setStatusMessage(data.message)

      // Start polling for payment status
      pollPaymentStatus(data.checkoutRequestId)
    } catch (error) {
      console.error("[v0] Payment initiation error:", error)
      setPaymentStatus("failed")
      onError(error instanceof Error ? error.message : "Payment failed")
      setIsProcessing(false)
    }
  }

  const pollPaymentStatus = async (requestId: string) => {
    const maxAttempts = 30 // Poll for 5 minutes (30 * 10 seconds)
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch("/api/payments/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ checkoutRequestId: requestId }),
        })

        const data = await response.json()

        if (data.success && data.status) {
          const { resultCode, resultDesc, mpesaReceiptNumber } = data.status

          if (resultCode === "0") {
            // Payment successful
            setPaymentStatus("success")
            setStatusMessage("Payment completed successfully!")
            setIsProcessing(false)
            onSuccess(mpesaReceiptNumber || requestId)
            return
          } else if (resultCode === "1032") {
            // User cancelled
            setPaymentStatus("failed")
            setStatusMessage("Payment was cancelled by user")
            setIsProcessing(false)
            onError("Payment cancelled")
            return
          } else if (resultCode === "1037") {
            // Timeout
            setPaymentStatus("failed")
            setStatusMessage("Payment request timed out")
            setIsProcessing(false)
            onError("Payment timed out")
            return
          }
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000) // Poll every 10 seconds
        } else {
          setPaymentStatus("failed")
          setStatusMessage("Payment status check timed out")
          setIsProcessing(false)
          onError("Unable to confirm payment status")
        }
      } catch (error) {
        console.error("[v0] Status polling error:", error)
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000)
        } else {
          setPaymentStatus("failed")
          setIsProcessing(false)
          onError("Unable to check payment status")
        }
      }
    }

    poll()
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Smartphone className="h-5 w-5 text-green-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          M-Pesa Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">KES {amount.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Order: {orderReference}</p>
        </div>

        {paymentStatus === "idle" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
              <Input
                id="mpesa-phone"
                type="tel"
                placeholder="0712 345 678"
                value={phoneNumber}
                onChange={handlePhoneChange}
                maxLength={13}
              />
              <p className="text-xs text-muted-foreground">Enter your M-Pesa registered phone number</p>
            </div>

            <Button
              onClick={initiatePayment}
              disabled={isProcessing || !phoneNumber.trim()}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initiating Payment...
                </>
              ) : (
                <>
                  <Smartphone className="mr-2 h-4 w-4" />
                  Pay with M-Pesa
                </>
              )}
            </Button>
          </>
        )}

        {paymentStatus === "pending" && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Payment in progress...</p>
                <p className="text-sm">{statusMessage}</p>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Waiting for confirmation...</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === "success" && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <p className="font-medium text-green-800 dark:text-green-200">Payment Successful!</p>
              <p className="text-sm text-green-700 dark:text-green-300">{statusMessage}</p>
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === "failed" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium">Payment Failed</p>
              <p className="text-sm">{statusMessage}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPaymentStatus("idle")
                  setCheckoutRequestId(null)
                  setStatusMessage("")
                }}
                className="mt-2"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• You will receive an STK Push notification on your phone</p>
          <p>• Enter your M-Pesa PIN to complete the payment</p>
          <p>• You will receive an SMS confirmation upon successful payment</p>
        </div>
      </CardContent>
    </Card>
  )
}
