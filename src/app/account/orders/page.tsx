"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { getMyOrders } from "@/lib/account";
import { formatBDT } from "@/lib/site";
import type { OrderSummary } from "@/lib/types";
import StatusBadge from "@/components/account/StatusBadge";

export default function OrdersPage() {
  const token = useAuth((s) => s.token);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders(token)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl text-ink">Order History</h2>

      {loading ? (
        <p className="text-muted">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="rounded-sm border border-line bg-card p-10 text-center">
          <p className="text-muted">No orders yet.</p>
          <Link href="/shop" className="btn-gold mt-4">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.orderNumber}`}
              className="flex flex-col gap-3 rounded-sm border border-line bg-card p-5 transition-colors hover:border-gold/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-mono text-sm text-ink">{o.orderNumber}</p>
                <p className="mt-1 text-xs text-muted">
                  Placed {o.createdAt} · {o.itemsCount} item(s) · {o.paymentMethod.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={o.status} />
                <span className="font-display text-lg text-gold">{formatBDT(o.total)}</span>
                <span className="text-gold">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
