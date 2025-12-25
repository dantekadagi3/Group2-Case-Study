"use client"

import { useEffect, useState } from "react"
import BookCard from "./components/Bookcard"
import CategoryCard from "./components/Categorycards"
import Button from "./components/ui/Buttons"
import { getFeaturedBooks } from "@/lib/book-service"
import type { Book } from "@/lib/book-service"
import Link from "next/link"
import { getCategories } from "@/lib/book-service"
import type { Category } from "@/lib/book-service"

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksData, categoriesData] = await Promise.all([
          getFeaturedBooks(),
          getCategories()
        ])
        setFeaturedBooks(booksData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading featured data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <main>
      <section
        className="relative h-screen flex items-center bg-cover bg-center bg-no-repeat bg-slate-900"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("/book.jpeg")`,
        }}
      >
        <div className="flex flex-col items-center justify-center text-center w-full h-full px-6">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white font-[var(--font-playfair)] drop-shadow-2xl [text-shadow:_4px_4px_8px_rgb(0_0_0_/_90%)]">
            Welcome to NovelEra
          </h1>
          <p className="mt-6 text-xl sm:text-2xl md:text-3xl text-white max-w-3xl leading-relaxed drop-shadow-xl [text-shadow:_2px_2px_6px_rgb(0_0_0_/_80%)]">
            Discover your next great read from our curated collection of timeless classics and modern masterpieces
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button name="Browse Books" className="py-4 px-8 bg-primary hover:bg-primary/90 text-primary-foreground" />
            <Button
              name="Join Newsletter"
              className="py-4 px-8 bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground font-[var(--font-playfair)]">
                Featured Books
              </h2>
              <p className="text-muted-foreground mt-2">Handpicked selections from our literary experts</p>
            </div>
            <Link href="/books" className="text-primary hover:underline font-medium">
              View all books →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {isLoading ? (
              // Loading skeletons
              [...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-[3/4] rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))
            ) : featuredBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                image={book.image_url || '/placeholder.jpg'}
                description={book.description}
                price={book.price}
                rating={book.rating}
                reviewCount={book.reviewCount}
                genre={book.category ? [book.category] : []}
                inStock={book.stock_quantity ? book.stock_quantity > 0 : true}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-[var(--font-playfair)] mb-4">
              Browse by Genre
            </h2>
            <p className="text-muted-foreground text-lg">Find your perfect book in your favorite category</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading skeletons for categories
              [...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-square rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                </div>
              ))
            ) : categories.slice(0, 8).map((category) => (
              <CategoryCard
                key={category.id}
                title={category.name}
                image={`/placeholder.svg?height=200&width=200&query=${category.name} books category`}
                description={category.description || ''}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center bg-gradient-to-r from-primary/10 via-card to-secondary/10">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-playfair)] text-foreground">Stay Updated</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Subscribe to our newsletter for the latest book releases, exclusive deals, and personalized reading
            recommendations.
          </p>

          <div className="flex flex-col sm:flex-row justify-center w-full gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground flex-1"
            />
            <button className="py-3 px-6 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
