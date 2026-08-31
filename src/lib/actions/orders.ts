"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getOrders() {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customer:profiles(first_name, last_name, email),
      items:order_items(
        *,
        variant:variants(
          name,
          sku,
          product:products(name)
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating order status:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function getUserOrders() {
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not logged in" };
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        variants (
          *,
          products (*)
        )
      )
    `)
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch orders error:", error);
    return { success: false, error: "Failed to fetch orders" };
  }

  return { success: true, orders };
}
