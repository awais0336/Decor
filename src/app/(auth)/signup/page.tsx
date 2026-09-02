"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Mail, Lock, User, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

import { Suspense } from "react";

function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const { cartCount } = useCart();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // If email confirmation is required, you might want to show a message instead of redirecting immediately
      // But we will assume automatic login for now or redirect
      setIsSuccess(true);
      setTimeout(() => {
        router.push(next);
        router.refresh();
      }, 2000);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center bg-brand-secondary/30">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-brand-border/50 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-2xl text-brand-text mb-2">Account Created!</h2>
          <p className="text-brand-text/70 mb-6">Redirecting you to your destination...</p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center bg-brand-secondary/30">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-brand-border/50">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl text-brand-text mb-2">Create Account</h1>
          <p className="text-brand-text/70 text-sm">Join Decornish today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text/40" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-md text-brand-text focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-brand-border rounded-md text-brand-text focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-md text-brand-text focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text/40" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-md text-brand-text focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !firstName || !lastName || !email || password.length < 6}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 
              ${(firstName && lastName && email && password.length >= 6) 
                ? "bg-brand-gold text-white hover:bg-brand-gold/90 shadow-md" 
                : "bg-brand-secondary text-brand-text/40 cursor-not-allowed"
              }`}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-brand-text/70">
          Already have an account?{" "}
          <Link href={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-brand-gold hover:underline font-medium">
            Sign in
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-brand-border/50">
          <Link 
            href={cartCount > 0 ? "/checkout" : "/"} 
            className="w-full flex items-center justify-center py-3 px-4 border border-brand-border rounded-md font-medium text-brand-text hover:bg-brand-secondary/50 transition-colors"
          >
            {cartCount > 0 ? "Order as Guest" : "Continue as Guest"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>}>
      <SignupForm />
    </Suspense>
  );
}
