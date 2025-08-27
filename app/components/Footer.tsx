"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#1A1F36] text-white py-10 px-6">
      {/* Grid container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Column 1 */}
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Image src="/Frame.svg" alt="Bookstore Logo" width={40} height={40} />
            Bookstore
          </h2>
          <p className="mt-4 text-gray-300 text-sm">
            Your destination for discovering great books and expanding your knowledge.
          </p>
         
         
        </div>

        {/* Column 2 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">About</Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white transition">Shop</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Column 3  */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <Image src="/location.svg" alt="Location Icon" width={20} height={20} />
            <span>123 Book St, Library City, 45678</span>
          </p>
          <p className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <Image src="/email.svg" alt="Email Icon" width={20} height={20} />
            <span>info@bookstore.com</span>
          </p>
          <p className="flex items-center gap-2 text-gray-300 text-sm">
            <Image src="/phone.svg" alt="Phone Icon" width={20} height={20} />
            <span>(123) 456-7890</span>
          </p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="text-center border-t border-gray-700 mt-8 pt-4 text-gray-400 text-sm">
        <p>&copy; 2025 Bookstore. All rights reserved.</p>
      </div>
    </footer>
  );
}
