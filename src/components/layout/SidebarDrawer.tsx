"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { getCategories } from "@/lib/actions/categories";
import { cn } from "@/lib/utils";

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarDrawer({ isOpen, onClose }: SidebarDrawerProps) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      getCategories().then(data => {
        setCategories(data);
      });
    }
  }, [isOpen, categories.length]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[85vw] max-w-[400px] bg-background z-[70] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-border/50">
          <h2 className="font-heading text-xl uppercase tracking-widest text-brand-text">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-brand-text/50 hover:text-brand-text transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-8">
          
          {/* Static Promo Links */}
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={onClose} className="font-sans text-brand-text text-lg hover:text-brand-gold transition-colors">Home Page</Link>
            <Link href="/collections" onClick={onClose} className="font-sans text-brand-text text-lg hover:text-brand-gold transition-colors">All Products</Link>
            <Link href="/contact" onClick={onClose} className="font-sans text-brand-text text-lg hover:text-brand-gold transition-colors">Track Your Order!</Link>
            
            <div className="h-px bg-brand-border/50 my-2" />
            
            {/* You can edit these placeholder sale links later! */}
            <Link href="#" onClick={onClose} className="font-sans text-brand-gold text-lg hover:text-brand-text transition-colors flex items-center">
              Summer Sale Special! 🎉
            </Link>
            <Link href="#" onClick={onClose} className="font-sans text-brand-gold text-lg hover:text-brand-text transition-colors flex items-center">
              Under 999 Sale
            </Link>
          </div>

          <div className="h-px bg-brand-border/50" />

          {/* Categories */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-brand-text/50">
              Categories
            </h3>
            <div className="flex flex-col gap-4">
              {categories.filter(c => !c.parent_id).map(category => (
                <div key={category.id} className="flex flex-col gap-2">
                  <Link 
                    href={`/category/${category.slug}`} 
                    onClick={onClose}
                    className="font-sans text-brand-text text-lg hover:text-brand-gold transition-colors flex items-center justify-between group"
                  >
                    {category.name}
                  </Link>
                  {/* Subcategories */}
                  {categories.filter(sub => sub.parent_id === category.id).map(sub => (
                    <Link 
                      key={sub.id}
                      href={`/category/${category.slug}/${sub.slug}`} 
                      onClick={onClose}
                      className="font-sans text-brand-text/70 text-base pl-4 hover:text-brand-gold transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              ))}
              
              <Link 
                href="/category" 
                onClick={onClose}
                className="font-sans text-brand-text text-lg mt-4 flex items-center gap-2 hover:text-brand-gold transition-colors group"
              >
                Explore All Categories
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
