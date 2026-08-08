"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ 
  images, 
  productName, 
  mainImage, 
  setMainImage 
}: { 
  images: string[], 
  productName: string,
  mainImage: string,
  setMainImage: (img: string) => void
}) {
  return (
    <div className="sticky top-40 md:top-48 flex flex-col gap-6">
      <div className="relative aspect-[4/5] bg-brand-secondary overflow-hidden shadow-sm border border-brand-border/20 rounded-2xl">
        <Image
          src={mainImage}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300"
        />
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-brand-gold scrollbar-track-transparent">
          {images.map((imgUrl, i) => (
            <button
              key={i}
              onClick={() => setMainImage(imgUrl)}
              className={`relative flex-shrink-0 aspect-square w-24 bg-brand-secondary overflow-hidden cursor-pointer transition-all shadow-sm border border-brand-border/20 rounded-xl ${
                mainImage === imgUrl ? "ring-2 ring-brand-gold ring-offset-2 ring-offset-brand-primary" : "opacity-70 hover:opacity-100 hover:shadow-md"
              }`}
            >
              <Image
                src={imgUrl}
                alt={`${productName} Thumbnail ${i + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
