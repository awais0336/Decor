"use server";
 

import { createAdminClient } from "@/utils/supabase/server";

export async function getStorefrontProducts() {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      base_price,
      stock_quantity,
      status,
      created_at,
      category:categories(name),
      images:product_images(image_url),
      variants(id, name, stock_quantity, image_url, price_adjustment)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching storefront products:", JSON.stringify(error, null, 2));
    return [];
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
      rawPrice: p.base_price || 0,
      image: p.images?.[0]?.image_url || p.variants?.find((v: any) => v.image_url)?.image_url || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=600",
      inStock: p.variants && p.variants.length > 0 
        ? p.variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) > 0
        : true,
      createdAt: p.created_at,
    };
  });
}

// Helper function for Levenshtein distance to detect typos
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}

// Helper to check fuzzy match
function isFuzzyMatch(text: string, query: string): boolean {
  if (!text || !query) return false;
  text = text.toLowerCase();
  query = query.toLowerCase();
  
  // Exact or partial exact match
  if (text.includes(query)) return true;
  
  // Split into words
  const textWords = text.split(/[\s\-_,]+/);
  const queryWords = query.split(/[\s\-_,]+/);
  
  // For each word in the query, see if there's a close match in the text
  for (const qw of queryWords) {
    if (qw.length < 3) continue; // Skip very short words for fuzzy matching
    
    let matched = false;
    for (const tw of textWords) {
      if (Math.abs(tw.length - qw.length) > 2) continue; // Too different in length
      
      const distance = levenshteinDistance(tw, qw);
      // Allow 1 typo for 3-4 letter words, 2 typos for 5+ letter words
      const maxDistance = qw.length <= 4 ? 1 : 2;
      
      if (distance <= maxDistance) {
        matched = true;
        break;
      }
    }
    // If any significant query word fuzzily matches any text word, consider it a match
    if (matched) return true;
  }
  
  return false;
}

export async function searchStorefrontProducts(query: string) {
  if (!query) return [];
  
  const supabase = createAdminClient();

  // Fetch all active products for in-memory fuzzy matching
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      base_price,
      stock_quantity,
      description,
      status,
      created_at,
      category:categories(name),
      images:product_images(image_url),
      variants(id, name, stock_quantity, image_url, price_adjustment)
    `)
    .eq("status", "active");

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

  // Filter using our fuzzy match function
  const filteredData = data?.filter((p: any) => {
    const categoryName = (p.category as any)?.name || "";
    return isFuzzyMatch(p.name, query) || 
           isFuzzyMatch(p.description, query) || 
           isFuzzyMatch(categoryName, query);
  });

  // Format the data to match the frontend components expectations
  return filteredData?.map((p: any) => {
    const minVariantPrice = p.variants?.length > 0 ? Math.min(...p.variants.map((v: any) => Number(v.price_adjustment))) : 0;
    const displayPrice = p.base_price > 0 
      ? `Rs. ${p.base_price.toLocaleString()}`
      : (minVariantPrice > 0 ? `From Rs. ${minVariantPrice.toLocaleString()}` : "Price Varies");

    return {
      id: p.id,
      name: p.name,
      category: (p.category as any)?.name || "Decor",
      price: displayPrice,
      rawPrice: p.base_price || 0,
      image: p.images?.[0]?.image_url || p.variants?.find((v: any) => v.image_url)?.image_url || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=600",
      inStock: p.variants && p.variants.length > 0 
        ? p.variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0) > 0
        : true,
      createdAt: p.created_at,
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
      category:categories(name),
      images:product_images(image_url),
      variants(id, name, stock_quantity, image_url, price_adjustment)
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching storefront product:", error ? JSON.stringify(error, null, 2) : "No data found");
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
