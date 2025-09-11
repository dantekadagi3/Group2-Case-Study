"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 
        ${scrolled 
          ? "bg-[#1A1F36] text-white shadow-md" 
          : "bg-white/10 backdrop-blur-md border border-white/20 text-white"}`}
    >
      <div className="px-6 md:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/Frame.svg" alt="BookStore Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold">BookStore</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="hover:underline text-lg">Home</Link>
          <Link href="/books" className="hover:underline text-lg">Books</Link>
          <Link href="/categories" className="hover:underline text-lg">Categories</Link>
        </nav>

        {/* Cart Button */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="relative">
              <img src="/cart2.svg" alt="cart-icon" className="h-8 w-8" />
              <span className="absolute -top-2 -right-2 bg-blue-400 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                0
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:w-96">
            <SheetHeader>
              <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <div className="flex justify-between py-2 border-b">
                <p>Book Title</p>
                <span>$19.99</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <p>Another Book</p>
                <span>$12.50</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <p className="text-3xl font-bold">Total</p>
                <span>$32.49</span>
              </div>
              <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Checkout
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
