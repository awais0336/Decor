"use client";
 

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { mergeCartWithSupabase, saveCartToSupabase } from "@/lib/actions/cart";

export type CartItem = {
  id: string;
  name: string;
  price: string;
  rawPrice: number;
  image: string;
  quantity: number;
  variant?: any;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  wishlistItems: any[];
  toggleWishlist: (product: any) => void;
  clearCart: () => void;
  updateQuantity: (id: string, delta: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const initialLoadDone = useRef(false);

  useEffect(() => {
    setMounted(true);
    
    // Load local wishlist
    const savedWishlist = localStorage.getItem("decornish_wishlist");
    if (savedWishlist) {
      try { setWishlistItems(JSON.parse(savedWishlist)); } catch (e) {}
    }

    // Load local cart
    const savedCart = localStorage.getItem("decornish_cart");
    let localCart: CartItem[] = [];
    if (savedCart) {
      try { localCart = JSON.parse(savedCart); } catch (e) {}
    }

    const supabase = createClient();
    
    // Check Auth and merge cart
    supabase.auth.getUser().then(async ({ data: { user: currentUser } }) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Merge local cart with DB cart
        const result = await mergeCartWithSupabase(localCart);
        if (result.success && result.items) {
          setItems(result.items);
          localStorage.setItem("decornish_cart", JSON.stringify(result.items));
        } else {
          setItems(localCart);
        }
      } else {
        setItems(localCart);
      }
      initialLoadDone.current = true;
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      
      // If user logged in (transition from null to user)
      if (currentUser && !user && initialLoadDone.current) {
        const result = await mergeCartWithSupabase(items);
        if (result.success && result.items) {
          setItems(result.items);
        }
      } else if (!currentUser && user) {
        // Logged out
        setItems([]);
        localStorage.removeItem("decornish_cart");
      }
      
      setUser(currentUser);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Run once on mount

  // Sync to local storage and DB when items change
  useEffect(() => {
    if (mounted && initialLoadDone.current) {
      localStorage.setItem("decornish_wishlist", JSON.stringify(wishlistItems));
      localStorage.setItem("decornish_cart", JSON.stringify(items));

      if (user) {
        // Debounce or just save directly (since it's server action, let's just save)
        const timeout = setTimeout(() => {
          saveCartToSupabase(items);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [wishlistItems, items, mounted, user]);

  const addToCart = (product: any) => {
    if (product.inStock === false) {
      return; 
    }
    const itemImage = product.image || (product.images && product.images[0]) || "";
    const qtyToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;
    
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
        );
      }
      return [...prev, { ...product, image: itemImage, quantity: qtyToAdd }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleWishlist = (product: any) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("decornish_cart");
    }
    if (user) {
      saveCartToSupabase([]);
    }
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, cartCount, isCartOpen, setIsCartOpen, wishlistItems, toggleWishlist, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
