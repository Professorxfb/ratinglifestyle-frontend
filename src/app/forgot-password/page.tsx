"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { forgotPassword } from "@/lib/auth-api";
import AuthShell from "@/components/auth/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Enter your email.");
      return;
    }
    setLoading(true);
    try {
      const message = await forgotPassword(email);
      setSent(true);
      toast.success(message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Reset Password" subtitle="We'll email you a secure reset link.">
      {sent ? (
        <div className="rounded-sm border border-gold/40 bg-card p-6 text-center">
          <p className="text-ink">Check your inbox</p>
          <p className="mt-2 text-sm text-muted">
            If an account exists for {email}, a password reset link is on its way.
          </p>
          <Link href="/login" className="btn-outline mt-6">Back to Sign In</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
            />
          </label>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
          <p className="text-center text-sm text-muted">
            Remembered it?{" "}
            <Link href="/login" className="text-gold hover:opacity-70">Sign in</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
