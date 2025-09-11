import Image from "next/image";
import CartButton from "./ui/Cartbutton";

type BookCardProps = {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
  price: number;
};

export default function BookCard({ id, title, author, image, description, price }: BookCardProps) {
  return (
    <div className="bg-[#1A1F36] rounded-2xl shadow-lg border border-gray-700 overflow-hidden w-64 flex flex-col">
      
      
      <div className="relative w-full h-40">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>

      
      <div className="flex flex-col justify-between p-4 flex-grow">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">By {author}</p>
          <p className="text-sm text-gray-300 mt-2 line-clamp-2">{description}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-[#38BDF8]">${price.toFixed(2)}</span>
          <CartButton
            book={{ id, title, author, image, description, price }}
          />
        </div>
      </div>
    </div>
  );
}
