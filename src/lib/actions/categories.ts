"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const uploadImage = async (supabase: any, file: File | null) => {
  if (!file || file.size === 0) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `category_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
  if (error) {
    console.error("Upload error:", error);
    return null;
  }
  const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
  return publicUrlData.publicUrl;
};

export async function createCategory(formData: FormData) {
  const supabase = createAdminClient();
  
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '');
  const parent_id = formData.get("parent_id") as string;
  const imageFile = formData.get("image") as File | null;
  
  const image_url = await uploadImage(supabase, imageFile);

  const { error } = await supabase
    .from("categories")
    .insert([
      { 
        name, 
        slug, 
        parent_id: parent_id ? parent_id : null,
        ...(image_url && { image_url })
      }
    ]);

  if (error) {
    console.error("Error creating category:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/category");
  revalidatePath("/admin/products", "layout");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = createAdminClient();
  
  const name = formData.get("name") as string;
  const parent_id = formData.get("parent_id") as string;
  const imageFile = formData.get("image") as File | null;
  
  let updateData: any = {
    name,
    parent_id: parent_id ? parent_id : null
  };

  // Only update slug if name changed? Let's just update it for consistency
  updateData.slug = name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '');

  if (imageFile && imageFile.size > 0) {
    const image_url = await uploadImage(supabase, imageFile);
    if (image_url) {
      updateData.image_url = image_url;
    }
  }

  const { error } = await supabase
    .from("categories")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating category:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/category");
  revalidatePath("/admin/products", "layout");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting category:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/category");
  revalidatePath("/admin/products", "layout");
  return { success: true };
}

export async function getCategories() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  
  return data;
}
