"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function FeaturedProducts({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  // Duplicate items for seamless infinite scroll
  // We make sure there are enough items to fill the screen
  const displayProducts = [...products, ...products, ...products, ...products];

  return (
    <section className="py-12 md:py-16 bg-brand-primary overflow-hidden border-t border-b border-brand-border/10">
      <div className="max-w-[1600px] mx-auto w-full mb-8 px-6 md:px-12 text-center">
        <h2 className="font-heading text-3xl md:text-4xl text-brand-text relative inline-block">
          Featured Products
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-brand-gold"></div>
        </h2>
      </div>

      <div className="relative w-full flex overflow-hidden group">
        <motion.div
          className="flex gap-8 md:gap-12 w-max px-4 md:px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 45, // Slowed down from 30
          }}
          style={{
            willChange: "transform",
          }}
        >
          {displayProducts.map((product, idx) => (
            <Link 
              href={`/product/${product.id}`} 
              key={`${product.id}-${idx}`}
              className="group/item flex flex-col items-center gap-4 w-[160px] md:w-[200px] flex-shrink-0"
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-white shadow-sm group-hover/item:border-brand-gold group-hover/item:shadow-md transition-all duration-300">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                  sizes="(max-width: 768px) 160px, 200px"
                />
              </div>
              <div className="text-center">
                <h3 className="font-heading text-lg text-brand-text truncate w-[140px] md:w-[180px] group-hover/item:text-brand-gold transition-colors">
                  {product.name}
                </h3>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
