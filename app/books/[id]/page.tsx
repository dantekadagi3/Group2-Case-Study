"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getBookById, getAuthorById, getBooksByAuthor } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import BookCard from "@/app/components/Bookcard"
import CartButton from "@/app/components/ui/Cartbutton"
import { ArrowLeft, Star, StarHalf, Calendar, BookOpen, Package } from "lucide-react"

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4"

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className={`${iconSize} fill-primary text-primary`} />
      ))}
      {hasHalfStar && <StarHalf className={`${iconSize} fill-primary text-primary`} />}
      <span className={`${size === "lg" ? "text-lg" : "text-sm"} font-medium ml-2`}>{rating.toFixed(1)}</span>
    </div>
  )
}

export default function BookDetailPage() {
  const params = useParams()
  const bookId = params.id as string
  const [selectedTab, setSelectedTab] = useState<"description" | "details" | "reviews">("description")

  const book = getBookById(bookId)

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Book Not Found</h1>
          <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/books">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const author = getAuthorById(book.authorId)
  const otherBooksByAuthor = getBooksByAuthor(book.authorId).filter((b) => b.id !== book.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/books">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Book Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] bg-muted rounded-lg overflow-hidden shadow-lg">
              <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" priority />
              {!book.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-playfair)] text-foreground mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={book.rating} size="lg" />
                <span className="text-muted-foreground">({book.reviewCount} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {book.genre.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-primary">${book.price.toFixed(2)}</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    {book.inStock ? "In Stock" : "Out of Stock"}
                  </div>
                </div>

                <CartButton book={book} disabled={!book.inStock} className="w-full" size="lg" />

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{book.pages} pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(book.publishedDate).getFullYear()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <div className="flex border-b border-border mb-6">
            {[
              { id: "description", label: "Description" },
              { id: "details", label: "Details" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-6 py-3 font-medium transition-colors ${
                  selectedTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            {selectedTab === "description" && (
              <div>
                <p className="text-foreground leading-relaxed text-lg">{book.description}</p>
                {author && (
                  <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">About the Author</h3>
                    <div className="flex gap-4">
                      <Image
                        src={author.image || "/placeholder.svg"}
                        alt={`${author.firstName} ${author.lastName}`}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-lg">
                          {author.firstName} {author.lastName}
                        </h4>
                        <p className="text-muted-foreground mt-2">{author.biography}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Book Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="font-medium text-muted-foreground">ISBN</dt>
                      <dd>{book.isbn}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-muted-foreground">Published</dt>
                      <dd>{new Date(book.publishedDate).toLocaleDateString()}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-muted-foreground">Pages</dt>
                      <dd>{book.pages}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-muted-foreground">Genres</dt>
                      <dd>{book.genre.join(", ")}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {selectedTab === "reviews" && (
              <div>
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
                  <p className="text-muted-foreground">Reviews feature coming soon!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Books */}
        {otherBooksByAuthor.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold font-[var(--font-playfair)] mb-6">More books by {book.author}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {otherBooksByAuthor.slice(0, 4).map((relatedBook) => (
                <BookCard
                  key={relatedBook.id}
                  id={relatedBook.id}
                  title={relatedBook.title}
                  author={relatedBook.author}
                  image={relatedBook.image}
                  description={relatedBook.description}
                  price={relatedBook.price}
                  rating={relatedBook.rating}
                  reviewCount={relatedBook.reviewCount}
                  genre={relatedBook.genre}
                  inStock={relatedBook.inStock}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
