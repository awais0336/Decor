import { createClient } from "@/utils/supabase/server";
import { MapPin, Plus } from "lucide-react";

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-border/50 flex justify-between items-center">
        <div>
          <h2 className="font-heading text-2xl text-brand-primary">Addresses</h2>
          <p className="text-sm text-brand-text/70 mt-1">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-primary/90 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {(!addresses || addresses.length === 0) ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-brand-border/50 text-center">
          <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-brand-text/40" />
          </div>
          <h3 className="font-heading text-xl text-brand-text mb-2">No addresses saved</h3>
          <p className="text-brand-text/60 mb-6 max-w-sm mx-auto">
            Save your shipping address to speed up checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr: any) => (
            <div key={addr.id} className="bg-white p-6 rounded-lg shadow-sm border border-brand-border/50 relative">
              {addr.is_default && (
                <span className="absolute top-4 right-4 bg-brand-gold/10 text-brand-gold text-xs font-semibold px-2 py-1 rounded">
                  Default
                </span>
              )}
              <MapPin className="w-6 h-6 text-brand-gold mb-4" />
              <address className="not-italic text-sm text-brand-text space-y-1">
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.postal_code}</p>
                <p>{addr.country}</p>
              </address>
              <div className="mt-6 flex gap-4 text-sm font-medium">
                <button className="text-brand-primary hover:underline">Edit</button>
                <button className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
