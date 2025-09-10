"use client"

import { useCart } from "@/app/context/CartContext"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

type CartButtonProps = {
  book: {
    id: string
    title: string
    author: string
    image: string
    description: string
    price: number
  }
  disabled?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
}

export default function CartButton({ book, disabled = false, className, size = "default" }: CartButtonProps) {
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart()

  const cartItem = cartItems.find((item) => item.id === book.id)
  const quantity = cartItem?.quantity || 0

  if (quantity > 0) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(book.id, quantity - 1)}
          className="h-8 w-8"
          disabled={disabled}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <span className="min-w-[2rem] text-center font-medium">{quantity}</span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(book.id, quantity + 1)}
          className="h-8 w-8"
          disabled={disabled}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => addToCart(book)}
      disabled={disabled}
      size={size}
      className={cn("bg-primary hover:bg-primary/90 text-primary-foreground", className)}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
}
