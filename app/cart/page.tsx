"use client"

import { useCart } from "@/app/context/CartContext"
import { useAuth } from "@/app/context/AuthContext"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft, ShoppingCart } from "lucide-react"
import { useState } from "react"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart()
  const { user, supabaseUser } = useAuth()
  console.log('CartPage user:', user)
  console.log('CartPage supabaseUser:', supabaseUser)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(totalPrice * 0.1)
    } else if (promoCode.toLowerCase() === "welcome") {
      setDiscount(5)
    } else {
      setDiscount(0)
    }
  }

  const finalTotal = Math.max(0, totalPrice - discount)
  const shipping = totalPrice > 50 ? 0 : 5.99
  const grandTotal = finalTotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold font-[var(--font-playfair)] text-foreground mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground">
              Looks like you haven't added any books to your cart yet. Start browsing our collection!
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/books">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Books
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/books">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-[var(--font-playfair)] text-foreground">Shopping Cart</h1>
              <p className="text-muted-foreground mt-1">
                {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
              </p>
            </div>

            {cartItems.length > 0 && (
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-28 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link href={`/books/${item.id}`}>
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">by {item.author}</p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="min-w-[2rem] text-center font-medium">{item.quantity}</span>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="font-[var(--font-playfair)]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      Apply
                    </Button>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-green-600">Promo code applied! You saved ${discount.toFixed(2)}</p>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
              <div className="space-y-2">
  <div className="flex justify-between">
    <span>Subtotal ({totalItems} items)</span>
    <span>
      Ksh{" "}
      {new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(totalPrice)}
    </span>
  </div>
</div>

                {discount > 0 && (
  <div className="flex justify-between text-green-600">
    <span>Discount</span>
    <span>
      - Ksh{" "}
      {new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(discount)}
    </span>
  </div>
)}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <Badge variant="secondary">Free</Badge> : `Ksh${shipping.toFixed(2)}`}</span>
                  </div>

                  Add {"Ksh "}
  {new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(50 - totalPrice)}{" "}more for Free Shipping

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span> Ksh{" "}
  {new Intl.NumberFormat("en-IN", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(grandTotal)}</span>
                </div>

                <div className="space-y-3 pt-4">
                  {user ? (
                    <Button asChild className="w-full" size="lg">
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button asChild className="w-full" size="lg">
                        <Link href="/auth/login?redirect=/checkout">Sign In to Checkout</Link>
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        New customer?{" "}
                        <Link href="/auth/register" className="text-primary hover:underline">
                          Create an account
                        </Link>
                      </p>
                    </div>
                  )}

                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/books">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
