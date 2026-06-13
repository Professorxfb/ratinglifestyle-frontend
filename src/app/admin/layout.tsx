"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import { logout as apiLogout } from "@/lib/auth-api";

const NAV: { href: string; label: string; icon: string }[] = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/products", label: "Products", icon: "❖" },
  { href: "/admin/orders", label: "Orders", icon: "✦" },
  { href: "/admin/categories", label: "Categories", icon: "❏" },
  { href: "/admin/coupons", label: "Coupons", icon: "✺" },
  { href: "/admin/banners", label: "Banners", icon: "▭" },
  { href: "/admin/reviews", label: "Reviews", icon: "★" },
  { href: "/admin/users", label: "Users", icon: "◍" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, hydrated, logout } = useAuth();

  const isStaff = user?.role === "admin" || user?.role === "moderator";

  // Client-side guard — must be signed in AND staff.
  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (!isStaff) {
      router.replace("/");
    }
  }, [hydrated, token, isStaff, pathname, router]);

  if (!hydrated) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Loading…</div>;
  }
  if (!token || !isStaff) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Redirecting…
      </div>
    );
  }

  async function handleLogout() {
    await apiLogout(token);
    logout();
    toast.success("Signed out.");
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-obsidian">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-charcoal lg:flex">
        <div className="border-b border-line px-6 py-5">
          <Link href="/admin" className="font-logo text-lg tracking-luxe text-ink">
            RUPKOTHA <span className="text-gold">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-gold-gradient text-obsidian" : "text-ink/70 hover:bg-card hover:text-gold",
                )}
              >
                <span className="w-4 text-center text-base leading-none" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-3">
          <Link href="/" className="block rounded-sm px-3 py-2 text-xs text-muted hover:text-gold">
            ← Back to store
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-charcoal px-5 py-3">
          {/* Mobile nav (horizontal scroll) */}
          <nav className="flex gap-1 overflow-x-auto no-scrollbar lg:hidden">
            {NAV.map((item) => {
              const active =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "shrink-0 rounded-sm px-3 py-1.5 text-xs transition-colors",
                    active ? "bg-gold-gradient text-obsidian" : "text-ink/70 hover:text-gold",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-muted sm:block">
              {user?.name} <span className="text-gold">· {user?.role}</span>
            </span>
            <button onClick={handleLogout} className="btn-ghost px-4 py-1.5 text-xs">
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
