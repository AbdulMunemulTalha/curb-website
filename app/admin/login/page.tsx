"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-base px-5 font-body">
      <div className="w-full max-w-sm rounded-card border border-border-subtle bg-bg-surface p-8">
        <h1 className="font-display text-xl font-bold text-text-primary">Curb Admin</h1>
        <p className="mt-1 text-sm text-text-secondary">Sign in to manage the waitlist.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs text-text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-control border border-border-subtle bg-bg-base px-4 py-3 text-sm text-text-primary focus:border-accent-secondary"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-control border border-border-subtle bg-bg-base px-4 py-3 text-sm text-text-primary focus:border-accent-secondary"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-xs text-state-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-control bg-accent-primary px-4 py-3 font-display text-sm font-medium text-bg-base transition-colors hover:bg-accent-primary-pressed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
