export interface Book {
  id: string
  title: string
  author: string
  authorId: string
  image: string
  description: string
  price: number
  genre: string[]
  isbn: string
  publishedDate: string
  pages: number
  rating: number
  reviewCount: number
  inStock: boolean
  featured: boolean
}

export interface Author {
  id: string
  firstName: string
  lastName: string
  biography: string
  image: string
}

export interface Genre {
  id: string
  name: string
  description: string
}

export const mockAuthors: Author[] = [
  {
    id: "1",
    firstName: "Harper",
    lastName: "Lee",
    biography: "Harper Lee was an American novelist best known for her 1960 novel To Kill a Mockingbird.",
    image: "/harper-lee-author-portrait.jpg",
  },
  {
    id: "2",
    firstName: "George",
    lastName: "Orwell",
    biography: "George Orwell was an English novelist and essayist, journalist and critic.",
    image: "/george-orwell-author-portrait.jpg",
  },
  {
    id: "3",
    firstName: "Jane",
    lastName: "Austen",
    biography: "Jane Austen was an English novelist known primarily for her six major novels.",
    image: "/jane-austen-author-portrait.jpg",
  },
  {
    id: "4",
    firstName: "F. Scott",
    lastName: "Fitzgerald",
    biography: "F. Scott Fitzgerald was an American novelist and short story writer.",
    image: "/f-scott-fitzgerald-author-portrait.jpg",
  },
  {
    id: "5",
    firstName: "Agatha",
    lastName: "Christie",
    biography: "Agatha Christie was an English writer known for her detective novels.",
    image: "/agatha-christie-author-portrait.jpg",
  },
]

export const mockGenres: Genre[] = [
  { id: "1", name: "Fiction", description: "Literary works of imaginative narration" },
  { id: "2", name: "Mystery", description: "Stories involving puzzles and crimes to solve" },
  { id: "3", name: "Romance", description: "Stories focused on love and relationships" },
  { id: "4", name: "Science Fiction", description: "Futuristic and speculative fiction" },
  { id: "5", name: "Biography", description: "Life stories of real people" },
  { id: "6", name: "Classic", description: "Timeless literary works" },
  { id: "7", name: "Dystopian", description: "Stories set in imaginary societies where something is terribly wrong" },
]

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    authorId: "1",
    image: "/to-kill-a-mockingbird-cover.png",
    description:
      "A gripping tale of racial injustice and childhood innocence in the American South. This timeless classic explores themes of morality, prejudice, and the loss of innocence through the eyes of Scout Finch.",
    price: 12.99,
    genre: ["Fiction", "Classic"],
    isbn: "978-0-06-112008-4",
    publishedDate: "1960-07-11",
    pages: 376,
    rating: 4.8,
    reviewCount: 2847,
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    authorId: "2",
    image: "/1984-book-cover.png",
    description:
      "A dystopian social science fiction novel that explores the dangers of totalitarianism. Set in a world of perpetual war and government surveillance, it remains chillingly relevant today.",
    price: 13.99,
    genre: ["Fiction", "Dystopian", "Science Fiction"],
    isbn: "978-0-452-28423-4",
    publishedDate: "1949-06-08",
    pages: 328,
    rating: 4.7,
    reviewCount: 3921,
    inStock: true,
    featured: true,
  },
  {
    id: "3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    authorId: "3",
    image: "/pride-and-prejudice-jane-austen-book-cover.jpg",
    description:
      "A romantic novel that critiques the British landed gentry at the end of the 18th century. Follow Elizabeth Bennet as she navigates issues of manners, upbringing, morality, and marriage.",
    price: 11.99,
    genre: ["Fiction", "Romance", "Classic"],
    isbn: "978-0-14-143951-8",
    publishedDate: "1813-01-28",
    pages: 432,
    rating: 4.6,
    reviewCount: 2156,
    inStock: true,
    featured: false,
  },
  {
    id: "4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    authorId: "4",
    image: "/the-great-gatsby-book-cover-art-deco.jpg",
    description:
      "A critique of the American Dream set in the Jazz Age. The story follows Nick Carraway's observations of his mysterious neighbor Jay Gatsby and his obsession with Daisy Buchanan.",
    price: 10.99,
    genre: ["Fiction", "Classic"],
    isbn: "978-0-7432-7356-5",
    publishedDate: "1925-04-10",
    pages: 180,
    rating: 4.4,
    reviewCount: 1834,
    inStock: true,
    featured: true,
  },
  {
    id: "5",
    title: "Murder on the Orient Express",
    author: "Agatha Christie",
    authorId: "5",
    image: "/murder-on-the-orient-express-agatha-christie-book-.jpg",
    description:
      "A classic detective novel featuring Hercule Poirot. When a murder occurs aboard the famous Orient Express, Poirot must solve the case before the train reaches its destination.",
    price: 14.99,
    genre: ["Mystery", "Fiction"],
    isbn: "978-0-06-207350-4",
    publishedDate: "1934-01-01",
    pages: 256,
    rating: 4.5,
    reviewCount: 1567,
    inStock: true,
    featured: false,
  },
  {
    id: "6",
    title: "Animal Farm",
    author: "George Orwell",
    authorId: "2",
    image: "/animal-farm-george-orwell-book-cover.jpg",
    description:
      "An allegorical novella about farm animals who rebel against their human farmer, hoping to create a society where animals can be equal, free, and happy.",
    price: 9.99,
    genre: ["Fiction", "Classic", "Dystopian"],
    isbn: "978-0-452-28424-1",
    publishedDate: "1945-08-17",
    pages: 112,
    rating: 4.3,
    reviewCount: 2234,
    inStock: true,
    featured: false,
  },
  {
    id: "7",
    title: "Sense and Sensibility",
    author: "Jane Austen",
    authorId: "3",
    image: "/sense-and-sensibility-jane-austen-book-cover.jpg",
    description:
      "Jane Austen's first published novel tells the story of the Dashwood sisters, Elinor and Marianne, as they navigate love, romance, and heartbreak.",
    price: 12.49,
    genre: ["Fiction", "Romance", "Classic"],
    isbn: "978-0-14-143949-5",
    publishedDate: "1811-10-30",
    pages: 409,
    rating: 4.2,
    reviewCount: 987,
    inStock: true,
    featured: false,
  },
  {
    id: "8",
    title: "The Murder of Roger Ackroyd",
    author: "Agatha Christie",
    authorId: "5",
    image: "/the-murder-of-roger-ackroyd-agatha-christie-book-c.jpg",
    description:
      "One of Christie's most famous novels featuring Hercule Poirot. A groundbreaking mystery that revolutionized the detective genre with its innovative narrative technique.",
    price: 13.49,
    genre: ["Mystery", "Fiction"],
    isbn: "978-0-06-207349-8",
    publishedDate: "1926-06-01",
    pages: 288,
    rating: 4.6,
    reviewCount: 1432,
    inStock: false,
    featured: false,
  },
  {
    id: "9",
    title: "This Side of Paradise",
    author: "F. Scott Fitzgerald",
    authorId: "4",
    image: "/this-side-of-paradise-f-scott-fitzgerald-book-cove.jpg",
    description:
      "Fitzgerald's debut novel follows Amory Blaine, a young Midwesterner who attends Princeton University and has a series of romances that eventually lead to his disillusionment.",
    price: 11.49,
    genre: ["Fiction", "Classic"],
    isbn: "978-0-684-80146-5",
    publishedDate: "1920-03-26",
    pages: 305,
    rating: 4.1,
    reviewCount: 756,
    inStock: true,
    featured: false,
  },
  {
    id: "10",
    title: "Emma",
    author: "Jane Austen",
    authorId: "3",
    image: "/emma-jane-austen-book-cover.jpg",
    description:
      "A comedy of manners about Emma Woodhouse, a precocious young woman whose misplaced confidence in her matchmaking abilities occasions several romantic misadventures.",
    price: 12.99,
    genre: ["Fiction", "Romance", "Classic"],
    isbn: "978-0-14-143952-5",
    publishedDate: "1815-12-23",
    pages: 474,
    rating: 4.3,
    reviewCount: 1123,
    inStock: true,
    featured: true,
  },
]

// Helper functions
export function getBookById(id: string): Book | undefined {
  return mockBooks.find((book) => book.id === id)
}

export function getBooksByGenre(genre: string): Book[] {
  return mockBooks.filter((book) => book.genre.includes(genre))
}

export function getFeaturedBooks(): Book[] {
  return mockBooks.filter((book) => book.featured)
}

export function searchBooks(query: string): Book[] {
  const lowercaseQuery = query.toLowerCase()
  return mockBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.genre.some((g) => g.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getAuthorById(id: string): Author | undefined {
  return mockAuthors.find((author) => author.id === id)
}

export function getBooksByAuthor(authorId: string): Book[] {
  return mockBooks.filter((book) => book.authorId === authorId)
}
