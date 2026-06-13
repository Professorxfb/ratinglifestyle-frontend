"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { useAuth } from "@/store/auth";
import { getAdminOrders } from "@/lib/admin-api";
import { formatBDT } from "@/lib/site";
import { AdminToolbar, Card, Empty, Spinner, StatusPill } from "@/components/admin/ui";
import type { OrderStatus, OrderSummary } from "@/lib/types";

const FILTERS: (OrderStatus | "all")[] = [
  "all",
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    setLoading(true);
    getAdminOrders(token, filter)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [token, filter]);

  return (
    <div>
      <AdminToolbar title="Orders" subtitle="Manage and fulfil customer orders." />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "rounded-full border px-3.5 py-1.5 text-xs capitalize transition-colors",
              filter === f
                ? "border-gold bg-gold-gradient text-obsidian"
                : "border-line text-ink/70 hover:border-gold hover:text-gold",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <Spinner />
        ) : orders.length === 0 ? (
          <Empty message="No orders in this view." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Items</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-line/50 last:border-0 hover:bg-charcoal/40">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="text-ink hover:text-gold">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">{o.createdAt}</td>
                    <td className="px-4 py-3">
                      <span className="text-ink/70 capitalize">{o.paymentMethod}</span>{" "}
                      <StatusPill status={o.paymentStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-ink/70">{o.itemsCount}</td>
                    <td className="px-4 py-3 text-right font-medium text-ink">{formatBDT(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
