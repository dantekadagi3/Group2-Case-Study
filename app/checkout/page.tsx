"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/app/context/CartContext"
import { useAuth } from "@/app/context/AuthContext"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Lock, Loader2 } from "lucide-react"
import MpesaPayment from "@/app/components/MpesaPayment"

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: "",
    city: "",
    country: "Kenya",
    postalCode: "",
    phone: "",
    paymentMethod: "mpesa",
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [saveInfo, setSaveInfo] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null)
  const [orderReference] = useState(() => `ORD-${Date.now().toString().slice(-6)}`)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return

      setIsLoadingProfile(true)
      try {
        const { data, error } = await supabase.from("customers").select("*").eq("id", user.id).single()

        if (data && !error) {
          setFormData((prev) => ({
            ...prev,
            email: data.email || prev.email,
            firstName: data.first_name || prev.firstName,
            lastName: data.last_name || prev.lastName,
            address: data.address || prev.address,
            city: data.city || prev.city,
            country: data.country || prev.country,
            postalCode: data.postal_code || prev.postalCode,
            phone: data.phone || prev.phone,
          }))
        }
      } catch (error) {
        console.error("Error loading user profile:", error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadUserProfile()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Validate form
    const requiredFields = ["firstName", "lastName", "email", "address", "city", "postalCode", "phone"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData].trim())

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`)
      setIsProcessing(false)
      return
    }

    if (saveInfo && user) {
      try {
        await supabase
          .from("customers")
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postal_code: formData.postalCode,
            phone: formData.phone,
          })
          .eq("id", user.id)
      } catch (error) {
        console.error("Error saving user info:", error)
      }
    }

    try {
      // Create pending order on server to reserve the order and allow callback to update it
      setIsProcessing(true)
      const createRes = await fetch('/api/orders/create-pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || null,
          cartItems,
          totalAmount: grandTotal,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
          orderReference,
        })
      })

      const createData = await createRes.json()
      if (!createRes.ok) throw new Error(createData.error || 'Failed to create pending order')
      setPendingOrderId(createData.orderId)
      setShowPayment(true)
    } catch (err) {
      console.error('[v0] Create pending order error:', err)
      alert('Unable to create order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = async (receiptNumber: string) => {
    console.log('[v0] Payment successful:', receiptNumber)

    try {
      // Try to find the payment record updated by the callback
      const { data: paymentData, error: payErr } = await supabase
        .from('payments')
        .select('*')
        .eq('mpesa_receipt_number', receiptNumber)
        .limit(1)
        .single()

      if (payErr) console.warn('[v0] Could not find payment record by receipt:', payErr)

      // If we have an order id from the payment record, use it; otherwise fall back to orderReference
      const orderId = paymentData?.order_id || null

      clearCart()
      // Redirect to confirmation; include order id if available
      const params = new URLSearchParams()
      params.set('receipt', receiptNumber)
      if (orderId) params.set('orderId', String(orderId))
      else params.set('order', orderReference)

      router.push(`/order-confirmation?${params.toString()}`)
    } catch (error) {
      console.error('[v0] Post-payment redirect error:', error)
      clearCart()
      router.push(`/order-confirmation?receipt=${receiptNumber}&order=${orderReference}`)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error("[v0] Payment error:", error)
    alert(`Payment failed: ${error}`)
  }

  const shipping = totalPrice > 50 ? 0 : 0.99
  const grandTotal = totalPrice + shipping

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Please sign in to continue with your checkout.</p>
            <Button asChild className="w-full">
              <Link href="/auth/login?redirect=/checkout">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Your cart is empty. Add some books before checking out.</p>
            <Button asChild className="w-full">
              <Link href="/books">Browse Books</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/cart">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {!showPayment ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-[var(--font-playfair)]">Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProfile ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Loading your information...</span>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                              id="postalCode"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number (M-Pesa)</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="254XXXXXXXXX"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter your M-Pesa registered phone number
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="saveInfo" checked={saveInfo} onCheckedChange={(v) => setSaveInfo(Boolean(v))} />
                          <Label htmlFor="saveInfo" className="text-sm">
                            Save this information for next time
                          </Label>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Continue to Payment"
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="space-y-6">
                  <MpesaPayment
                    amount={grandTotal}
                    orderReference={orderReference}
                    orderId={pendingOrderId}
                    phoneNumber={formData.phone}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />

                <Button variant="outline" onClick={() => setShowPayment(false)} className="w-full">
                  Back to Shipping Information
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="font-[var(--font-playfair)]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">by {item.author}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                          <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>

                {showPayment && (
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>Secure M-Pesa payment via Quikk API</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Order Reference: {orderReference}</p>
                  </div>
                )}

                {!showPayment && (
                  <p className="text-xs text-center text-muted-foreground">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
