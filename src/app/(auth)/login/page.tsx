"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push(next);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center bg-brand-secondary/30">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-brand-border/50">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl text-brand-primary mb-2">Welcome Back</h1>
          <p className="text-brand-text/70 text-sm">Sign in to your Decornish account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-brand-text">Password</label>
              <Link href="/forgot-password" className="text-xs text-brand-gold hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-brand-border rounded-md text-brand-text focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || password.length < 6}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 
              ${(email && password.length >= 6) 
                ? "bg-brand-gold text-white hover:bg-brand-gold/90 shadow-md" 
                : "bg-brand-secondary text-brand-text/40 cursor-not-allowed"
              }`}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-brand-text/70">
          Don't have an account?{" "}
          <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-brand-gold hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
