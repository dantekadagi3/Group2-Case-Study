'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { GeistSans } from 'geist/font'

const geistSans = GeistSans

export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}