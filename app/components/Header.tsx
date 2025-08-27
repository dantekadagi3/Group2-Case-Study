"use client"

import Link from "next/link"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Header() {
  return (
    <header className="bg-[#1A1F36] text-white px-8 py-4 flex items-center justify-between ">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src="/Frame.svg" alt="BookStore Logo" className="h-10 w-10" />
        <h1 className="text-2xl font-bold">BookStore</h1>
      </div>

  
      <nav className="flex space-x-8">
        <Link href="/" className="hover:underline text-lg">Home</Link>
        <Link href="/books" className="hover:underline text-lg">Books</Link>
        <Link href="/categories" className="hover:underline text-lg">Categories</Link>
      </nav>

  
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

        
            <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Checkout
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
