"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";
import { login } from "@/lib/auth-api";
import { useAuth } from "@/store/auth";
import { useApi } from "@/lib/http";
import AuthShell from "@/components/auth/AuthShell";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const setAuth = useAuth((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const { user, token } = await login(email, password);
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      router.push(params.get("redirect") || "/account");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to your Rupkotha Trendz account.">
      <form onSubmit={submit} className="space-y-4">
        <Input type="email" label="Email" value={email} onChange={setEmail} autoComplete="email" />
        <Input type="password" label="Password" value={password} onChange={setPassword} autoComplete="current-password" />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-gold hover:opacity-70">
            Forgot password?
          </Link>
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4 text-xs text-muted">
        <span className="h-px flex-1 bg-line" /> OR <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SocialButton provider="google" label="Google" />
        <SocialButton provider="facebook" label="Facebook" />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href="/register" className="text-gold hover:opacity-70">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}

function Input({
  label, type, value, onChange, autoComplete,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
      />
    </label>
  );
}

function SocialButton({ provider, label }: { provider: string; label: string }) {
  function go() {
    if (!useApi) {
      toast("Social login activates once the API is connected.", { icon: "🔌" });
      return;
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
  }
  return (
    <button onClick={go} type="button" className="btn-ghost justify-center">
      {label}
    </button>
  );
}
