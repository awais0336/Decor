"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function GuestToAccountBridge({ email, firstName, lastName }: { email: string, firstName: string, lastName: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
  }, []);

  // Do not show for logged-in users
  if (isLoggedIn === true || isLoggedIn === null) return null;

  if (success) {
    return (
      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-brand-gold/50 max-w-md mx-auto">
        <h3 className="font-heading text-xl text-brand-text mb-2">Account Created!</h3>
        <p className="text-sm text-brand-text/70 mb-4">
          You can now track your order status and save your information for next time.
        </p>
        <Link 
          href="/account"
          className="inline-flex items-center justify-center gap-2 text-brand-gold font-medium hover:underline"
        >
          Go to my account <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
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

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-brand-border/50 max-w-md mx-auto text-left">
      <div className="mb-6">
        <h3 className="font-heading text-xl text-brand-text mb-2">Save your information for next time</h3>
        <p className="text-sm text-brand-text/70">
          Create a password for <strong>{email}</strong> to easily track this order and speed up future checkouts.
        </p>
      </div>

      <form onSubmit={handleCreateAccount} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-brand-text mb-1">Create a Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-brand-border rounded-md px-3 py-2 text-sm focus:outline-brand-gold"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={isLoading || !password}
          className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-2 rounded-md text-sm font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Account
        </button>
      </form>
    </div>
  );
}
