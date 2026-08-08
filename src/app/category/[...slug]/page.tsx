import { getCategoryBySlug, getCategoryChildren, getCategoriesBySlugs } from "@/lib/actions/storefront";
import CollectionsPage from "@/app/collections/page";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { notFound } from "next/navigation";

export default async function CategoryCatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugs = resolvedParams.slug;
  const leafSlug = slugs[slugs.length - 1];

  const category = await getCategoryBySlug(leafSlug);

  if (!category) {
    notFound();
  }

  // Fetch all categories in the path for breadcrumbs
  const breadcrumbCategories = await getCategoriesBySlugs(slugs);
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Categories", href: "/category" }
  ];

  let currentPath = "/category";
  slugs.forEach(slug => {
    currentPath += `/${slug}`;
    const cat = breadcrumbCategories.find(c => c.slug === slug);
    breadcrumbItems.push({
      label: cat ? cat.name : slug,
      href: currentPath
    });
  });

  const children = await getCategoryChildren(category.id);

  // If there are children, render the Subcategories view
  if (children && children.length > 0) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />
            
            <h1 className="text-3xl font-light text-stone-900 mb-8">{category.name} Categories</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {children.map((child) => (
                <Link 
                  key={child.id} 
                  href={`${currentPath}/${child.slug}`}
                  className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] relative bg-stone-100">
                    <Image 
                      src={child.image_url || category.image_url || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=600"}
                      alt={child.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium text-stone-900 group-hover:text-black transition-colors">
                      {child.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
  
        <Footer />
      </div>
    );
  }

  // If NO children, fall back to the CollectionsPage component
  // CollectionsPage (from Prompt A) takes categorySlug and renders the Navbar/Footer itself.
  // Wait, does CollectionsPage render Navbar and Footer? 
  // Yes, CollectionsPage from Prompt A renders the whole page layout including Navbar and Footer.
  // But wait, what about the Breadcrumbs? We should probably inject breadcrumbs into CollectionsPage,
  // OR since CollectionsPage might not accept breadcrumbs, we can just wrap the CollectionsClient instead!
  
  // Actually, if we just render CollectionsPage, it will be wrapped in its own layout. 
  // Let's modify CollectionsPage to optionally accept breadcrumbItems, or just use CollectionsPage.
  // Wait, if we use CollectionsClient, we can build the layout here, which is cleaner!
  // Let's import CollectionsClient instead of CollectionsPage to inject Breadcrumbs.
  
  // Wait, CollectionsPage is a server component that renders CollectionsClient inside a Suspense.
  // Let's just return CollectionsPage. We will add breadcrumbs inside CollectionsPage or Client.
  
  // To keep it simple and fulfill "Clicking any leaf subcategory shows its products",
  // we can just return <CollectionsPage categorySlug={leafSlug} breadcrumbs={breadcrumbItems} />
  
  return <CollectionsPage categorySlug={leafSlug} breadcrumbs={breadcrumbItems} />;
}
