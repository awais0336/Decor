
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Paintings",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800",
    itemCount: 42,
  },
  {
    name: "Clocks",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=800",
    itemCount: 18,
  },
  {
    name: "Lamps",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
    itemCount: 35,
  },
  {
    name: "Plants",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800",
    itemCount: 24,
  },
  {
    name: "Mirrors",
    image: "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&q=80&w=800",
    itemCount: 15,
  },
  {
    name: "Wall Decor",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    itemCount: 56,
  },
];

export function ShopByCategory() {
  return (
    <section className="py-24 md:py-32 bg-brand-primary px-6 md:px-12 border-t border-brand-border/50">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-brand-text leading-tight mb-4">
              Shop by Category
            </h2>
            <p className="font-sans text-brand-text/70 max-w-xl text-lg">
              Explore our curated selection of premium decor items designed to elevate your personal spaces.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.name.toLowerCase().replace(" ", "-")}`}
              className="group relative aspect-[3/4] overflow-hidden bg-brand-secondary flex flex-col justify-end"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              <div className="relative z-10 p-8 flex justify-between items-end">
                <div>
                  <h3 className="font-heading text-3xl text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-white/70 font-sans text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {category.itemCount} Products
                  </p>
                </div>
                
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-bottom-right">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
