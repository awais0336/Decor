"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import CategoryForm from "./CategoryForm";
import { deleteCategory } from "@/lib/actions/categories";
import Image from "next/image";

export default function CategoriesManager({ initialCategories }: { initialCategories: any[] }) {
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>{editingCategory ? "Edit Category" : "Add Category"}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 
              We use key={editingCategory?.id || 'new'} so the form completely remounts 
              when switching between edit and create modes, resetting the form state.
            */}
            <CategoryForm 
              key={editingCategory?.id || 'new'}
              categories={initialCategories} 
              editCategory={editingCategory}
              onCancelEdit={handleCancelEdit}
            />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {initialCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <FolderTree className="h-12 w-12 mb-4 opacity-20" />
                <p>No categories found.</p>
                <p className="text-sm">Create your first category using the form.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium w-16">Image</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Slug</th>
                      <th className="px-4 py-3 font-medium">Parent ID</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialCategories.map((cat: any) => (
                      <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3">
                          {cat.image_url ? (
                            <div className="w-10 h-10 relative rounded-sm overflow-hidden border">
                              <Image 
                                src={cat.image_url} 
                                alt={cat.name} 
                                fill 
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-sm bg-muted flex items-center justify-center border">
                              <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium">{cat.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs font-mono">
                          {cat.parent_id ? "Nested Subcategory" : "Top Level"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(cat)}
                              className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                              title="Edit Category"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <form action={async () => {
                              if (confirm("Are you sure you want to delete this category?")) {
                                await deleteCategory(cat.id);
                                if (editingCategory?.id === cat.id) {
                                  setEditingCategory(null);
                                }
                              }
                            }}>
                              <button type="submit" className="text-red-500 hover:text-red-700 transition-colors p-1" title="Delete Category">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
