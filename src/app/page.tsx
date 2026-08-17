import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategorySlider } from "@/components/home/BestSellers";
import { Footer } from "@/components/layout/Footer";
import { getStorefrontProducts, getAllCategories } from "@/lib/actions/storefront";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [products, allCategories] = await Promise.all([
    getStorefrontProducts(),
    getAllCategories()
  ]);

  const featuredProducts = products.filter((p: any) => p.is_featured);

  // Cache to map a category name to its top-level parent's name
  const topLevelNameMap: Record<string, string> = {};
  
  const getTopLevelName = (categoryName: string) => {
    if (topLevelNameMap[categoryName]) return topLevelNameMap[categoryName];
    
    let current = allCategories.find(c => c.name === categoryName);
    if (!current) return categoryName; // Fallback if category name isn't in the DB
    
    // Traverse up to the root parent
    while (current?.parent_id) {
      const parent = allCategories.find(c => c.id === current?.parent_id);
      if (!parent) break;
      current = parent;
    }
    
    topLevelNameMap[categoryName] = current.name;
    return current.name;
  };

  // Group products by their top-level category
  const categoriesMap = products.reduce((acc: any, product: any) => {
    const topLevelName = getTopLevelName(product.category);
    if (!acc[topLevelName]) {
      acc[topLevelName] = [];
    }
    acc[topLevelName].push(product);
    return acc;
  }, {});

  // Display all resolved top-level categories that have products
  const categoriesToDisplay = Object.keys(categoriesMap);

  return (
    <main className="flex min-h-screen flex-col bg-brand-primary">
      <Navbar />
      <Hero />
      <FeaturedProducts products={featuredProducts} />
      
      {categoriesToDisplay.length === 0 ? (
        <div className="py-32 text-center text-brand-text/50">
          <p className="text-xl">No products available yet.</p>
        </div>
      ) : (
        categoriesToDisplay.map((category) => (
          <CategorySlider 
            key={category} 
            title={category} 
            description={`Explore our exclusive collection of ${category.toLowerCase()}.`}
            products={categoriesMap[category]} 
          />
        ))
      )}

      <Footer />
    </main>
  );
}
