"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { useWishlist } from "@/store/wishlist";
import { getMyOrders } from "@/lib/account";
import { formatBDT } from "@/lib/site";
import type { OrderSummary } from "@/lib/types";
import StatusBadge from "@/components/account/StatusBadge";

export default function AccountDashboard() {
  const token = useAuth((s) => s.token);
  const user = useAuth((s) => s.user);
  const wishCount = useWishlist((s) => s.ids.length);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders(token)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token]);

  const totalSpent = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((t, o) => t + o.total, 0);

  return (
    <div className="space-y-8">
      {(user?.role === "admin" || user?.role === "moderator") && (
        <Link
          href="/admin"
          className="flex items-center justify-between gap-4 rounded-sm border border-gold/40 bg-card p-5 transition-colors hover:border-gold"
        >
          <div>
            <p className="font-display text-lg text-ink">Admin Panel</p>
            <p className="text-sm text-muted">Manage products, orders, customers and more.</p>
          </div>
          <span className="btn-gold px-5 py-2.5 text-xs">Open →</span>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat label="Total Orders" value={loading ? "…" : String(orders.length)} />
        <Stat label="Wishlist Items" value={String(wishCount)} />
        <Stat label="Total Spent" value={loading ? "…" : formatBDT(totalSpent)} />
      </div>

      <div className="rounded-sm border border-line bg-card p-6">
        <h2 className="font-display text-xl text-ink">Account Details</h2>
        <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Detail label="Name" value={user?.name} />
          <Detail label="Email" value={user?.email ?? "—"} />
          <Detail label="Phone" value={user?.phone ?? "—"} />
          <Detail label="Member" value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Customer"} />
        </dl>
        <Link href="/account/profile" className="btn-ghost mt-5">Edit Profile</Link>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm text-gold hover:opacity-70">View all</Link>
        </div>
        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="rounded-sm border border-line bg-card p-8 text-center">
            <p className="text-muted">You haven’t placed any orders yet.</p>
            <Link href="/shop" className="btn-gold mt-4">Start Shopping</Link>
          </div>
        ) : (
          <div className="divide-y divide-line/50 rounded-sm border border-line">
            {orders.slice(0, 4).map((o) => (
              <Link
                key={o.id}
                href={`/account/orders/${o.orderNumber}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-charcoal"
              >
                <div>
                  <p className="font-mono text-sm text-ink">{o.orderNumber}</p>
                  <p className="text-xs text-muted">{o.createdAt} · {o.itemsCount} item(s)</p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={o.status} />
                  <span className="text-sm text-gold">{formatBDT(o.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-line bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl text-gold">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
