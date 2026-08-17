import CollectionsClient from "./client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";
import { Suspense } from "react";
import { BreadcrumbItem } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Collections | Decornish",
  description: "Browse our curated collections of luxury home decor.",
};

interface CollectionsPageProps {
  categorySlug?: string;
  breadcrumbs?: BreadcrumbItem[];
}

import { getStorefrontProducts } from "@/lib/actions/storefront";

export default async function CollectionsPage({ categorySlug, breadcrumbs }: CollectionsPageProps) {
  const initialProducts = await getStorefrontProducts(categorySlug);
  
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-brand-primary" />}>
        <CollectionsClient categorySlug={categorySlug} breadcrumbs={breadcrumbs} initialProducts={initialProducts} />
      </Suspense>
      <Footer />
    </>
  );
}
