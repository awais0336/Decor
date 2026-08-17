"use client";
 

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";



export function NewArrivals({ products = [] }: { products?: any[] }) {
  const displayItems = products || [];

  if (displayItems.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-brand-primary px-6 md:px-12 text-center text-brand-text/50">
        No new arrivals found.
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 bg-brand-primary px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-brand-gold uppercase tracking-[0.2em] text-xs font-semibold mb-4 block">
              Latest Editions
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-brand-text leading-tight">
              New Arrivals
            </h2>
          </div>
          <Link 
            href="/new-arrivals"
            className="group flex items-center gap-3 font-button text-brand-text font-medium border-b border-brand-border hover:border-brand-text pb-2 transition-colors whitespace-nowrap"
          >
            Discover All New Items
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Magazine Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[300px] md:auto-rows-[400px]">
          {/* Large Card (Left) */}
          <Link 
            href={`/product/${displayItems[0].id}`}
            className="group relative md:col-span-6 md:row-span-2 overflow-hidden bg-white"
          >
            <Image
              src={displayItems[0].image}
              alt={displayItems[0].name}
              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={0 < 2}
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 p-8 text-white translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
              <p className="text-sm uppercase tracking-widest font-semibold mb-2">{displayItems[0].category}</p>
              <h3 className="font-heading text-3xl mb-2">{displayItems[0].name}</h3>
              <p className="font-sans text-lg">{displayItems[0].price}</p>
            </div>
          </Link>

          {/* Top Right Small Cards */}
          <Link 
            href={`/product/${displayItems[1].id}`}
            className="group relative md:col-span-3 overflow-hidden bg-brand-secondary"
          >
            <Image
              src={displayItems[1].image}
              alt={displayItems[1].name}
              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105 mix-blend-multiply opacity-90"
            />
            <div className="absolute bottom-0 left-0 p-6 bg-white/90 backdrop-blur-md w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-heading text-xl text-brand-text mb-1">{displayItems[1].name}</h3>
              <p className="font-sans text-brand-text/70">{displayItems[1].price}</p>
            </div>
          </Link>

          <Link 
            href={`/product/${displayItems[2].id}`}
            className="group relative md:col-span-3 overflow-hidden bg-brand-secondary"
          >
            <Image
              src={displayItems[2].image}
              alt={displayItems[2].name}
              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105 mix-blend-multiply opacity-90"
            />
            <div className="absolute bottom-0 left-0 p-6 bg-white/90 backdrop-blur-md w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-heading text-xl text-brand-text mb-1">{displayItems[2].name}</h3>
              <p className="font-sans text-brand-text/70">{displayItems[2].price}</p>
            </div>
          </Link>

          {/* Bottom Wide Card */}
          <Link 
            href={`/product/${displayItems[3].id}`}
            className="group relative md:col-span-6 overflow-hidden bg-brand-secondary flex items-center"
          >
            <div className="absolute inset-0 w-1/2">
               <Image
                  src={displayItems[3].image}
                  alt={displayItems[3].name}
                  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
            </div>
            <div className="w-1/2 ml-auto p-8 md:p-12 flex flex-col justify-center h-full bg-brand-secondary z-10 relative">
              <p className="text-brand-text/50 text-xs uppercase tracking-widest font-semibold mb-4">
                {displayItems[3].category}
              </p>
              <h3 className="font-heading text-2xl md:text-3xl text-brand-text mb-4 group-hover:text-brand-gold transition-colors">
                {displayItems[3].name}
              </h3>
              <p className="font-sans text-brand-text/70 mb-6">{displayItems[3].price}</p>
              <span className="font-button text-sm font-semibold border-b border-brand-text pb-1 self-start group-hover:border-brand-gold transition-colors">
                Shop Now
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
