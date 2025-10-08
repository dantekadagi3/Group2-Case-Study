"use client"

import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { useCart } from "@/app/context/CartContext"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Moon, Sun, User, LogOut, ShoppingCart, BookOpen, Menu } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <Link href="/" className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl  font-[var(--font-playfair)] text-foreground">NovelEra</h1>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8">
        <Link href="/" className="hover:text-primary transition-colors text-foreground font-medium">
          Home
        </Link>
        <Link href="/books" className="hover:text-primary transition-colors text-foreground font-medium">
          Books
        </Link>
        <Link href="/categories" className="hover:text-primary transition-colors text-foreground font-medium">
          Categories
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-6">
              <Link
                href="/"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/books"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Books
              </Link>
              <Link
                href="/categories"
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only text-foreground">Toggle theme</span>
        </Button>

        {/* Cart */}
        <Button variant="ghost" size="icon" className="relative hover:bg-accent" asChild>
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </Button>

        {/* User Authentication */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Link href="/profile"><User className="h-5 w-5" /></Link>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders">Order History</Link>
              </DropdownMenuItem>
              {user.role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
