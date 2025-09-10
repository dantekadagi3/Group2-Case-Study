import Image from "next/image"
import Link from "next/link"
import CartButton from "./ui/Cartbutton"
import { Star, StarHalf } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type BookCardProps = {
  id: string
  title: string
  author: string
  image: string
  description: string
  price: number
  rating?: number
  reviewCount?: number
  genre?: string[]
  inStock?: boolean
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
      ))}
      {hasHalfStar && <StarHalf className="h-3 w-3 fill-primary text-primary" />}
      <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>
    </div>
  )
}

export default function BookCard({
  id,
  title,
  author,
  image,
  description,
  price,
  rating = 0,
  reviewCount = 0,
  genre = [],
  inStock = true,
}: BookCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/books/${id}`} className="block">
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col justify-between p-4 flex-grow">
        <div className="space-y-2">
          <Link href={`/books/${id}`}>
            <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 font-[var(--font-playfair)]">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">by {author}</p>

          {rating > 0 && <StarRating rating={rating} reviewCount={reviewCount} />}

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>

          {genre.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {genre.slice(0, 2).map((g) => (
                <Badge key={g} variant="secondary" className="text-xs">
                  {g}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-2 border-t border-border">
          <span className="text-xl font-bold text-primary">${price.toFixed(2)}</span>
          <CartButton book={{ id, title, author, image, description, price }} disabled={!inStock} />
        </div>
      </div>
    </div>
  )
}
