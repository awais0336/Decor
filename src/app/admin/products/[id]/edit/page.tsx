import { getProductById, getDesignGroups } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);
  const categories = await getCategories();
  const designGroups = await getDesignGroups();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-muted rounded-md transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
          <p className="text-muted-foreground">
            Update details for {product.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProductForm product={product} categories={categories} designGroups={designGroups} />
        </CardContent>
      </Card>
    </div>
  );
}
