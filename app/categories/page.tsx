"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Search, ArrowRight, Filter } from "lucide-react"

interface Category {
  id: string

  
  name: string
  description: string
  book_count: number
  sample_books: Array<{
    id: string
    title: string
    image_url: string
    price: number
  }>
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories)
    } else {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCategories(filtered)
    }
  }, [searchQuery, categories])

  const fetchCategories = async () => {
    try {
      // Fetch categories with book counts and sample books
      const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select(`
          id,
          name,
          description,
          books!inner(
            id,
            title,
            image_url,
            price
          )
        `)

      if (categoriesError) throw categoriesError

      // Process the data to get book counts and sample books
      const processedCategories =
        categoriesData?.map((category) => ({
          id: category.id,
          name: category.name,
          description: category.description || "",
          book_count: category.books?.length || 0,
          sample_books: category.books?.slice(0, 3) || [],
        })) || []

      setCategories(processedCategories)
      setFilteredCategories(processedCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Fallback to mock data if database fails
      const mockCategories = [
        {
          id: "1",
          name: "Fiction",
          description: "Imaginative stories and novels",
          book_count: 25,
          sample_books: [
            {
              id: "1",
              title: "To Kill a Mockingbird",
              image_url: "/harper-lee-to-kill-a-mockingbird.jpg",
              price: 12.99,
            },
            { id: "2", title: "1984", image_url: "/george-orwell-1984.jpg", price: 13.99 },
            { id: "3", title: "Pride and Prejudice", image_url: "/jane-austen-pride-and-prejudice.jpg", price: 11.99 },
          ],
        },
        {
          id: "2",
          name: "Science Fiction",
          description: "Futuristic and speculative fiction",
          book_count: 18,
          sample_books: [
            { id: "4", title: "Dune", image_url: "/frank-herbert-dune.jpg", price: 16.99 },
            { id: "5", title: "Foundation", image_url: "/isaac-asimov-foundation.jpg", price: 14.99 },
          ],
        },
        {
          id: "3",
          name: "Mystery",
          description: "Suspenseful and thrilling stories",
          book_count: 22,
          sample_books: [
            {
              id: "6",
              title: "The Girl with the Dragon Tattoo",
              image_url: "/stieg-larsson-dragon-tattoo.jpg",
              price: 15.99,
            },
          ],
        },
        {
          id: "4",
          name: "Romance",
          description: "Love stories and romantic fiction",
          book_count: 31,
          sample_books: [{ id: "7", title: "The Notebook", image_url: "/nicholas-sparks-notebook.jpg", price: 12.99 }],
        },
        {
          id: "5",
          name: "Non-Fiction",
          description: "Educational and informational books",
          book_count: 19,
          sample_books: [{ id: "8", title: "Sapiens", image_url: "/yuval-harari-sapiens.jpg", price: 18.99 }],
        },
        {
          id: "6",
          name: "Biography",
          description: "Life stories of notable people",
          book_count: 14,
          sample_books: [{ id: "9", title: "Steve Jobs", image_url: "/walter-isaacson-steve-jobs.jpg", price: 17.99 }],
        },
      ]
      setCategories(mockCategories)
      setFilteredCategories(mockCategories)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-6" />
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-[var(--font-playfair)] text-foreground mb-4">Book Categories</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore our diverse collection of books organized by genre and topic
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search terms" : "No categories available at the moment"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-[var(--font-playfair)] text-xl group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {category.book_count} books
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Sample Books */}
                  {category.sample_books.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Featured Books:</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {category.sample_books.map((book) => (
                          <div key={book.id} className="group/book">
                            <div className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden mb-1">
                              <Image
                                src={book.image_url || "/placeholder.svg"}
                                alt={book.title}
                                fill
                                className="object-cover group-hover/book:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <p className="text-xs font-medium line-clamp-2 mb-1">{book.title}</p>
                            <p className="text-xs text-primary font-semibold">${book.price.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Browse Button */}
                  <Button asChild className="w-full group/btn">
                    <Link href={`/books?category=${encodeURIComponent(category.name)}`}>
                      Browse {category.name}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Browse All Books */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-[var(--font-playfair)] mb-2">Explore All Books</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Browse our complete collection of books across all categories.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/books">
                  <Filter className="mr-2 h-4 w-4" />
                  View All Books
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
