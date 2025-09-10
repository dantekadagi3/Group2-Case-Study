"use client"

import { createClient } from "@/lib/supabase/client"

export interface Book {
  id: string
  title: string
  author_name: string
  author_id: string
  category_name: string
  category_id: string
  image_url: string
  description: string
  price: number
  isbn: string
  publication_date: string
  pages: number
  rating: number
  reviews_count: number
  stock_quantity: number
  in_stock: boolean
}

export interface Author {
  id: string
  name: string
  bio: string
  image_url: string
}

export interface Category {
  id: string
  name: string
  description: string
}

const supabase = createClient()

export async function fetchBooks(): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from("books")
      .select(`
        id,
        title,
        isbn,
        description,
        price,
        stock_quantity,
        image_url,
        publication_date,
        pages,
        rating,
        reviews_count,
        authors (
          id,
          name
        ),
        categories (
          id,
          name
        )
      `)
      .order("title")

    if (error) throw error

    return (
      data?.map((book) => ({
        id: book.id,
        title: book.title,
        author_name: book.authors?.name || "Unknown Author",
        author_id: book.authors?.id || "",
        category_name: book.categories?.name || "Uncategorized",
        category_id: book.categories?.id || "",
        image_url: book.image_url || "/placeholder.svg",
        description: book.description || "",
        price: book.price,
        isbn: book.isbn || "",
        publication_date: book.publication_date || "",
        pages: book.pages || 0,
        rating: book.rating || 0,
        reviews_count: book.reviews_count || 0,
        stock_quantity: book.stock_quantity || 0,
        in_stock: book.stock_quantity > 0,
      })) || []
    )
  } catch (error) {
    console.error("Error fetching books:", error)
    return []
  }
}

export async function fetchBookById(id: string): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from("books")
      .select(`
        id,
        title,
        isbn,
        description,
        price,
        stock_quantity,
        image_url,
        publication_date,
        pages,
        rating,
        reviews_count,
        authors (
          id,
          name
        ),
        categories (
          id,
          name
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      author_name: data.authors?.name || "Unknown Author",
      author_id: data.authors?.id || "",
      category_name: data.categories?.name || "Uncategorized",
      category_id: data.categories?.id || "",
      image_url: data.image_url || "/placeholder.svg",
      description: data.description || "",
      price: data.price,
      isbn: data.isbn || "",
      publication_date: data.publication_date || "",
      pages: data.pages || 0,
      rating: data.rating || 0,
      reviews_count: data.reviews_count || 0,
      stock_quantity: data.stock_quantity || 0,
      in_stock: data.stock_quantity > 0,
    }
  } catch (error) {
    console.error("Error fetching book:", error)
    return null
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase.from("categories").select("id, name, description").order("name")

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function fetchAuthors(): Promise<Author[]> {
  try {
    const { data, error } = await supabase.from("authors").select("id, name, bio, image_url").order("name")

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching authors:", error)
    return []
  }
}

export async function searchBooks(query: string): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from("books")
      .select(`
        id,
        title,
        isbn,
        description,
        price,
        stock_quantity,
        image_url,
        publication_date,
        pages,
        rating,
        reviews_count,
        authors (
          id,
          name
        ),
        categories (
          id,
          name
        )
      `)
      .or(`title.ilike.%${query}%, authors.name.ilike.%${query}%, categories.name.ilike.%${query}%`)
      .order("title")

    if (error) throw error

    return (
      data?.map((book) => ({
        id: book.id,
        title: book.title,
        author_name: book.authors?.name || "Unknown Author",
        author_id: book.authors?.id || "",
        category_name: book.categories?.name || "Uncategorized",
        category_id: book.categories?.id || "",
        image_url: book.image_url || "/placeholder.svg",
        description: book.description || "",
        price: book.price,
        isbn: book.isbn || "",
        publication_date: book.publication_date || "",
        pages: book.pages || 0,
        rating: book.rating || 0,
        reviews_count: book.reviews_count || 0,
        stock_quantity: book.stock_quantity || 0,
        in_stock: book.stock_quantity > 0,
      })) || []
    )
  } catch (error) {
    console.error("Error searching books:", error)
    return []
  }
}

export async function fetchBooksByCategory(categoryName: string): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from("books")
      .select(`
        id,
        title,
        isbn,
        description,
        price,
        stock_quantity,
        image_url,
        publication_date,
        pages,
        rating,
        reviews_count,
        authors (
          id,
          name
        ),
        categories!inner (
          id,
          name
        )
      `)
      .eq("categories.name", categoryName)
      .order("title")

    if (error) throw error

    return (
      data?.map((book) => ({
        id: book.id,
        title: book.title,
        author_name: book.authors?.name || "Unknown Author",
        author_id: book.authors?.id || "",
        category_name: book.categories?.name || "Uncategorized",
        category_id: book.categories?.id || "",
        image_url: book.image_url || "/placeholder.svg",
        description: book.description || "",
        price: book.price,
        isbn: book.isbn || "",
        publication_date: book.publication_date || "",
        pages: book.pages || 0,
        rating: book.rating || 0,
        reviews_count: book.reviews_count || 0,
        stock_quantity: book.stock_quantity || 0,
        in_stock: book.stock_quantity > 0,
      })) || []
    )
  } catch (error) {
    console.error("Error fetching books by category:", error)
    return []
  }
}
