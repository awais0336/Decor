"use client";

import { useState, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createProduct } from "@/lib/actions/products";

export default function ProductForm({ categories, designGroups = [] }: { categories: any[], designGroups?: string[] }) {
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
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/") || file.size < 1024 * 1024) {
        return resolve(file); // Don't compress non-images or files < 1MB
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              resolve(file);
            }
          }, "image/jpeg", 0.8);
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  return (
    <form action={async (formData) => {
      try {
        const newFormData = new FormData();
        for (const [key, value] of Array.from(formData.entries())) {
          if (value instanceof File && value.size > 0) {
            const compressedFile = await compressImage(value);
            newFormData.append(key, compressedFile);
          } else {
            newFormData.append(key, value);
          }
        }

        const res = await createProduct(newFormData);
        if (res && res.error) {
          alert("Error: " + res.error);
        } else if (res && !res.success) {
          alert("An unexpected error occurred. Please check your input and try again.");
        } else {
          alert("Product added successfully!");
        }
      } catch (error: any) {
        console.error("Action error:", error);
        if (error?.message?.includes("An unexpected response was received from the server")) {
          alert("A server error occurred, likely due to a Vercel timeout or size limit. Try using a smaller image or checking your connection.");
        } else {
          alert("A critical error occurred while submitting: " + (error?.message || "Unknown error"));
        }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="design_group" className="text-sm font-medium">Design Group (Optional)</label>
          <input 
            type="text" 
            id="design_group" 
            name="design_group" 
            list="design_groups_list"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. 99-names-of-allah"
          />
          <datalist id="design_groups_list">
            {designGroups.map((group) => (
              <option key={group} value={group} />
            ))}
          </datalist>
          <p className="text-[10px] text-muted-foreground">Used to group different sizes of the same design together.</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="size_label" className="text-sm font-medium">Size/Variant Label (Optional)</label>
          <input 
            type="text" 
            id="size_label" 
            name="size_label" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. 2 x 3 ft, Gold, Medium"
          />
          <p className="text-[10px] text-muted-foreground">The display label for this specific size.</p>
        </div>
        <div className="space-y-2 col-span-1 md:col-span-2">
          <label htmlFor="sibling_label" className="text-sm font-medium">Group Label Type (Optional)</label>
          <select 
            id="sibling_label" 
            name="sibling_label"
            defaultValue="Sizes"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Sizes">Sizes</option>
            <option value="Designs">Designs</option>
            <option value="Colors">Colors</option>
            <option value="Styles">Styles</option>
            <option value="Variants">Variants</option>
          </select>
          <p className="text-[10px] text-muted-foreground">What word to use in the catalog badge (e.g. "9 Sizes Available" vs "9 Designs Available")</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="space-y-2 flex flex-col justify-center">
          <label className="text-sm font-medium opacity-0 hidden md:block">Featured</label>
          <label className="flex items-center gap-2 cursor-pointer border rounded-md p-2 h-10 hover:bg-muted/50 transition-colors">
            <input 
              type="checkbox" 
              name="is_featured" 
              className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
            />
            <span className="text-sm font-medium">Featured Product</span>
          </label>
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
