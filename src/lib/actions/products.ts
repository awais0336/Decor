"use server";
 

import { createClient, createAdminClient } from "@/utils/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createProduct(formData: FormData) {
  try {
    const supabase = createAdminClient();
    
    const uploadImage = async (file: File | null) => {
      if (!file || file.size === 0) return null;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) {
        console.error("Upload error:", error);
        return null;
      }
      const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    };
    
    const name = formData.get("name") as string;
    let slug = name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '');
    
    const { data: existingSlug } = await supabase.from('products').select('slug').eq('slug', slug).maybeSingle();
    if (existingSlug) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }
    const description = formData.get("description") as string;
    const basePriceStr = formData.get("base_price") as string;
    const base_price = basePriceStr ? parseFloat(basePriceStr) : 0;
    const category_id = formData.get("category_id") as string || null;
    const is_featured = formData.get("is_featured") === "on";
    const status = formData.get("status") as string;
    const designGroupStr = formData.get("design_group") as string;
    const design_group = designGroupStr ? designGroupStr.toLowerCase().trim().replace(/[\s_]+/g, '-') : null;
    const sizeLabelStr = formData.get("size_label") as string;
    const size_label = sizeLabelStr ? sizeLabelStr.trim() : null;
    const siblingLabelStr = formData.get("sibling_label") as string;
    const sibling_label = siblingLabelStr ? siblingLabelStr.trim() : null;
    
    // Insert Product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert([
        { 
          name, 
          slug, 
          description, 
          base_price, 
          category_id, 
          is_featured, 
          status,
          design_group,
          size_label,
          sibling_label
        }
      ])
      .select()
      .single();

    if (productError || !product) {
      console.error("Error creating product:", productError);
      return { error: productError?.message || "Failed to create product" };
    }



    // Handle Variants
    const variantNames = formData.getAll("variant_name[]") as string[];
    const variantSkus = formData.getAll("variant_sku[]") as string[];
    const variantPrices = formData.getAll("variant_price[]") as string[];
    const variantQuantities = formData.getAll("variant_quantity[]") as string[];
    const variantImages = formData.getAll("variant_image[]") as File[];

    if (variantNames.length > 0) {
      const variantsToInsert = await Promise.all(variantNames.map(async (vName, index) => {
        const vImage = variantImages[index];
        const imageUrl = await uploadImage(vImage);
        return {
          product_id: product.id,
          name: vName,
          sku: variantSkus[index] || `${slug}-${index}`,
          price_adjustment: parseFloat(variantPrices[index] || "0"),
          stock_quantity: parseInt(variantQuantities[index] || "0", 10),
          image_url: imageUrl
        };
      }));

      const { error: variantError } = await supabase
        .from("variants")
        .insert(variantsToInsert);

      if (variantError) {
        console.error("Error creating variants:", variantError);
        return { error: variantError.message };
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin/collections");
    revalidateTag("products", {});
    return { success: true };
  } catch (error: any) {
    console.error("Unhandled error in createProduct:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function getProducts() {
  const supabase = createAdminClient();
  // We want to fetch products along with their category and variants
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name),
      variants(*),
      images:product_images(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  
  return data;
}

export async function getDesignGroups() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("design_group")
    .not("design_group", "is", null);

  if (error) {
    console.error("Error fetching design groups:", error);
    return [];
  }
  
  return Array.from(new Set(data.map((p: any) => p.design_group).filter(Boolean))).sort();
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  
  // Find variants to clean up foreign keys that don't cascade (like order_items)
  const { data: variants } = await supabase.from("variants").select("id").eq("product_id", id);
  if (variants && variants.length > 0) {
    const variantIds = variants.map(v => v.id);
    // Nullify or delete references in order_items
    await supabase.from("order_items").delete().in("variant_id", variantIds);
  }

  // First delete any relations to avoid foreign key constraints (fallback if cascade is missing)
  await supabase.from("variants").delete().eq("product_id", id);
  await supabase.from("product_images").delete().eq("product_id", id);
  await supabase.from("reviews").delete().eq("product_id", id);

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting product:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/collections");
  revalidateTag("products", {});
  return { success: true };
}

export async function deleteProductAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await deleteProduct(id);
}

export async function getProductById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      variants(*),
      images:product_images(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data;
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const supabase = createAdminClient();
    
    const uploadImage = async (file: File | null) => {
      if (!file || file.size === 0) return null;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) return null;
      const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    };
    
    const name = formData.get("name") as string;
    let slug = name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '');
    
    const { data: existingSlug } = await supabase.from('products').select('id, slug').eq('slug', slug).maybeSingle();
    if (existingSlug && existingSlug.id !== id) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }
    const description = formData.get("description") as string;
    const basePriceStr = formData.get("base_price") as string;
    const base_price = basePriceStr ? parseFloat(basePriceStr) : 0;
    const category_id = formData.get("category_id") as string || null;
    const status = formData.get("status") as string;
    const is_featured = formData.get("is_featured") === "on";
    const designGroupStr = formData.get("design_group") as string;
    const design_group = designGroupStr ? designGroupStr.toLowerCase().trim().replace(/[\s_]+/g, '-') : null;
    const sizeLabelStr = formData.get("size_label") as string;
    const size_label = sizeLabelStr ? sizeLabelStr.trim() : null;
    const siblingLabelStr = formData.get("sibling_label") as string;
    const sibling_label = siblingLabelStr ? siblingLabelStr.trim() : null;
    
    const { error: productError } = await supabase
      .from("products")
      .update({ name, slug, description, base_price, category_id, status, is_featured, design_group, size_label, sibling_label })
      .eq("id", id);

    if (productError) return { error: productError.message };



    // Handle Variants
    const variantIds = formData.getAll("variant_id[]") as string[];
    const variantExistingImages = formData.getAll("variant_existing_image[]") as string[];
    const variantNames = formData.getAll("variant_name[]") as string[];
    const variantSkus = formData.getAll("variant_sku[]") as string[];
    const variantPrices = formData.getAll("variant_price[]") as string[];
    const variantQuantities = formData.getAll("variant_quantity[]") as string[];
    const variantImages = formData.getAll("variant_image[]") as File[];

    const submittedVariantIds = variantIds.filter(vId => vId && vId !== "");
    
    // Delete any variants that were removed
    if (submittedVariantIds.length > 0) {
      // Supabase JS .not('id', 'in', `(${...})`) requires a proper format.
      // Easiest is to fetch all current variants, and delete the ones not in submittedVariantIds
      const { data: existingVariants } = await supabase.from("variants").select("id").eq("product_id", id);
      if (existingVariants) {
        const toDelete = existingVariants.filter(ev => !submittedVariantIds.includes(ev.id)).map(ev => ev.id);
        if (toDelete.length > 0) {
          await supabase.from("order_items").delete().in("variant_id", toDelete);
          await supabase.from("variants").delete().in("id", toDelete);
        }
      }
    } else {
      // All variants were removed
      const { data: existingVariants } = await supabase.from("variants").select("id").eq("product_id", id);
      if (existingVariants && existingVariants.length > 0) {
        const toDelete = existingVariants.map(ev => ev.id);
        await supabase.from("order_items").delete().in("variant_id", toDelete);
        await supabase.from("variants").delete().eq("product_id", id);
      }
    }

    // Upsert variants
    if (variantNames.length > 0) {
      for (let i = 0; i < variantNames.length; i++) {
        const vId = variantIds[i];
        let vImageUrl = variantExistingImages[i] || null;
        
        if (variantImages[i] && variantImages[i].size > 0) {
          const uploadedUrl = await uploadImage(variantImages[i]);
          if (uploadedUrl) vImageUrl = uploadedUrl;
        }
        
        const variantData = {
          product_id: id,
          name: variantNames[i],
          sku: variantSkus[i] || `${slug}-${i}`,
          price_adjustment: parseFloat(variantPrices[i] || "0"),
          stock_quantity: parseInt(variantQuantities[i] || "0", 10),
          image_url: vImageUrl
        };

        if (vId && vId !== "") {
          await supabase.from("variants").update(variantData).eq("id", vId);
        } else {
          await supabase.from("variants").insert([variantData]);
        }
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin/collections");
    revalidateTag("products", {});
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

