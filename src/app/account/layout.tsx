"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import { logout as apiLogout } from "@/lib/auth-api";
import PageHeader from "@/components/ui/PageHeader";

const NAV = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/notifications", label: "Notifications" },
  { href: "/account/profile", label: "Profile" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, hydrated, logout } = useAuth();

  // Client-side auth guard — redirect to login once the store has hydrated.
  useEffect(() => {
    if (hydrated && !token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, token, pathname, router]);

  if (!hydrated) {
    return (
      <div className="container-luxe py-32 text-center text-muted">Loading…</div>
    );
  }

  if (!token) {
    return (
      <div className="container-luxe py-32 text-center text-muted">Redirecting to sign in…</div>
    );
  }

  async function handleLogout() {
    await apiLogout(token);
    logout();
    toast.success("Signed out.");
    router.push("/");
  }

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0] ?? "there"}`}
        description="Manage your orders, profile, and preferences."
        crumbs={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />
      <div className="container-luxe grid grid-cols-1 gap-10 py-12 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit lg:sticky lg:top-32">
          <nav className="flex gap-2 overflow-x-auto rounded-sm border border-line bg-card p-2 lg:flex-col">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "shrink-0 rounded-sm px-4 py-2.5 text-sm transition-colors",
                    active ? "bg-gold-gradient text-obsidian" : "text-ink/70 hover:text-gold",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="shrink-0 rounded-sm px-4 py-2.5 text-left text-sm text-ink/70 transition-colors hover:text-danger"
            >
              Logout
            </button>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </>
  );
}
