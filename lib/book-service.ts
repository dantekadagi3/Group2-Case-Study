import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

type DatabaseBook = {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  stock_quantity: number | null
  published_date?: string
  pages?: number
  isbn?: string
  rating?: number
  reviews_count?: number
  author: {
    id: string
    name: string
  }
  category: {
    name: string
  }
}

const mapDatabaseBookToBook = (book: DatabaseBook): Book => ({
  id: book.id,
  title: book.title,
  author: book.author.name,
  description: book.description || '',
  price: book.price,
  image_url: book.image_url || undefined,
  stock_quantity: book.stock_quantity || undefined,
  category: book.category?.name,
  rating: book.rating,
  reviewCount: book.reviews_count
})

type AuthorRow = {
  id: string
  name: string
  biography?: string
  image_url?: string
}

export type Book = {
  id: string  // UUID
  title: string
  author: string
  description: string
  price: number
  image_url?: string
  stock_quantity?: number
  category?: string
  rating?: number
  reviewCount?: number
}

export type Category = {
  id: string
  name: string
  description?: string
}

export const getCategories = async (): Promise<Category[]> => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, description')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getCategories:', error)
    return []
  }
}

export const getFeaturedBooks = async (): Promise<Book[]> => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        author:authors!inner(*),
        category:categories!inner(name)
      `)
      .limit(5)  // Limit to 5 featured books
      .order('rating', { ascending: false })  // Get highest rated books

    if (error) {
      console.error('Error fetching featured books:', error)
      return []
    }

    return (data || []).map((book: DatabaseBook) => mapDatabaseBookToBook(book))
  } catch (error) {
    console.error('Error in getFeaturedBooks:', error)
    return []
  }
}

export const getBooks = async (): Promise<Book[]> => {
  const supabase = createClient()
  console.log('Fetching books...')

  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        author:authors(name),
        category:categories(name)
      `)

    if (error) {
      console.error('Error fetching books:', error)
      return []
    }

    console.log('Raw books data:', data)

    if (!data || data.length === 0) {
      console.log('No books found in the database')
      return []
    }

    const books = data.map((book: DatabaseBook) => mapDatabaseBookToBook(book))

    console.log('Processed books:', books)
    return books
  } catch (error) {
    console.error('Error in getBooks:', error)
    return []
  }
}

export const isUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export type Author = {
  id: string
  name: string
  biography?: string
  image_url?: string
}

export type BookDetails = Book & {
  authorId: string
  publishedDate?: string
  pages?: number
  isbn?: string
  rating?: number
  reviewCount?: number
  genre: string[]
}

export const getBookById = async (id: string): Promise<BookDetails | null> => {
  const supabase = createClient()
  
  if (!isUUID(id)) {
    console.error("Invalid UUID format:", id)
    return null
  }

  try {
    const { data, error } = await supabase
      .from("books")
      .select(`
        *,
        author:authors!inner(*),
        category:categories!inner(name)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching book:", error)
      return null
    }

    const bookData = data as DatabaseBook
    if (bookData) {
      return {
        id: bookData.id,
        title: bookData.title,
        author: bookData.author.name,
        authorId: bookData.author.id,
        description: bookData.description || "",
        price: bookData.price,
        image_url: bookData.image_url || undefined,
        stock_quantity: bookData.stock_quantity || undefined,
        publishedDate: bookData.published_date,
        pages: bookData.pages,
        isbn: bookData.isbn,
        rating: bookData.rating || 4.5,
        reviewCount: bookData.reviews_count || 0,
        genre: bookData.category ? [bookData.category.name] : []
      }
    }

    return null
  } catch (error) {
    console.error("Error in getBookById:", error)
    return null
  }
}

export const getAuthorById = async (id: string): Promise<Author | null> => {
  const supabase = createClient()

  if (!isUUID(id)) {
    console.error("Invalid UUID format:", id)
    return null
  }

  try {
    const { data, error } = await supabase
      .from("authors")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching author:", error)
      return null
    }

    const authorData = data as AuthorRow
    if (authorData) {
      return {
        id: authorData.id,
        name: authorData.name,
        biography: authorData.biography || undefined,
        image_url: authorData.image_url || undefined
      }
    }

    return null
  } catch (error) {
    console.error("Error in getAuthorById:", error)
    return null
  }
}

export const getBooksByAuthor = async (authorId: string): Promise<Book[]> => {
  const supabase = createClient()

  if (!isUUID(authorId)) {
    console.error("Invalid UUID format:", authorId)
    return []
  }

  try {
    const { data, error } = await supabase
      .from("books")
      .select(`
        *,
        author:authors!inner(*),
        category:categories!inner(name)
      `)
      .eq("author_id", authorId)

    if (error) {
      console.error("Error fetching author's books:", error)
      return []
    }

    return (data || []).map((book: DatabaseBook) => mapDatabaseBookToBook(book))
  } catch (error) {
    console.error("Error in getBooksByAuthor:", error)
    return []
  }
}