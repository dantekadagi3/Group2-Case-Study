"use client"
import BookCard from "../components/Bookcard";
import { useState } from "react"
import FilterButton from "../components/FilterButton";



const genres=["All","Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery", "Biography", "History", "Romance"]

export default function Books(){
  const [activeGenre, setActiveGenre] = useState("All");

  const handleFilter=(genre: string) => {
    setActiveGenre(genre);
    // Implementation of filter logic will go here

  }
    return (
     <section className="min-h-screen bg-[#0F172A]  items-center justify-center space-y-8 flex flex-col py-10 px-5">
        <div className="flex flex-col items-center justify-center  bg-[#0F172A] text-white p-8 space-y-4">
            <h1 className="text-4xl font-bold text-center">Discover Your Next Book</h1>
            <p className="mt-4 text-lg text-[#9CA3AF]">Browse through our collection of thousands of books</p>

          </div>
{/**input field and buttons */}
          <div>
            <div>
              <input></input>
            </div>
{/**The filter buttons*/}
         <div className="flex flex-wrap gap-3 justify-center mt-6">
  {genres.map((genre) => (
    <FilterButton
      key={genre}
      label={genre}
      isActive={activeGenre === genre}
      onClick={() => handleFilter(genre)}
    />
  ))}
</div>
          </div>
{/**The books */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
               <BookCard
                 id="8"
                 title="Book Title"
                 author="Author Name"
                 image="/img.png"
                 description="Short description of the book."
                 price={19.99}
               />
               <BookCard
                 id="9"
                 title="Book Title"
                 author="Author Name"
                 image="/img.png"
                 description="Short description of the book."
                 price={19.99}
               />
               <BookCard
                 id="10"
                 title="Book Title"
                 author="Author Name"
                 image="/img.png"
                 description="Short description of the book."
                 price={19.99}
               />
               <BookCard
                 id="11"
                 title="Book Title"
                 author="Author Name"
                 image="/img.png"
                 description="Short description of the book."
                 price={19.99}
               />
               <BookCard
                 id="12"
                 title="Book Title"
                 author="Author Name"
                 image="/img.png"
                 description="Short description of the book."
                 price={19.99}
               />
                         price={19.99}
            
               <BookCard
               id="13"
                           
                           title="Book Title"
                           author="Author Name"
                           image="/img.png"
                           description="Short description of the book."
                         price={19.99}
             />
               <BookCard
               id="14"
                           title="Book Title"
                           author="Author Name"
                           image="/img.png"
                           description="Short description of the book."
                         price={19.99}
             />
          </div>
        </section>
    );

}
 

  