import { getCategories } from "@/lib/actions/categories";
import CategoriesManager from "./CategoriesManager";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <p className="text-muted-foreground">
          Manage your product categories and subcategories.
        </p>
      </div>

      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
