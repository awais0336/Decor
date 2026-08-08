"use client";

import { useCart } from "@/components/cart/CartContext";
import Image from "next/image";
import Link from "next/link";
import { HeartCrack, ShoppingBag, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, addToCart } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-brand-primary">
      <div className="flex-1 pt-40 md:pt-48 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="flex items-end justify-between mb-12 border-b border-brand-border/50 pb-6">
          <div>
            <h1 className="font-heading text-4xl text-brand-text mb-2">Your Wishlist</h1>
            <p className="text-brand-text/70">
              Curate your dream space. Items saved here will remain until you're ready.
            </p>
          </div>
          <div className="text-sm font-medium text-muted-foreground hidden md:block">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
          </div>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <HeartCrack className="w-16 h-16 text-muted-foreground opacity-30 mb-6" />
            <h2 className="text-2xl font-heading mb-4">Nothing saved yet</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Explore our collections and tap the heart icon on any item to save it here for later.
            </p>
            <Link 
              href="/" 
              className="bg-brand-text text-white px-8 py-3 rounded-md font-button hover:bg-brand-gold transition-colors"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((product) => (
              <div key={product.id} className="group relative bg-white p-4 rounded-md shadow-sm border hover:shadow-md transition-shadow">
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative aspect-square rounded-sm overflow-hidden mb-4 bg-muted">
                    <Image
                      src={product.image || (product.images && product.images[0]) || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=600"}
                      alt={product.name}
                      fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="text-brand-text/50 text-xs uppercase tracking-wider font-semibold mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-heading text-lg text-brand-text line-clamp-1 group-hover:text-brand-gold transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-sans font-medium text-brand-text mt-1 block">
                      {product.price}
                    </span>
                  </div>
                </Link>
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-dashed">
                  {product.inStock === false ? (
                    <button 
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 bg-brand-text/50 text-white py-2 rounded-md font-button text-xs font-semibold cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-brand-text text-white py-2 rounded-md font-button text-xs font-semibold hover:bg-brand-gold transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Move to Cart
                    </button>
                  )}
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="px-3 py-2 border rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
