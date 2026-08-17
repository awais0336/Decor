"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

export function FeaturedProducts({ products }: { products: any[] }) {
  const [contentWidth, setContentWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const midItemRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);

  if (!products || products.length === 0) return null;

  // Render 8 sets so massive inertia flicks never hit empty space
  const displayProducts = [
    ...products, ...products, ...products, ...products,
    ...products, ...products, ...products, ...products
  ];
  const midIndex = products.length * 4;

  useEffect(() => {
    const updateWidth = () => {
      if (firstItemRef.current && midItemRef.current) {
        setContentWidth(midItemRef.current.offsetLeft - firstItemRef.current.offsetLeft);
      }
    };
    
    updateWidth();
    const timeoutId = setTimeout(updateWidth, 150);
    window.addEventListener("resize", updateWidth);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateWidth);
    };
  }, [products]);

  useAnimationFrame((t, delta) => {
    if (contentWidth === 0) return;

    if (!isDragging.current) {
      // Check if inertia is still actively gliding the carousel from a flick
      const velocity = x.getVelocity();
      
      if (Math.abs(velocity) < 10) {
        // Inertia has fully stopped. We can safely auto-scroll and seamlessly wrap 
        // without breaking Framer Motion's physics pointer projection.
        let moveBy = -1.5 * (delta / 16); // Adjusted speed for smooth legible motion
        let currentX = x.get();
        let nextX = currentX + moveBy;
        
        if (nextX <= -contentWidth || nextX > 0) {
          nextX = wrap(-contentWidth, 0, nextX);
        }
        x.set(nextX);
      }
    }
  });

  return (
    <section className="py-12 md:py-16 bg-brand-primary overflow-hidden border-t border-b border-brand-border/10">
      <div className="max-w-[1600px] mx-auto w-full mb-8 px-6 md:px-12 text-center">
        <h2 className="font-heading text-3xl md:text-4xl text-brand-text relative inline-block">
          Featured Products
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-brand-gold"></div>
        </h2>
      </div>

      <div className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing">
        <motion.div
          ref={carouselRef}
          className="flex gap-8 md:gap-12 w-max px-4 md:px-6"
          style={{ x, touchAction: "pan-y" }}
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: -100000, right: 100000 }} // Massive bounds
          dragElastic={0}
          onDragStart={() => {
            isDragging.current = true;
          }}
          onDragEnd={() => {
            isDragging.current = false;
          }}
        >
          {displayProducts.map((product, idx) => (
            <Link 
              href={`/product/${product.id}`} 
              key={`${product.id}-${idx}`}
              ref={idx === 0 ? firstItemRef : idx === midIndex ? midItemRef : null}
              className="group/item flex flex-col items-center gap-4 w-[160px] md:w-[200px] flex-shrink-0"
              draggable="false" // Prevent native drag bugs
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-white shadow-sm group-hover/item:border-brand-gold group-hover/item:shadow-md transition-all duration-300">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                  sizes="(max-width: 768px) 160px, 200px"
                  draggable="false"
                  priority={idx < 4}
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
