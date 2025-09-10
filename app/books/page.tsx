"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import BookCard from "../components/Bookcard"
import { mockBooks, mockGenres, searchBooks } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BooksPage() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get("category")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>(categoryFromUrl || "all")
  const [sortBy, setSortBy] = useState<string>("title")

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedGenre(categoryFromUrl)
    }
  }, [categoryFromUrl])

  const filteredAndSortedBooks = useMemo(() => {
    let books = mockBooks

    // Apply search filter
    if (searchQuery.trim()) {
      books = searchBooks(searchQuery)
    }

    // Apply genre filter
    if (selectedGenre !== "all") {
      books = books.filter((book) => book.genre.includes(selectedGenre))
    }

    // Apply sorting
    books = [...books].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
        case "title":
        default:
          return a.title.localeCompare(b.title)
      }
    })

    return books
  }, [searchQuery, selectedGenre, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedGenre("all")
    setSortBy("title")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-card to-secondary/10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-playfair)] text-foreground mb-4">
            {selectedGenre !== "all" ? `${selectedGenre} Books` : "Discover Your Next Great Read"}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {selectedGenre !== "all"
              ? `Explore our collection of ${selectedGenre.toLowerCase()} books`
              : `Browse through our curated collection of ${mockBooks.length} amazing books`}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search books, authors, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {selectedGenre !== "all" && (
            <div className="mb-6">
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Button
                  variant="link"
                  className="p-0 h-auto text-muted-foreground"
                  onClick={() => setSelectedGenre("all")}
                >
                  All Books
                </Button>
                <span>/</span>
                <span className="text-foreground font-medium">{selectedGenre}</span>
              </nav>
            </div>
          )}

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {mockGenres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.name}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || selectedGenre !== "all" || sortBy !== "title") && (
                <Button variant="outline" onClick={clearFilters} size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredAndSortedBooks.length} book{filteredAndSortedBooks.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedGenre !== "all") && (
            <div className="flex flex-wrap gap-2 mb-6">
              {searchQuery && (
                <Badge variant="secondary" className="gap-2">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedGenre !== "all" && (
                <Badge variant="secondary" className="gap-2">
                  Genre: {selectedGenre}
                  <button onClick={() => setSelectedGenre("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Books Grid */}
          {filteredAndSortedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAndSortedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  image={book.image}
                  description={book.description}
                  price={book.price}
                  rating={book.rating}
                  reviewCount={book.reviewCount}
                  genre={book.genre}
                  inStock={book.inStock}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No books found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedGenre !== "all"
                  ? `No ${selectedGenre.toLowerCase()} books match your criteria. Try adjusting your search or browse other categories.`
                  : "Try adjusting your search or filter criteria"}
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
