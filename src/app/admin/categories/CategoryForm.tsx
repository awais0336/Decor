"use client";

import { useState } from "react";
import { Plus, Loader2, Save, X } from "lucide-react";
import { createCategory, updateCategory } from "@/lib/actions/categories";

export default function CategoryForm({ 
  categories, 
  editCategory, 
  onCancelEdit 
}: { 
  categories: any[], 
  editCategory?: any,
  onCancelEdit?: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    let result;
    if (editCategory) {
      result = await updateCategory(editCategory.id, formData);
    } else {
      result = await createCategory(formData);
    }

    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error);
    } else {
      // Success, reset form if creating
      if (!editCategory) {
        (e.target as HTMLFormElement).reset();
      } else if (onCancelEdit) {
        onCancelEdit();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Category Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required 
          defaultValue={editCategory?.name || ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="e.g. Floor Lamps"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="parent_id" className="text-sm font-medium">Parent Category (Optional)</label>
        <select 
          id="parent_id" 
          name="parent_id" 
          defaultValue={editCategory?.parent_id || ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">None (Top Level)</option>
          {categories
            .filter((c) => c.id !== editCategory?.id) // Prevent setting itself as parent
            .map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">
          Category Image {editCategory && "(Leave empty to keep current)"}
        </label>
        <input 
          type="file" 
          id="image" 
          name="image" 
          accept="image/*"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            editCategory ? (
              <><Save className="mr-2 h-4 w-4" /> Save Changes</>
            ) : (
              <><Plus className="mr-2 h-4 w-4" /> Create Category</>
            )
          )}
        </button>
        
        {editCategory && (
          <button 
            type="button" 
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <X className="mr-2 h-4 w-4" /> Cancel
          </button>
        )}
      </div>
    </form>
  );
}
