import { getUserOrders } from "@/lib/actions/orders";
import { ReorderButton } from "./ReorderButton";
import Link from "next/link";
import { Package } from "lucide-react";

export default async function OrdersPage() {
  const { success, orders, error } = await getUserOrders();

  if (!success) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-border/50 text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-border/50">
        <h2 className="font-heading text-2xl text-brand-text">Order History</h2>
        <p className="text-sm text-brand-text/70 mt-2">
          View all your past orders and easily reorder your favorite luxury items.
        </p>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-brand-border/50 text-center">
          <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-brand-text/40" />
          </div>
          <h3 className="font-heading text-xl text-brand-text mb-2">No orders yet</h3>
          <p className="text-brand-text/60 mb-6 max-w-sm mx-auto">
            You haven't placed any orders yet. Discover our latest collections and find something you love.
          </p>
          <Link 
            href="/collections"
            className="inline-flex px-6 py-3 bg-brand-primary text-white font-medium rounded-md hover:bg-brand-primary/90 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-brand-border/50 overflow-hidden">
              <div className="bg-brand-secondary/30 p-4 border-b border-brand-border/50 flex flex-wrap gap-4 items-center justify-between text-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                  <div>
                    <p className="text-brand-text/60 mb-1">Order Placed</p>
                    <p className="font-medium text-brand-text">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-brand-text/60 mb-1">Total</p>
                    <p className="font-medium text-brand-text">Rs. {order.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-brand-text/60 mb-1">Status</p>
                    <p className="font-medium capitalize text-brand-text">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        order.status === 'delivered' ? 'bg-green-500' :
                        order.status === 'cancelled' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`} />
                      {order.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-text/60 mb-1">Order #</p>
                    <p className="font-medium text-brand-text">{order.id.split('-')[0]}</p>
                  </div>
                </div>
                <div>
                  <ReorderButton orderItems={order.order_items} />
                </div>
              </div>
              
              <div className="p-4 md:p-6 space-y-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4 border-b border-brand-border/30 pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-24 bg-brand-secondary rounded-md overflow-hidden shrink-0 border border-brand-border/30 relative">
                       {/* In a real app we'd use Image, using img here for simplicity since external URLs might not be configured */}
                       <img 
                         src={item.variants?.image_url || item.variants?.products?.image_url || "/api/placeholder/400/400"} 
                         alt={item.variants?.products?.name || "Product"}
                         className="w-full h-full object-cover"
                       />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium text-brand-text text-base">{item.variants?.products?.name}</h4>
                        {item.variants?.name !== "Default" && (
                          <p className="text-sm text-brand-text/60 mt-1">Variant: {item.variants?.name}</p>
                        )}
                        <p className="text-sm text-brand-text/60 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-brand-text">Rs. {item.price_at_time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
