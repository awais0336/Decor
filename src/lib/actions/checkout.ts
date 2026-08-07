"use server";
 

import { createAdminClient } from "@/utils/supabase/server";
import { sendCheckoutEmail } from "@/lib/email";

export async function processCheckout(formData: FormData, cartItems: any[], rawTotal: number, couponCode?: string) {
  try {
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const postalCode = formData.get("postalCode") as string;
    const phone = formData.get("phone") as string;

    const supabase = createAdminClient();

    // 0. Validate Stock Before Proceeding
    for (const item of cartItems) {
      if (item.variant?.id) {
        const { data: variantData, error: variantError } = await supabase
          .from("variants")
          .select("stock_quantity, name")
          .eq("id", item.variant.id)
          .single();
          
        if (variantError || !variantData) {
          return { success: false, error: "One of the products in your cart could not be found." };
        }
        if (item.quantity > variantData.stock_quantity) {
          const itemName = item.name || variantData.name || "an item";
          return { 
            success: false, 
            error: `Not enough stock for ${itemName}. Only ${variantData.stock_quantity} available, but you requested ${item.quantity}.` 
          };
        }
      }
    }

    // 1. Create a guest profile or find existing (simplified for storefront checkout)
    // For a real app we'd link to auth.users, but for guest checkout we can just store details in the order
    // Wait, orders table has customer_id which is a foreign key to profiles.
    // If they are not logged in, we can leave customer_id null and add address to shipping_addresses or order metadata.
    // Let's create an address record first.
    const { data: addressObj, error: addressError } = await supabase.from("addresses").insert({
      street: address,
      city: city,
      postal_code: postalCode,
      country: "Pakistan",
      is_default: true
    }).select().single();

    if (addressError) {
      console.error("Address Error:", addressError);
      return { success: false, error: "Failed to save address." };
    }

    // Calculate Shipping Cost
    const shippingCost = city.trim().toLowerCase() === "lahore" ? 300 : 500;
    
    // Fetch coupons to validate on the server
    let discountAmount = 0;
    let finalTotal = rawTotal + shippingCost;
    
    if (couponCode) {
      const { data: configData } = await supabase.storage.from("config").download("coupons.json");
      if (configData) {
        try {
          const couponsText = await configData.text();
          const coupons = JSON.parse(couponsText);
          const validCoupon = coupons.find((c: any) => c.code === couponCode && c.active);
          
          if (validCoupon) {
            discountAmount = Math.round(rawTotal * (validCoupon.discount_percentage / 100));
            finalTotal = rawTotal - discountAmount + shippingCost;
          }
        } catch (e) {
          console.error("Failed to parse coupons", e);
        }
      }
    }

    // 2. Create Order
    const { data: order, error: orderError } = await supabase.from("orders").insert({
      customer_id: null, // Guest checkout
      status: "pending",
      subtotal: rawTotal,
      shipping_cost: shippingCost,
      discount_amount: discountAmount,
      total_amount: finalTotal,
      shipping_address_id: addressObj.id,
      guest_email: email,
      guest_name: `${firstName} ${lastName}`,
      guest_phone: phone
    }).select().single();

    if (orderError) {
      console.error("Order Error:", orderError);
      return { success: false, error: "Failed to create order." };
    }

    // 3. Create Order Items
    const orderItemsToInsert = cartItems.map(item => ({
      order_id: order.id,
      variant_id: item.variant?.id || null, 
      quantity: item.quantity,
      price_at_time: item.rawPrice || 0
    }));

    await supabase.from("order_items").insert(orderItemsToInsert);

    // 4. Decrement Stock
    for (const item of cartItems) {
      if (item.variant?.id) {
        // Decrement variant stock
        const { data: variantData } = await supabase.from("variants").select("stock_quantity").eq("id", item.variant.id).single();
        if (variantData) {
          await supabase.from("variants").update({ stock_quantity: Math.max(0, variantData.stock_quantity - item.quantity) }).eq("id", item.variant.id);
        }
      }
    }

    // 4. Send Emails using centralized logic
    await sendCheckoutEmail({
      email,
      firstName,
      lastName,
      address,
      city,
      postalCode,
      phone,
      totalAmount: finalTotal,
      cartItems
    });

    return { success: true };
  } catch (err: any) {
    console.error("Checkout Exception:", err);
    return { success: false, error: err.message };
  }
}
