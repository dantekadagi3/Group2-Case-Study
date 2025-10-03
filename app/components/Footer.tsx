"use client"

import Link from "next/link"
import { BookOpen, MapPin, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 px-6 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1 - Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold font-[var(--font-playfair)] text-foreground">NovelEra</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your destination for discovering great books and expanding your knowledge. Curated collections for every
            reader's journey.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/books" className="hover:text-primary transition-colors">
                Books
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-primary transition-colors">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 - Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Contact Us</h3>
          <div className="space-y-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span>123 Book Street, Library City, 45678</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
              <span>info@novelera.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary flex-shrink-0" />
              <span>(123) 456-7890</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="text-center border-t border-border mt-10 pt-6 text-muted-foreground text-sm">
        <p>&copy; 2025 NovelEra. All rights reserved. Built with care for book lovers.</p>
      </div>
    </footer>
  )
}
