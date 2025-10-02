"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react"

export default function OrderConfirmationPage() {
  const [orderNumber] = useState(() => `ORD-${Date.now().toString().slice(-6)}`)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="mb-8">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold font-[var(--font-playfair)] text-foreground mb-4">Order Confirmed!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-[var(--font-playfair)]">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="font-medium">Order Number:</span>
              <span className="font-mono text-primary">{orderNumber}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="font-medium">Order Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="font-medium">Payment Method:</span>
              <span>M-Pesa</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Confirmation Email</h3>
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation email with your order details and tracking information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Your books will be delivered within 3-5 business days to your specified address.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/orders">
              View Order History
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/books">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about your order, please don't hesitate to contact us.
          </p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}
