import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getStorefrontProduct } from "@/lib/actions/storefront";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductViewer } from "@/components/product/ProductViewer";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getStorefrontProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const siblings = product.design_group 
    ? await import("@/lib/actions/storefront").then(m => m.getProductSiblings(product.design_group, product.id))
    : [];
    
  const productWithSiblings = {
    ...product,
    siblings
  };

  return (
    <main className="flex min-h-screen flex-col bg-brand-primary">
      <Navbar />
      
      <div className="pt-40 md:pt-48 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto w-full flex-1">
        <Link href="/" className="relative z-10 inline-flex items-center gap-2 text-brand-text/70 hover:text-brand-gold transition-colors mb-8 font-sans text-sm uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <ProductViewer product={productWithSiblings} />
        
        <ProductReviews productId={product.id} productName={product.name} />
      </div>
      
      <Footer />
    </main>
  );
}
