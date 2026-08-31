import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Package, MapPin } from "lucide-react";

export default async function AccountOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-border/50">
        <h2 className="font-heading text-2xl text-brand-primary mb-4">Dashboard</h2>
        <p className="text-brand-text/70">
          From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-border/50">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-brand-gold" />
            <h3 className="font-heading text-xl text-brand-text">Recent Orders</h3>
          </div>
          {recentOrders && recentOrders.length > 0 ? (
            <ul className="space-y-3 mb-4">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex justify-between items-center text-sm border-b border-brand-border/30 pb-2">
                  <span className="text-brand-text/70">#{order.id.split('-')[0]}</span>
                  <span className="font-medium">Rs {order.total_amount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-brand-text/60 mb-4">No recent orders found.</p>
          )}
          <Link href="/account/orders" className="text-brand-gold text-sm font-medium hover:underline">
            View all orders
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-border/50">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-brand-gold" />
            <h3 className="font-heading text-xl text-brand-text">Addresses</h3>
          </div>
          <p className="text-sm text-brand-text/60 mb-4">Manage your shipping and billing addresses for faster checkout.</p>
          <Link href="/account/addresses" className="text-brand-gold text-sm font-medium hover:underline">
            Manage addresses
          </Link>
        </div>
      </div>
    </div>
  );
}
