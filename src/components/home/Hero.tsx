"use client";
 

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (imageRef.current && containerRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen min-h-[800px] w-full overflow-hidden bg-brand-text flex items-center justify-center"
    >
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          ref={imageRef}
          src="/images/hero.png"
          alt="Luxury Living Room"
          fill
          priority
          className="object-cover opacity-90 origin-center"
          sizes="100vw"
        />
        
        {/* Text contrast gradient - subtle dark wash behind the center text */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-transparent" />
        
        {/* Navbar protection gradient - ensures white icons are visible */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/70 to-transparent" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center mt-20">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-brand-secondary/90 tracking-[0.2em] text-xs md:text-sm font-medium uppercase mb-6 block"
        >
          Curating the Art of Living
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-heading text-5xl md:text-7xl lg:text-[100px] leading-[1.1] tracking-tight text-white mb-10"
        >
          Discover Exclusive <br className="hidden md:block" /> Home Decor
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center mt-6"
        >
          <Link 
            href="/collections"
            className="group relative flex items-center justify-center gap-3 bg-white text-brand-text px-8 py-4 rounded-full font-button font-medium overflow-hidden transition-transform hover:scale-105"
          >
            <span className="relative z-10">Explore Collection</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
