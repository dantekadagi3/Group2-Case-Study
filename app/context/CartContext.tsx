"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./AuthContext"

// Database types for type safety
type CartItemRow = {
  id: string
  book_id: string
  quantity: number
  customer_id: string
  books: {
    id: string
    title: string
    price: number
    image_url: string
    description: string
    stock_quantity: number
    authors: {
      name: string
    } | null
  }
}

import { isUUID } from "@/lib/book-service"

type CartItemInsert = {
  customer_id: string
  book_id: string  // Must be a valid UUID
  quantity: number
}

export type CartItem = {
  id: string  // Book ID (UUID string)
  title: string
  author: string
  image: string
  description: string
  price: number
  quantity: number
  stock_quantity?: number
}

// Helper function to validate item before adding to cart
const validateCartItem = (item: { id: string } & Record<string, any>): boolean => {
  if (!isUUID(item.id)) {
    console.error("Invalid book ID format. Expected UUID, got:", item.id)
    return false
  }
  return true
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (book: Omit<CartItem, "quantity"> & { stock_quantity?: number }) => void
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
      setIsLoading(true)
      try {
        if (user) {
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
          
          if (error) {
            console.error('Error fetching cart items:', error)
            throw error
          }

          if (data) {
            const cartData = (data as CartItemRow[]).map((item) => ({
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
        } else {
          loadFromLocalStorage()
        }
      } catch (error) {
        console.error("Error loading cart from database:", error)
        // Fallback to localStorage
        loadFromLocalStorage()
      } finally {
        setIsLoaded(true)
        setIsLoading(false)
      }
    }

    const loadFromLocalStorage = () => {
      const savedCart = localStorage.getItem("bookstore_cart")
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart) as CartItem[]
          setCartItems(parsedCart)
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
          setCartItems([])
        }
      }
    }

    loadCart()
  }, [user, supabase])

  // Save cart to localStorage whenever it changes (for guest users)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("bookstore_cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoaded])

  // Auto-save to database for authenticated users (debounced via useEffect dependency)
  useEffect(() => {
    if (isLoaded && user) {
      saveCartToDatabase()
    }
  }, [cartItems, isLoaded, user])

  const saveCartToDatabase = async () => {
    if (!user || !isLoaded || cartItems.length === 0) return

    setIsLoading(true)
    try {
      // Clear existing cart items
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("customer_id", user.id)

      if (deleteError) {
        console.error('Error clearing cart items:', deleteError)
        throw deleteError
      }

      // Insert current cart items
      const cartData: CartItemInsert[] = cartItems.map((item) => ({
        customer_id: user.id,
        book_id: item.id,
        quantity: item.quantity,
      }))

      // Validate all items have valid UUIDs before inserting
      const validItems = cartData.every(item => isUUID(item.book_id))
      if (!validItems) {
        console.error("Invalid book IDs found in cart")
        throw new Error("Invalid book IDs found in cart")
      }

      if (cartData.length > 0) {
        const { error: insertError } = await supabase
          .from("cart_items")
          .insert(cartData as any) // Type assertion needed due to Supabase typing limitations

        if (insertError) {
          console.error('Error inserting cart items:', insertError)
          throw insertError
        }
      }
    } catch (error) {
      console.error("Error saving cart to database:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = (book: Omit<CartItem, "quantity"> & { stock_quantity?: number }) => {
    // Validate book ID is a UUID before adding to cart
    if (!validateCartItem(book)) {
      alert("Invalid book format. Please try again.")
      return
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id)
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1
        const availableStock = book.stock_quantity ?? existingItem.stock_quantity ?? Infinity
        if (newQuantity > availableStock) {
          alert(`Sorry, only ${availableStock} items available in stock.`)
          return prevItems
        }
        return prevItems.map((item) => 
          item.id === book.id ? { ...item, quantity: newQuantity } : item
        )
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

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === id)
      if (!existingItem) return prevItems

      const availableStock = existingItem.stock_quantity ?? Infinity
      if (quantity > availableStock) {
        alert(`Sorry, only ${availableStock} items available in stock.`)
        return prevItems
      }

      return prevItems.map((item) => 
        item.id === id ? { ...item, quantity } : item
      )
    })
  }

  const clearCart = () => {
    setCartItems([])
    if (user) {
      saveCartToDatabase() // Clear from DB too
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
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