import { getTopLevelCategories } from "@/lib/actions/storefront";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata = {
  title: "Categories | Decor",
  description: "Browse all our top-level categories.",
};

export default async function CategoriesPage() {
  const categories = await getTopLevelCategories();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar />
      
      <main className="flex-grow pt-40 md:pt-48 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs 
            items={[
              { label: "Categories", href: "/category" }
            ]} 
          />
          
          <h1 className="text-3xl font-light text-stone-900 mb-8">All Categories</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.slug}`}
                className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] relative bg-stone-100">
                  <Image 
                    src={category.image_url || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=600"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-stone-900 group-hover:text-black transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No categories found.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
