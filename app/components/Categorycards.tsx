
import Image from "next/image";

type CategoryCardProps = {
  title: string;
  image: string;
  description: string;
};

export default function CategoryCard({ title, image, description }: CategoryCardProps) {
  return (
    <div className="bg-transparent rounded-lg shadow-md overflow-hidden border-1 border-gray-300 flex justify-center items-center flex-col hover:scale-105 transition-transform duration-300 text-center py-3.5 h-64 w-64">
      <div className="h-20 w-20 rounded-full flex items-center justify-center mx-auto p-5 overflow-hidden   bg-[#38BDF8]/30">
        <Image src={image} alt={title} width={50} height={50} className="w-full h-48 object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};


