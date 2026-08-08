"use client";
 

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimationControls } from "framer-motion";
import { Plus, Heart } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";



export function CategorySlider({ 
  title = "Trending Now",
  description = "Discover our most sought-after pieces, loved by interior designers and homemakers alike.",
  products = [] 
}: { 
  title?: string;
  description?: string;
  products?: any[];
}) {
  const displayItems = products || [];

  const { addToCart, toggleWishlist, wishlistItems } = useCart();

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const calculateWidth = () => {
      if (containerRef.current) {
        const scrollW = containerRef.current.scrollWidth;
        const offsetW = containerRef.current.offsetWidth;
        setWidth(Math.max(0, scrollW - offsetW));
      }
    };
    
    calculateWidth();
    
    // Also recalculate on window resize
    window.addEventListener("resize", calculateWidth);
    return () => window.removeEventListener("resize", calculateWidth);
  }, [displayItems]);

  return (
    <section className="py-12 md:py-16 bg-brand-secondary overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="px-6 md:px-12 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl text-brand-text mb-4">
                {title}
              </h2>
              <p className="font-sans text-brand-text/70 max-w-md">
                {description}
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href={`/category/${title.toLowerCase().replace(/\s+/g, '-')}`}
                className="font-button text-sm uppercase tracking-widest font-semibold border-b border-brand-text pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors"
              >
                Shop {title}
              </Link>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="cursor-grab active:cursor-grabbing w-full px-6 md:px-12">
          <motion.div
            drag={width > 0 ? "x" : false}
            dragConstraints={{ right: 0, left: -width }}
            className="flex gap-6 md:gap-8 w-max"
            style={{ touchAction: "pan-y" }}
          >
          {displayItems.length === 0 ? (
            <div className="w-full text-center py-12 text-brand-text/50">
              No products found. Add products in the admin dashboard.
            </div>
          ) : (
            displayItems.map((product, idx) => (
              <motion.div
                key={`${product.id}-${idx}`}
                className="w-[280px] md:w-[360px] flex-shrink-0 group relative"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link href={`/product/${product.id}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-brand-border/20 shadow-sm p-4">
                  <div className="relative aspect-[3/4] bg-brand-secondary overflow-hidden mb-4 rounded-xl">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-w-768px) 280px, 360px"
                    />

                    {/* Wishlist Button */}
                    <button 
                      className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 z-10 ${
                        wishlistItems.some(item => item.id === product.id) 
                          ? 'bg-brand-gold text-white shadow-md' 
                          : 'bg-white/80 text-brand-text/50 hover:bg-white hover:text-brand-gold opacity-0 group-hover:opacity-100'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                    >
                      <Heart 
                        className="w-4 h-4" 
                        fill={wishlistItems.some(item => item.id === product.id) ? "currentColor" : "none"} 
                      />
                    </button>
                    
                    {/* Quick Add Button */}
                    {product.inStock ? (
                      <button 
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-brand-text px-6 py-3 rounded-full font-button font-medium text-sm flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-brand-text hover:text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Quick Add
                      </button>
                    ) : (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-brand-text/50 px-6 py-3 rounded-full font-button font-medium text-sm flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg cursor-not-allowed">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col text-left px-1">
                    <p className="text-brand-text/50 text-xs uppercase tracking-wider font-semibold mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-heading text-lg md:text-xl text-brand-text group-hover:text-brand-gold transition-colors mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="font-sans font-medium text-brand-text">
                      {product.price}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
      </div>
    </section>
  );
}
