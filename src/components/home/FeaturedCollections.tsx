"use client";
 

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

const COLLECTIONS = [
  {
    title: "Living Room",
    description: "Sofas, coffee tables, and elegant seating.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200",
    href: "/collections/living-room",
    size: "large",
  },
  {
    title: "Bedroom",
    description: "Beds, nightstands, and premium linens.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800",
    href: "/collections/bedroom",
    size: "medium",
  },
  {
    title: "Lighting",
    description: "Chandeliers, floor lamps, and pendants.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
    href: "/collections/lighting",
    size: "medium",
  },
  {
    title: "Wall Art",
    description: "Paintings, prints, and decorative mirrors.",
    image: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&q=80&w=1200",
    href: "/collections/wall-art",
    size: "large",
  },
];

export function FeaturedCollections() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Parallax images
    const images = document.querySelectorAll(".collection-image");
    
    images.forEach((img) => {
      gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-brand-primary px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="text-brand-gold uppercase tracking-[0.2em] text-xs font-semibold mb-4 block">
              Curated Selection
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-brand-text leading-tight">
              Spaces Designed for <br /> Inspired Living.
            </h2>
          </div>
          <Link 
            href="/collections"
            className="group flex items-center gap-3 font-button text-brand-text font-medium border-b border-brand-border hover:border-brand-text pb-2 transition-colors whitespace-nowrap"
          >
            View All Collections
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {COLLECTIONS.map((collection, index) => (
            <Link
              key={collection.title}
              href={collection.href}
              className={`group relative overflow-hidden flex flex-col ${
                collection.size === "large" ? "md:col-span-2 lg:col-span-1 aspect-[4/5] lg:aspect-[3/4]" : "aspect-[4/5]"
              } ${index === 0 ? "lg:mt-0" : index === 1 ? "lg:mt-32" : index === 2 ? "lg:-mt-32" : ""}`}
            >
              <div className="absolute inset-0 overflow-hidden bg-brand-secondary">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 2}
                  className="collection-image object-cover scale-[1.15] transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
              </div>
              
              <div className="relative mt-auto p-8 md:p-12 z-10 flex flex-col items-start text-white">
                <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl mb-3 tracking-tight">
                  {collection.title}
                </h3>
                <p className="font-sans text-white/80 max-w-sm mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {collection.description}
                </p>
                <div className="flex items-center gap-2 text-sm uppercase tracking-widest font-semibold border-b border-white/30 pb-1 group-hover:border-white transition-colors">
                  Explore
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
