"use client";

import { useState, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createProduct } from "@/lib/actions/products";

export default function ProductForm({ categories }: { categories: any[] }) {
  const [variants, setVariants] = useState([{ name: "", sku: "", price: "0", quantity: "0", hasImage: false }]);

  const addVariant = () => {
    setVariants([...variants, { name: "", sku: "", price: "0", quantity: "0", hasImage: false }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string | boolean) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };
  return (
    <form action={async (formData) => {
      try {
        const res = await createProduct(formData);
        if (res && res.error) {
          alert("Error: " + res.error);
        } else if (res && !res.success) {
          alert("An unexpected error occurred. Please check your input and try again.");
        }
      } catch (error: any) {
        console.error("Action error:", error);
        alert("A critical error occurred while submitting: " + (error?.message || "Unknown error"));
      }
    }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Product Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. Modern Velvet Sofa"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="category_id" className="text-sm font-medium">Category</label>
          <select 
            id="category_id" 
            name="category_id" 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>



      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea 
          id="description" 
          name="description" 
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Detailed product description..."
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="base_price" className="text-sm font-medium">Base Price (Optional, Rs.)</label>
          <input 
            type="number" 
            step="0.01"
            id="base_price" 
            name="base_price" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">Status</label>
          <select 
            id="status" 
            name="status" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t mt-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-muted/30 p-4 rounded-lg border border-dashed">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Product Variants</h3>
            <p className="text-sm text-muted-foreground mt-1">Add variations like Color, Size, or Material</p>
          </div>
          <button 
            type="button" 
            onClick={addVariant}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 shadow-sm whitespace-nowrap shrink-0 w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4 shrink-0" />
            Add Variant
          </button>
        </div>
        
        {variants.length === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground border rounded-lg border-dashed bg-muted/10">
            No variants added. The base product details will be used.
          </div>
        )}

        <div className="space-y-4">
          {variants.map((v, index) => (
            <div key={index} className="p-5 border rounded-lg bg-card relative shadow-sm group hover:border-primary/50 transition-colors">
              <button 
                type="button" 
                onClick={() => removeVariant(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-500/10 h-8 w-8 inline-flex items-center justify-center rounded-md transition-colors opacity-80 group-hover:opacity-100"
                title="Remove Variant"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <h4 className="text-sm font-semibold mb-5 pr-10 border-b pb-2">Variant #{index + 1}</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
                  <input 
                    type="text" 
                    name="variant_name[]" 
                    value={v.name}
                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                    placeholder="e.g. Red, XL"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SKU</label>
                  <input 
                    type="text" 
                    name="variant_sku[]" 
                    value={v.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    placeholder="e.g. SOFA-RED-XL"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Variant Price (Rs.)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="variant_price[]" 
                      value={v.price}
                      onChange={(e) => updateVariant(index, 'price', e.target.value)}
                      placeholder="0.00"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock Qty</label>
                    <input 
                      type="number" 
                      name="variant_quantity[]" 
                      value={v.quantity}
                      onChange={(e) => updateVariant(index, 'quantity', e.target.value)}
                      placeholder="0"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Image (Optional)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      id={`variant_image_${index}`}
                      name="variant_image[]" 
                      accept="image/*"
                      onChange={(e) => updateVariant(index, 'hasImage', !!e.target.files?.length)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    {v.hasImage && (
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(`variant_image_${index}`) as HTMLInputElement;
                          if (input) {
                            input.value = "";
                            updateVariant(index, 'hasImage', false);
                          }
                        }}
                        className="p-2 h-10 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors border border-input flex items-center justify-center shrink-0"
                        title="Remove image"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-6"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Product
      </button>
    </form>
  );
}
