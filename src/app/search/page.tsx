import { searchStorefrontProducts, getStorefrontProducts } from "@/lib/actions/storefront";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategorySlider } from "@/components/home/BestSellers";
import { Search } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  
  // Use BM25 optimized full-text search directly via database
  const searchResults = query 
    ? await searchStorefrontProducts(query) 
    : await getStorefrontProducts();

  return (
    <main className="flex min-h-screen flex-col bg-brand-primary">
      <Navbar />
      <div className="flex-1 pt-40 md:pt-48 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
        <h1 className="font-heading text-4xl text-brand-text mb-4">
          Search Results
        </h1>
        {query ? (
          <p className="text-brand-text/70 mb-12">
            Showing results for <span className="font-semibold text-brand-gold">"{query}"</span>
          </p>
        ) : (
          <p className="text-brand-text/70 mb-12">
            Enter a search term to find products.
          </p>
        )}

        {searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="w-16 h-16 text-brand-text/20 mb-4" />
            <h2 className="text-2xl text-brand-text font-heading mb-2">No results found</h2>
            <p className="text-brand-text/50 max-w-md">
              We couldn't find anything matching your search. Try adjusting your keywords or browse our categories.
            </p>
          </div>
        ) : (
          <CategorySlider 
            title="Results" 
            description={`${searchResults.length} product${searchResults.length === 1 ? '' : 's'} found`} 
            products={searchResults} 
          />
        )}
      </div>
      <Footer />
    </main>
  );
}
