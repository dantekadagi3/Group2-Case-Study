"use client";

import Image from "next/image";
import { useCart } from "@/app/context/CartContext";

type CartButtonProps = {
  book: {
    id: string;
    title: string;
    author: string;
    image: string;
    description: string;
    price: number;
  };
};

export default function CartButton({ book }: CartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(book)}
      className="flex items-center bg-[#1A1F36] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#2A2F46] border-2 border-[#38BDF8] transition"
    >
      <Image
        src="/i.png"
        alt="Add to Cart"
        width={20}
        height={20}
        className="inline-block mr-2"
      />
      <span>Add to Cart</span>
    </button>
  );
}
