import BookCard from "./components/Bookcard";
import CategoryCard from "./components/Categorycards";
import Button from "./components/ui/Buttons";

export default function HomePage() {
  return (
    <main>
    
      <section
        className="relative h-screen flex items-center bg-cover bg-center bg-no-repeat"
        style={{
          background: `linear-gradient(rgba(26, 31, 54, 0.9), rgba(26, 31, 54, 0.9)),
          url("/book.jpeg")`,
        }}
      >
        <div className="flex flex-col items-center justify-center text-center w-full h-full px-6">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white">
            Welcome to BookStore
          </h1>
          <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-gray-200">
            Discover your next great read
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button name="Browse Books" className="py-4 px-6" />
            <Button
              name="Join Membership"
              className="py-4 px-6 bg-transparent border border-sky-400"
            />
          </div>
        </div>
      </section>

    
      <section className="px-6 py-16 bg-[#0F172A]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Featured Books
          </h2>
          <p className="text-blue-400 cursor-pointer hover:underline">
            View all
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <BookCard
            id="1"
            title="Book Title"
            author="Author Name"
            image="/img.png"
            description="Short description of the book."
            price={19.99}
          />
          <BookCard
            id="2"
            title="Book Title"
            author="Author Name"
            image="/img.png"
            description="Short description of the book."
            price={19.99}
          />
          <BookCard
            id="3"
            title="Book Title"
            author="Author Name"
            image="/img.png"
            description="Short description of the book."
            price={19.99}
          />
          <BookCard
            id="4"
            title="Book Title"
            author="Author Name"
            image="/img.png"
            description="Short description of the book."
            price={19.99}
          />
           <BookCard
            id="5"
            title="Book Title"
            author="Author Name"
            image="/img.png"
            description="Short description of the book."
            price={19.99}
          />
           <BookCard
            id="6"
            title="Book Title"
            author="Author Name"
            image="/img.png"
            description="Short description of the book."
            price={19.99}
          />
           <BookCard
            id="7"
            title="Book Title"
            author="Author Name"
            image="/img.png"
            description="Short description of the book."
            price={19.99}
          />
        </div>
      </section>

      <section className="px-6 py-16 bg-[#1A1F36]">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <CategoryCard
            title="Fiction"
            image="/div.svg"
            description="Explore the world of fiction books."
          />
          <CategoryCard
            title="Sci-Fi"
            image="/Scifi.svg"
            description="Explore the universe of science fiction."
          />
          <CategoryCard
            title="Mystery"
            image="/mystery.jpg"
            description="Dive into the latest mystery books."
          />
          <CategoryCard
            title="Biography"
            image="/biography.jpg"
            description="Dive into the latest biography books."
          />
        </div>
      </section>

      
      <section
        className="py-20 px-6 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #0C4A6E, #1A1F36)",
        }}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Stay Updated</h2>
          <p className="text-lg text-gray-200">
            Subscribe to our newsletter for the latest book releases, exclusive
            deals, and reading recommendations.
          </p>

          <div className="flex flex-col sm:flex-row justify-center w-full gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-md sm:rounded-l-md sm:rounded-r-none border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-2/3 md:w-1/2 text-white placeholder-gray-400 bg-[#1A1F36]"
            />
            <button className="py-3 px-6 rounded-md sm:rounded-r-md sm:rounded-l-none bg-blue-500 text-white hover:bg-blue-600 font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
