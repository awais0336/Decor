"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, LayoutGrid, List, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStorefrontProducts } from "@/lib/actions/storefront";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

const PRICE_RANGES = [
  { label: "Under Rs. 1,000", min: 0, max: 1000 },
  { label: "Rs. 1,000 - Rs. 5,000", min: 1000, max: 5000 },
  { label: "Rs. 5,000 - Rs. 10,000", min: 5000, max: 10000 },
  { label: "Over Rs. 10,000", min: 10000, max: Infinity },
];

interface CollectionsClientProps {
  categorySlug?: string;
  breadcrumbs?: BreadcrumbItem[];
  initialProducts?: any[];
}

export default function CollectionsClient({ categorySlug, breadcrumbs, initialProducts = [] }: CollectionsClientProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState<any[]>(initialProducts);

  // State from URL
  const selectedCategories = searchParams.getAll("category");
  const selectedPriceRanges = searchParams.getAll("price");
  const sortBy = searchParams.get("sort") || "newest";

  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const updateFilters = (key: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.append(key, value);
    } else {
      const allValues = params.getAll(key).filter(v => v !== value);
      params.delete(key);
      allValues.forEach(v => params.append(key, v));
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const updateSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("price");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const displayedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(p => {
        const price = p.rawPrice;
        return selectedPriceRanges.some(rangeLabel => {
          const range = PRICE_RANGES.find(r => r.label === rangeLabel);
          return range && price >= range.min && price < range.max;
        });
      });
    }

    let sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.rawPrice - b.rawPrice);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.rawPrice - a.rawPrice);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
    }

    return sorted;
  }, [products, categorySlug, selectedCategories, selectedPriceRanges, sortBy]);

  const hasActiveFilters = selectedCategories.length > 0 || selectedPriceRanges.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-brand-primary">
      
      {/* Header */}
      <div className="pt-40 md:pt-48 pb-16 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} />
        )}
        <h1 className="font-heading text-5xl md:text-6xl text-brand-text mb-6">
          {categorySlug ? categorySlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Explore Collection"}
        </h1>
        <p className="font-sans text-brand-text/70 max-w-2xl text-lg">
          Discover our curated selection of premium furniture and home decor designed to elevate your living spaces.
        </p>
      </div>
      
      {/* Filters Bar */}
      <div className="sticky top-20 z-40 bg-brand-primary/90 backdrop-blur-md border-y border-brand-border px-6 md:px-12 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 font-button font-medium text-sm text-brand-text hover:text-brand-gold transition-colors uppercase tracking-widest"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters {filtersOpen ? "-" : "+"}
            </button>
            <span className="text-brand-text/30">|</span>
            <span className="font-sans text-sm text-brand-text/70">{displayedProducts.length} Products</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-button font-medium uppercase tracking-widest relative">
              <span className="hidden sm:inline">Sort By</span>
              <select 
                value={sortBy}
                onChange={updateSort}
                className="appearance-none bg-transparent font-button font-medium text-sm text-brand-text uppercase tracking-widest focus:outline-none cursor-pointer pr-6"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-0 pointer-events-none" />
            </div>
            <div className="flex items-center gap-2 border-l border-brand-border pl-6">
              <button onClick={() => setView("grid")} className={`p-2 transition-colors ${view === "grid" ? "text-brand-text" : "text-brand-text/30"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "text-brand-text" : "text-brand-text/30"}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-6 md:px-12 max-w-[1600px] mx-auto w-full py-12 flex relative">
        
        {/* Sidebar Filters */}
        <AnimatePresence>
          {filtersOpen && (
             <motion.div 
               initial={{ width: 0, opacity: 0, marginRight: 0 }}
               animate={{ width: 280, opacity: 1, marginRight: 48 }}
               exit={{ width: 0, opacity: 0, marginRight: 0 }}
               className="hidden md:block overflow-hidden flex-shrink-0"
             >
               <div className="w-[280px] pr-8 space-y-8">
                 {hasActiveFilters && (
                   <button 
                     onClick={clearFilters}
                     className="flex items-center gap-2 font-button text-xs uppercase tracking-widest text-brand-text hover:text-brand-gold transition-colors pb-4 border-b border-brand-border w-full"
                   >
                     <X className="w-4 h-4" /> Clear All Filters
                   </button>
                 )}
                 
                 {/* Category Filter */}
                 {!categorySlug && uniqueCategories.length > 0 && (
                   <div className="border-b border-brand-border pb-6">
                     <h3 className="font-heading text-xl mb-4 text-brand-text">Category</h3>
                     <div className="space-y-3">
                       {uniqueCategories.map((category) => {
                         const isSelected = selectedCategories.includes(category);
                         return (
                           <label key={category} className="flex items-center gap-3 cursor-pointer group/label">
                             <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-gold border-brand-gold text-brand-primary' : 'border-brand-border group-hover/label:border-brand-gold'}`}>
                               {isSelected && <Check className="w-3 h-3" />}
                             </div>
                             <input 
                               type="checkbox" 
                               className="hidden" 
                               checked={isSelected}
                               onChange={(e) => updateFilters("category", category, e.target.checked)}
                             />
                             <span className={`font-sans text-sm transition-colors ${isSelected ? 'text-brand-text font-medium' : 'text-brand-text/70 group-hover/label:text-brand-text'}`}>
                               {category}
                             </span>
                           </label>
                         );
                       })}
                     </div>
                   </div>
                 )}

                 {/* Price Range Filter */}
                 <div className="border-b border-brand-border pb-6">
                   <h3 className="font-heading text-xl mb-4 text-brand-text">Price Range</h3>
                   <div className="space-y-3">
                     {PRICE_RANGES.map((range) => {
                       const isSelected = selectedPriceRanges.includes(range.label);
                       return (
                         <label key={range.label} className="flex items-center gap-3 cursor-pointer group/label">
                           <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-gold border-brand-gold text-brand-primary' : 'border-brand-border group-hover/label:border-brand-gold'}`}>
                             {isSelected && <Check className="w-3 h-3" />}
                           </div>
                           <input 
                             type="checkbox" 
                             className="hidden" 
                             checked={isSelected}
                             onChange={(e) => updateFilters("price", range.label, e.target.checked)}
                           />
                           <span className={`font-sans text-sm transition-colors ${isSelected ? 'text-brand-text font-medium' : 'text-brand-text/70 group-hover/label:text-brand-text'}`}>
                             {range.label}
                           </span>
                         </label>
                       );
                     })}
                   </div>
                 </div>
               </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className={`w-full ${view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-8"}`}>
          {displayedProducts.length === 0 ? (
            <div className="w-full text-center py-24 text-brand-text/50 col-span-full">
              No products available matching your criteria.
            </div>
          ) : (
            displayedProducts.map((product, idx) => (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`}
                className={cn(
                  "group flex bg-white rounded-2xl transition-all duration-300 hover:shadow-lg border border-brand-border/20 shadow-sm",
                  view === "grid" ? "flex-col p-3" : "flex-row gap-6 p-4 items-center"
                )}
              >
                <div className={cn(`relative bg-[#f5f5f7] overflow-hidden rounded-2xl ${view === "grid" ? "aspect-square w-full mb-3" : "aspect-square w-48 flex-shrink-0"}`)}>
                  {product.siblingCount > 1 && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-brand-text shadow-sm z-10 pointer-events-none">
                      {product.siblingCount} {product.siblingLabel || "Sizes"} Available
                    </div>
                  )}
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={idx < 4}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className={cn(
                  "flex flex-col",
                  view === "grid" ? "p-5" : "flex-1"
                )}>
                  <p className="text-brand-text/50 text-xs uppercase tracking-widest font-semibold mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-heading text-xl md:text-2xl text-brand-text group-hover:text-brand-gold transition-colors mb-2">
                    {product.name}
                  </h3>
                  <p className="font-sans font-medium text-brand-text">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
