"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// 1. Define the type for a Book item
type Book = {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
};

// 2. Define the type for CartContext
type CartContextType = {
  cartItems: Book[];
  addToCart: (book: Omit<Book, "quantity">) => void; // book passed in doesn’t need quantity
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
};

// 3. Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. Create the provider
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Book[]>([]);

  // Add to cart (if exists → increase qty)
  const addToCart = (book: Omit<Book, "quantity">) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...book, quantity: 1 }];
    });
  };

  // Remove item completely
  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Clear cart
  const clearCart = () => setCartItems([]);

  // Total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook for accessing cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
