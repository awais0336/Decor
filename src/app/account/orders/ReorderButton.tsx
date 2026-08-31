"use client";

import { useCart } from "@/components/cart/CartContext";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReorderButton({ orderItems }: { orderItems: any[] }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [isReordering, setIsReordering] = useState(false);
  const router = useRouter();

  const handleReorder = async () => {
    setIsReordering(true);
    let itemsAdded = false;
    
    // Add available items to cart
    for (const item of orderItems) {
      if (item.variants && item.variants.products) {
        // If the product is active and there's stock
        if (item.variants.stock_quantity > 0 && item.variants.products.status === "active") {
          addToCart({
            id: item.variants.products.id,
            variant: item.variants,
            name: item.variants.products.name,
            price: `Rs ${item.price_at_time}`,
            rawPrice: Number(item.price_at_time),
            image: item.variants.image_url || item.variants.products.image_url || "",
            quantity: 1, // Only add 1 for reorder initially, or item.quantity if preferred
          });
          itemsAdded = true;
        }
      }
    }
    
    setIsReordering(false);
    
    if (itemsAdded) {
      setIsCartOpen(true);
    } else {
      alert("Sorry, these items are currently out of stock or unavailable.");
    }
  };

  return (
    <button
      onClick={handleReorder}
      disabled={isReordering}
      className="inline-flex items-center gap-2 text-sm bg-brand-gold text-white px-4 py-2 rounded-md hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
    >
      <RefreshCcw className={`w-4 h-4 ${isReordering ? "animate-spin" : ""}`} />
      {isReordering ? "Processing..." : "Reorder"}
    </button>
  );
}
