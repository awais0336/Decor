import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Package, MapPin, User, LogOut } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 md:px-8 bg-brand-secondary/20">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-heading text-3xl md:text-4xl text-brand-primary mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-brand-border/50 p-4 mb-6">
              <p className="font-semibold text-brand-text text-lg">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-sm text-brand-text/60 truncate">{user.email}</p>
            </div>

            <nav className="flex flex-col gap-2">
              <Link 
                href="/account" 
                className="flex items-center gap-3 px-4 py-3 rounded-md text-brand-text hover:bg-brand-secondary hover:text-brand-gold transition-colors"
              >
                <User className="w-5 h-5" />
                Account Overview
              </Link>
              <Link 
                href="/account/orders" 
                className="flex items-center gap-3 px-4 py-3 rounded-md text-brand-text hover:bg-brand-secondary hover:text-brand-gold transition-colors"
              >
                <Package className="w-5 h-5" />
                Order History
              </Link>
              <Link 
                href="/account/addresses" 
                className="flex items-center gap-3 px-4 py-3 rounded-md text-brand-text hover:bg-brand-secondary hover:text-brand-gold transition-colors"
              >
                <MapPin className="w-5 h-5" />
                Addresses
              </Link>
              <LogoutButton />
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
