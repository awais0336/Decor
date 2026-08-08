"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, X, MessageCircle, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/CartContext";
import { useRouter, usePathname } from "next/navigation";
import { searchStorefrontProducts } from "@/lib/actions/storefront";
import { SidebarDrawer } from "./SidebarDrawer";


export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { cartCount, setIsCartOpen, wishlistItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  
  const isHomePage = pathname === "/";
  const iconColor = isHomePage && !scrolled ? "text-white" : "text-brand-text";
  const glowColor = isHomePage && !scrolled ? "bg-white/10" : "bg-brand-text/5";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        const results = await searchStorefrontProducts(searchQuery.trim());
        setSearchResults(results.slice(0, 5)); // Just take top 5 for dropdown
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  return (
    <>
      <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-brand-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      {/* Top Announcement Bar - Static */}
      <div className="w-full bg-brand-text text-brand-primary flex items-center justify-center py-2 md:py-2.5">
        <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
          Premium Quality Guarantee
        </span>
      </div>

      {/* Contact Bar - Scrolling Left to Right */}
      <div className="w-full bg-brand-gold text-white overflow-hidden flex items-center py-1.5 md:py-2">
        <div 
          className="animate-[scroll-reverse_30s_linear_infinite] whitespace-nowrap flex text-[10px] md:text-xs font-semibold tracking-widest uppercase"
          style={{ willChange: 'transform' }}
        >
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center px-6 flex-shrink-0 gap-6">
              <span>WhatsApp: +92 3289111139</span>
              <span className="w-1 h-1 rounded-full bg-white/50" />
              <span>Email: Decornish.pk@gmail.com</span>
              <span className="w-1 h-1 rounded-full bg-white/50" />
            </div>
          ))}
        </div>
      </div>

      <div className={cn(
        "max-w-[1600px] mx-auto flex items-center justify-between px-2 sm:px-4 md:px-12",
        scrolled ? "py-3" : "py-4 md:py-6"
      )}>
        {/* Left Space - Hamburger Menu */}
        <div className="flex-1 flex items-center">
          <button 
            className="group relative flex items-center justify-center transition-transform hover:scale-110 p-2 -ml-2"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Menu"
          >
            <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={cn("absolute inset-0 rounded-full blur-md opacity-100 transition-colors", glowColor)} />
            <Menu className={cn("w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-colors", iconColor)} strokeWidth={1.5} />
          </button>
        </div>

        {/* Logo - Center */}
        <div className={cn(
          "transition-transform duration-500 shrink-0 mx-2",
          scrolled ? "scale-90" : "scale-100"
        )}>
          <Link href="/">
            <h1 className={cn("font-heading text-xl sm:text-2xl md:text-4xl tracking-tight uppercase transition-colors", iconColor)}>
              Decornish
            </h1>
          </Link>
        </div>

        {/* Icons - Right */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4 md:gap-6">
          <a 
            href="https://wa.me/923289111139" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center justify-center transition-transform hover:scale-110"
            aria-label="WhatsApp Message"
          >
            <div className="absolute inset-0 bg-[#25D366]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className={cn("w-4 h-4 sm:w-[22px] sm:h-[22px] group-hover:text-[#25D366] transition-colors relative z-10", iconColor)}
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <button 
            className="group relative flex items-center justify-center transition-transform hover:scale-110 hover:text-brand-gold" 
            aria-label="Search"
            onClick={() => setIsSearchOpen(true)}
          >
            <div className={cn("absolute inset-0 rounded-full blur-md opacity-100 transition-colors", glowColor)} />
            <Search className={cn("w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-colors", iconColor)} strokeWidth={1.5} />
          </button>
          <Link href="/wishlist" className="group relative flex items-center justify-center transition-transform hover:scale-110 hover:text-brand-gold" aria-label="Wishlist">
            <div className={cn("absolute inset-0 rounded-full blur-md opacity-100 transition-colors", glowColor)} />
            <Heart className={cn("w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-colors", iconColor)} strokeWidth={1.5} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-white text-[9px] sm:text-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-medium z-20">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <button 
            className="group relative flex items-center justify-center transition-transform hover:scale-110 hover:text-brand-gold" 
            aria-label="Cart"
            onClick={() => setIsCartOpen(true)}
          >
            <div className={cn("absolute inset-0 rounded-full blur-md opacity-100 transition-colors", glowColor)} />
            <ShoppingBag className={cn("w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-colors", iconColor)} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className={cn("absolute -top-1.5 -right-1.5 text-[9px] sm:text-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-medium z-20 transition-colors", isHomePage && !scrolled ? "bg-white text-brand-primary" : "bg-brand-text text-brand-primary")}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
        {/* Search Dropdown - Now inside header for correct relative positioning */}
        {isSearchOpen && (
          <>
            {/* Invisible backdrop to close search when clicking outside */}
            <div 
              className="fixed inset-0 z-[-1]" 
              onClick={() => setIsSearchOpen(false)}
            />
            <div className="absolute top-full right-0 md:right-12 w-full md:w-[400px] lg:w-[500px] bg-background border-b md:border border-brand-border md:rounded-b-lg shadow-xl overflow-visible z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-brand-secondary/50 border border-brand-border rounded-md text-base py-3 pl-4 pr-12 outline-none focus:border-brand-gold transition-colors placeholder:text-brand-text/40 text-brand-text"
                  />
                  <button 
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-brand-text/50 hover:text-brand-gold transition-colors"
                  >
                    <Search className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </form>
              </div>
              
              {searchQuery.trim().length >= 2 ? (
                <div className="border-t border-brand-border bg-background">
                  {isSearching ? (
                    <div className="p-6 text-center text-brand-text/50 animate-pulse text-sm">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <ul className="divide-y divide-brand-border/50 max-h-[60vh] overflow-y-auto">
                      {searchResults.map((product) => (
                        <li key={product.id}>
                          <Link 
                            href={`/product/${product.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 p-3 hover:bg-brand-secondary transition-colors"
                          >
                            <div className="relative w-12 h-16 bg-brand-secondary overflow-hidden shrink-0 rounded border border-brand-border/50">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col items-start text-left">
                              <h4 className="font-heading text-lg text-brand-text line-clamp-1">{product.name}</h4>
                              <p className="font-sans text-xs font-semibold text-brand-gold">{product.price}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button 
                          onClick={handleSearchSubmit}
                          className="w-full p-3 text-center text-xs font-semibold text-brand-text hover:text-brand-gold bg-brand-secondary/50 hover:bg-brand-secondary transition-colors uppercase tracking-widest"
                        >
                          View all results
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <div className="p-6 text-center text-brand-text/50 text-sm">No products found for "{searchQuery}"</div>
                  )}
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
      </header>

      <SidebarDrawer 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </>
  );
}
