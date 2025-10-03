import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { GeistSans } from 'geist/font'

import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./components/theme-provider"

const geistSans = GeistSans

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "NovelEra - Your Literary Haven",
  description: "Discover your next great read with our curated collection of books",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Check if the current page is an admin page
  const isAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')

  if (isAdminPage) {
    return children
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${playfairDisplay.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <Header />
              {children}
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
