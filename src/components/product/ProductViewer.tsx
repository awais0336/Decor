"use client";

import { useState } from "react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartActions } from "@/components/product/AddToCartActions";
import { Check, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function ProductViewer({ product }: { product: any }) {
  const [mainImage, setMainImage] = useState(
    product.images[0] || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=1200"
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // Sync image click to variant selection
  const handleImageSelect = (imgUrl: string) => {
    setMainImage(imgUrl);
    const matchedVariant = product.variants?.find((v: any) => v.image_url === imgUrl);
    if (matchedVariant) {
      setSelectedVariantId(matchedVariant.id);
    }
  };

  const selectedVariant = selectedVariantId 
    ? product.variants?.find((v: any) => v.id === selectedVariantId)
    : product.variants?.find((v: any) => v.image_url === mainImage);

  // Update the display name and price if a variant is selected
  const displayName = selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name;
  
  // Update the price to display the exact variant price, or fallback to base price
  const displayPrice = selectedVariant && Number(selectedVariant.price_adjustment) !== 0
    ? `Rs. ${Number(selectedVariant.price_adjustment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : (Number(product.rawPrice) > 0 
        ? `Rs. ${Number(product.rawPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        : (product.variants?.length > 0 
            ? `From Rs. ${Math.min(...product.variants.map((v: any) => Number(v.price_adjustment))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
            : "Price Varies")
      );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
      {/* Gallery Sticky */}
      <div className="relative">
        <ProductGallery 
          images={product.images} 
          productName={product.name} 
          mainImage={mainImage}
          setMainImage={handleImageSelect}
        />
      </div>

      {/* Details */}
      <div className="flex flex-col pt-8">
        <span className="text-brand-text/50 uppercase tracking-widest font-semibold text-xs mb-4">{product.category}</span>
        <h1 className="font-heading text-4xl md:text-5xl text-brand-text mb-4 transition-all">{displayName}</h1>
        <p className="font-sans text-xl text-brand-text mb-8 transition-all">{displayPrice}</p>
        
        <p className="font-sans text-brand-text/70 leading-relaxed mb-8">
          {product.description || "No description available for this product."}
        </p>
        
        {product.variants && product.variants.length > 0 && (
          <div className="mb-8">
            <span className="block text-sm font-semibold uppercase tracking-widest text-brand-text mb-4">Select Variant</span>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant: any) => {
                const isSelected = (selectedVariant?.id === variant.id) || (!selectedVariantId && variant.image_url === mainImage);
                return (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariantId(variant.id);
                      if (variant.image_url) setMainImage(variant.image_url);
                    }}
                    className={`flex flex-col items-center justify-between gap-2 p-2 border transition-colors min-w-[70px] ${
                      isSelected 
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-text' 
                        : 'border-brand-border text-brand-text/70 hover:border-brand-text hover:text-brand-text'
                    }`}
                  >
                    <span className="text-xs font-medium w-full text-center px-1">
                      {variant.name}
                    </span>
                    {variant.image_url && (
                      <div className="w-14 h-14 relative bg-brand-secondary overflow-hidden shrink-0 border border-brand-border/30">
                        <img 
                          src={variant.image_url} 
                          alt={variant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <AddToCartActions product={product} selectedVariant={selectedVariant} />
        
        <div className={`flex items-center gap-2 font-sans text-sm font-medium mb-8 ${product.inStock ? "text-brand-success" : "text-red-500"}`}>
          {product.inStock ? (
            <><Check className="w-4 h-4" /> In Stock. Ready to ship.</>
          ) : (
            <>Out of Stock</>
          )}
        </div>
        
        {product.siblings && product.siblings.length > 0 && (
          <div className="mb-12 pt-8 border-t border-brand-border/20">
            <span className="block text-sm font-semibold uppercase tracking-widest text-brand-text mb-4">Also available in:</span>
            <div className="flex flex-wrap gap-4">
              {product.siblings.map((sibling: any) => (
                <Link
                  href={`/product/${sibling.id}`}
                  key={sibling.id}
                  className="flex flex-col gap-2 p-3 border border-brand-border/40 hover:border-brand-gold bg-brand-secondary/30 text-brand-text/80 hover:text-brand-text transition-all min-w-[100px] rounded-lg group"
                >
                  {sibling.image && (
                    <div className="w-full aspect-square relative bg-brand-secondary overflow-hidden shrink-0 rounded-md">
                      <Image 
                        src={sibling.image} 
                        alt={sibling.name}
                        fill sizes="100px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold w-full">
                      {sibling.size_label || sibling.name}
                    </span>
                    <span className="text-xs font-medium mt-1">
                      Rs. {sibling.price.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
