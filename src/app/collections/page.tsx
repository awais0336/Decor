import CollectionsClient from "./client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Collections | Decornish",
  description: "Browse our curated collections of luxury home decor.",
};

export default function CollectionsPage({ categorySlug }: { categorySlug?: string }) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-brand-primary" />}>
        <CollectionsClient categorySlug={categorySlug} />
      </Suspense>
      <Footer />
    </>
  );
}
