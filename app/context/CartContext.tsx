"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./AuthContext"

export type CartItem = {
  id: string
  title: string
  author: string
  image: string
  description: string
  price: number
  quantity: number
  stock_quantity?: number
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (book: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalPrice: number
  totalItems: number
  isLoading: boolean
  saveCartToDatabase: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  // Load cart from localStorage on mount, or from database if user is logged in
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("cart_items")
            .select(`
              id,
              book_id,
              quantity,
              books (
                id,
                title,
                price,
                image_url,
                description,
                stock_quantity,
                authors (name)
              )
            `)
            .eq("customer_id", user.id)

          if (data && !error) {
            const cartData = data.map((item) => ({
              id: item.book_id,
              title: item.books.title,
              author: item.books.authors?.name || "Unknown Author",
              image: item.books.image_url || "/placeholder.svg",
              description: item.books.description || "",
              price: item.books.price,
              quantity: item.quantity,
              stock_quantity: item.books.stock_quantity,
            }))
            setCartItems(cartData)
          }
        } catch (error) {
          console.error("Error loading cart from database:", error)
          // Fallback to localStorage
          loadFromLocalStorage()
        }
      } else {
        loadFromLocalStorage()
      }
      setIsLoaded(true)
    }

    const loadFromLocalStorage = () => {
      const savedCart = localStorage.getItem("bookstore_cart")
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
        }
      }
    }

    loadCart()
  }, [user])

  // Save cart to localStorage and database whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("bookstore_cart", JSON.stringify(cartItems))
      if (user) {
        saveCartToDatabase()
      }
    }
  }, [cartItems, isLoaded, user])

  const saveCartToDatabase = async () => {
    if (!user || !isLoaded) return

    try {
      // First, clear existing cart items
      await supabase.from("cart_items").delete().eq("customer_id", user.id)

      // Then insert current cart items
      if (cartItems.length > 0) {
        const cartData = cartItems.map((item) => ({
          customer_id: user.id,
          book_id: item.id,
          quantity: item.quantity,
        }))

        await supabase.from("cart_items").insert(cartData)
      }
    } catch (error) {
      console.error("Error saving cart to database:", error)
    }
  }

  const addToCart = (book: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id)
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1
        if (book.stock_quantity && newQuantity > book.stock_quantity) {
          alert(`Sorry, only ${book.stock_quantity} items available in stock.`)
          return prevItems
        }
        return prevItems.map((item) => (item.id === book.id ? { ...item, quantity: newQuantity } : item))
      }
      return [...prevItems, { ...book, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if (item.stock_quantity && quantity > item.stock_quantity) {
            alert(`Sorry, only ${item.stock_quantity} items available in stock.`)
            return item
          }
          return { ...item, quantity }
        }
        return item
      }),
    )
  }

  const clearCart = () => setCartItems([])

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
        isLoading,
        saveCartToDatabase,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
