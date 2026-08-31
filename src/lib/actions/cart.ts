"use server";

import { createClient } from "@/utils/supabase/server";

export async function mergeCartWithSupabase(localItems: any[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, items: localItems };

    // Find existing cart for user
    let { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!cart) {
      const { data: newCart } = await supabase
        .from("carts")
        .insert({ profile_id: user.id })
        .select("id")
        .single();
      cart = newCart;
    }

    if (!cart) return { success: false, items: localItems };

    // Fetch existing cart items from DB
    const { data: dbItems } = await supabase
      .from("cart_items")
      .select("*, variant_id, variants(*, products(*))")
      .eq("cart_id", cart.id);

    // Merge logic: Combine local items and db items
    const mergedMap = new Map();

    // 1. Add DB items to map
    if (dbItems) {
      dbItems.forEach((dbItem: any) => {
        const prod = dbItem.variants?.products;
        if (!prod) return;
        
        mergedMap.set(dbItem.variant_id, {
          id: prod.id, // Keeping consistent with local CartItem
          variant: { id: dbItem.variant_id },
          name: prod.name,
          price: `Rs ${prod.base_price}`,
          rawPrice: prod.base_price,
          image: dbItem.variants?.image_url || prod.images?.[0] || "",
          quantity: dbItem.quantity
        });
      });
    }

    // 2. Add/Merge local items
    let hasChanges = false;
    for (const local of localItems) {
      const variantId = local.variant?.id || local.id; // Fallback if variant isn't fully setup
      if (!variantId) continue;

      if (mergedMap.has(variantId)) {
        // Only merge if we actually need to increment (if logging in with a new local cart)
        const existing = mergedMap.get(variantId);
        // We will just keep the max quantity or add them. Let's add them.
        existing.quantity += local.quantity;
        hasChanges = true;
      } else {
        mergedMap.set(variantId, local);
        hasChanges = true;
      }
    }

    const mergedItems = Array.from(mergedMap.values());

    // 3. Save merged items back to DB
    if (hasChanges) {
      // Clear old
      await supabase.from("cart_items").delete().eq("cart_id", cart.id);
      
      // Insert new
      const itemsToInsert = mergedItems.map(item => ({
        cart_id: cart.id,
        variant_id: item.variant?.id || item.id,
        quantity: item.quantity
      }));
      
      if (itemsToInsert.length > 0) {
        await supabase.from("cart_items").insert(itemsToInsert);
      }
    }

    return { success: true, items: mergedItems };
  } catch (error) {
    console.error("Cart sync error:", error);
    return { success: false, items: localItems };
  }
}

export async function saveCartToSupabase(items: any[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false };

    let { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!cart) {
      const { data: newCart } = await supabase
        .from("carts")
        .insert({ profile_id: user.id })
        .select("id")
        .single();
      cart = newCart;
    }
    
    if (!cart) return { success: false };

    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    
    const itemsToInsert = items.map(item => ({
      cart_id: cart.id,
      variant_id: item.variant?.id || item.id,
      quantity: item.quantity
    }));
    
    if (itemsToInsert.length > 0) {
      await supabase.from("cart_items").insert(itemsToInsert);
    }

    return { success: true };
  } catch (error) {
    console.error("Cart save error:", error);
    return { success: false };
  }
}
