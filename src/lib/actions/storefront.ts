"use server";
 

import { createAdminClient } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";

export async function getStorefrontProducts(categorySlug?: string) {
  return unstable_cache(
    async () => {
      const supabase = createAdminClient();
    
      let query = supabase
        .from("products")
        .select(`
          id,
          name,
          base_price,
          stock_quantity,
          status,
          created_at,
          is_featured,
          design_group,
          category:categories(name),
          images:product_images(image_url),
          variants(id, name, stock_quantity, image_url, price_adjustment),
          sibling_label
        `)
        .eq("status", "active");

      if (categorySlug) {
        // Find descendants in memory to avoid missing RPC errors and improve performance
        const allCategories = await getAllCategories();
        const targetCategory = allCategories.find((c: any) => c.slug === categorySlug);
        
        if (targetCategory) {
          const descendantIds = new Set<string>();
          descendantIds.add(targetCategory.id);
          
          // Helper to find children recursively
          const findChildren = (parentId: string) => {
            const children = allCategories.filter((c: any) => c.parent_id === parentId);
            for (const child of children) {
              if (!descendantIds.has(child.id)) {
                descendantIds.add(child.id);
                findChildren(child.id);
              }
            }
          };
          
          findChildren(targetCategory.id);
          query = query.in("category_id", Array.from(descendantIds));
        } else {
          return [];
        }
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.warn("[getStorefrontProducts] Error:", JSON.stringify(error, null, 2), error);
        return [];
      }

      const designGroups = Array.from(new Set(data?.map(p => p.design_group).filter(Boolean)));
      let siblingCounts: Record<string, number> = {};

      if (designGroups.length > 0) {
        const { data: siblingData } = await supabase
          .from("products")
          .select("design_group")
          .in("design_group", designGroups)
          .eq("status", "active");
          
        if (siblingData) {
          siblingData.forEach(row => {
            siblingCounts[row.design_group] = (siblingCounts[row.design_group] || 0) + 1;
          });
        }
      }

      // Format the data to match the frontend components expectations
      return data?.map((p: any) => {
        const minVariantPrice = p.variants?.length > 0 ? Math.min(...p.variants.map((v: any) => Number(v.price_adjustment))) : 0;
        const displayPrice = p.base_price > 0 
          ? `Rs. ${p.base_price.toLocaleString()}`
          : (minVariantPrice > 0 ? `From Rs. ${minVariantPrice.toLocaleString()}` : "Price Varies");

        return {
          id: p.id,
          name: p.name,
          category: (p.category as any)?.name || "Decor",
          price: displayPrice,
          rawPrice: p.base_price > 0 ? p.base_price : (minVariantPrice > 0 ? minVariantPrice : 0),
          image: p.images?.[0]?.image_url || p.variants?.find((v: any) => v.image_url)?.image_url || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=600",
          inStock: p.variants && p.variants.length > 0 
            ? p.variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) > 0
            : true,
          createdAt: p.created_at,
          is_featured: p.is_featured,
          design_group: p.design_group,
          siblingCount: p.design_group ? (siblingCounts[p.design_group] || 0) : 0,
          siblingLabel: p.sibling_label || "Sizes",
        };
      });
    },
    ['storefront-products', categorySlug || 'all'],
    { revalidate: 3600, tags: ['products'] }
  )();
}



export async function searchStorefrontProducts(query: string) {
  if (!query) return [];
  
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .rpc('search_products_fuzzy', { search_term: query })
    .select(`
      id,
      name,
      base_price,
      stock_quantity,
      description,
      status,
      created_at,
      design_group,
      category:categories(name),
      images:product_images(image_url),
      variants(id, name, stock_quantity, image_url, price_adjustment),
      sibling_label
    `);

  if (error) {
    console.warn("[searchStorefrontProducts] Error:", error);
    return [];
  }

  // Format the data to match the frontend components expectations
  return (data as any[])?.map((p: any) => {
    const minVariantPrice = p.variants?.length > 0 ? Math.min(...p.variants.map((v: any) => Number(v.price_adjustment))) : 0;
    const displayPrice = p.base_price > 0 
      ? `Rs. ${p.base_price.toLocaleString()}`
      : (minVariantPrice > 0 ? `From Rs. ${minVariantPrice.toLocaleString()}` : "Price Varies");

    return {
      id: p.id,
      name: p.name,
      category: (p.category as any)?.name || "Decor",
      price: displayPrice,
      rawPrice: p.base_price > 0 ? p.base_price : (minVariantPrice > 0 ? minVariantPrice : 0),
      image: p.images?.[0]?.image_url || p.variants?.find((v: any) => v.image_url)?.image_url || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=600",
      inStock: p.variants && p.variants.length > 0 
        ? p.variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) > 0
        : true,
      createdAt: p.created_at,
      design_group: p.design_group,
      siblingCount: 0, // Simplified for search, can enhance later
      siblingLabel: p.sibling_label || "Sizes",
    };
  });
}

export async function getStorefrontProduct(id: string) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      base_price,
      stock_quantity,
      status,
      design_group,
      size_label,
      sibling_label,
      category:categories(name),
      images:product_images(image_url),
      variants(id, name, stock_quantity, image_url, price_adjustment)
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.warn("[getStorefrontProduct] Error:", error ? JSON.stringify(error, null, 2) : "No data found");
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    category: (data.category as any)?.name || "Decor",
    price: `Rs. ${data.base_price.toLocaleString()}`,
    rawPrice: data.base_price || 0,
    images: [
      ...(data.images?.map((img: any) => img.image_url) || []),
      ...(data.variants?.filter((v: any) => v.image_url).map((v: any) => v.image_url) || [])
    ],
    variants: data.variants?.map((v: any) => ({
      id: v.id,
      name: v.name,
      image_url: v.image_url,
      price_adjustment: v.price_adjustment,
      stock_quantity: v.stock_quantity
    })) || [],
    inStock: data.variants && data.variants.length > 0 
      ? data.variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) > 0
      : true,
    design_group: data.design_group,
    size_label: data.size_label,
    sibling_label: data.sibling_label || "Sizes",
  };
}

export async function getStoreSettings() {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase.storage.from("config").download("settings.json");

  if (error) {
    return null;
  }

  try {
    const text = await data.text();
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

export const getTopLevelCategories = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, image_url, parent_id")
      .is("parent_id", null)
      .order("name");

    if (error) {
      console.warn("[getTopLevelCategories] Error:", error);
      return [];
    }
    return data;
  },
  ['top-level-categories'],
  { revalidate: 3600, tags: ['categories'] }
);

export const getAllCategories = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, image_url, parent_id")
      .order("name");

    if (error) {
      console.warn("[getAllCategories] Error:");
      console.warn("- Message:", error?.message);
      console.warn("- Details:", error?.details);
      console.warn("- Full error:", error);
      return [];
    }
    return data;
  },
  ['all-categories'],
  { revalidate: 3600, tags: ['categories'] }
);

export async function getCategoryBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url, parent_id")
    .eq("slug", slug)
    .single();

  if (error) {
    console.warn(`[getCategoryBySlug] Error for ${slug}:`, error);
    return null;
  }
  return data;
}

export async function getCategoryChildren(parentId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url, parent_id")
    .eq("parent_id", parentId)
    .order("name");

  if (error) {
    console.warn(`[getCategoryChildren] Error for ${parentId}:`, error);
    return [];
  }
  return data;
}

export async function getCategoriesBySlugs(slugs: string[]) {
  if (!slugs || slugs.length === 0) return [];
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url, parent_id")
    .in("slug", slugs);

  if (error) {
    console.warn("[getCategoriesBySlugs] Error:", error);
    return [];
  }
  
  // Sort them to match the order of the slugs array
  return slugs.map(slug => data.find(c => c.slug === slug)).filter(Boolean);
}

export async function getProductSiblings(designGroup: string, currentProductId: string) {
  if (!designGroup) return [];
  
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      base_price,
      stock_quantity,
      size_label,
      images:product_images(image_url),
      variants(stock_quantity)
    `)
    .eq("design_group", designGroup)
    .neq("id", currentProductId)
    .eq("status", "active")
    .order("base_price", { ascending: true });

  if (error) return [];
  
  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    size_label: p.size_label,
    price: p.base_price,
    image: p.images?.[0]?.image_url,
    inStock: p.stock_quantity > 0 || (p.variants?.some((v: any) => v.stock_quantity > 0))
  }));
}

