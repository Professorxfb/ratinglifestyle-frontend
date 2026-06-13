"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { register } from "@/lib/auth-api";
import { useAuth } from "@/store/auth";
import AuthShell from "@/components/auth/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuth((s) => s.setAuth);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { user, token } = await register({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        password_confirmation: form.confirm,
      });
      setAuth(user, token);
      toast.success("Account created. Welcome!");
      router.push("/account");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create Account" subtitle="Join Rupkotha Trendz for a tailored experience.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full Name *"><input className={cls} value={form.name} onChange={set("name")} autoComplete="name" /></Field>
        <Field label="Email *"><input type="email" className={cls} value={form.email} onChange={set("email")} autoComplete="email" /></Field>
        <Field label="Phone"><input className={cls} placeholder="017XXXXXXXX" value={form.phone} onChange={set("phone")} autoComplete="tel" /></Field>
        <Field label="Password *"><input type="password" className={cls} value={form.password} onChange={set("password")} autoComplete="new-password" /></Field>
        <Field label="Confirm Password *"><input type="password" className={cls} value={form.confirm} onChange={set("confirm")} autoComplete="new-password" /></Field>
        <button type="submit" disabled={loading} className="btn-gold w-full">
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-gold hover:opacity-70">Sign in</Link>
      </p>
    </AuthShell>
  );
}

const cls = "w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}
