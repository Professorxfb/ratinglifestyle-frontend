"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { getDashboard } from "@/lib/admin-api";
import { formatBDT } from "@/lib/site";
import { Card, Spinner, StatusPill } from "@/components/admin/ui";
import type { DashboardData } from "@/lib/types";

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-2 font-display text-2xl ${accent ? "text-gold" : "text-ink"}`}>{value}</p>
    </Card>
  );
}

function RevenueChart({ data }: { data: DashboardData["chart"] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <Card className="p-5">
      <p className="mb-5 text-sm font-medium text-ink">Revenue · last 12 months</p>
      <div className="flex h-44 items-end gap-1.5">
        {data.map((d) => (
          <div key={d.month} className="group flex flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[9px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
              {Math.round(d.revenue / 1000)}k
            </span>
            <div
              className="w-full rounded-t-sm bg-gold-gradient transition-all hover:brightness-110"
              style={{ height: `${Math.max((d.revenue / max) * 100, 2)}%` }}
              title={`${d.month}: ${formatBDT(d.revenue)} · ${d.orders} orders`}
            />
            <span className="text-[9px] text-muted">{d.month.slice(5)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard(token)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Spinner />;
  if (!data) return <p className="text-sm text-rose-300">Failed to load dashboard.</p>;

  const { stats } = data;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-ink">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Revenue (mo)" value={formatBDT(stats.revenueThisMonth)} accent />
        <StatCard label="Total Orders" value={stats.ordersTotal.toLocaleString()} />
        <StatCard label="Pending" value={String(stats.ordersPending)} />
        <StatCard label="Products" value={String(stats.productsTotal)} />
        <StatCard label="Low Stock" value={String(stats.productsLowStock)} />
        <StatCard label="Customers" value={stats.customersTotal.toLocaleString()} />
      </div>

      {/* Chart */}
      <RevenueChart data={data.chart} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Recent Orders</p>
            <Link href="/admin/orders" className="text-xs text-gold hover:opacity-70">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-line/50 last:border-0">
                    <td className="py-2.5">
                      <Link href={`/admin/orders/${o.id}`} className="text-ink hover:text-gold">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-2.5">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="py-2.5 text-right font-medium text-ink">{formatBDT(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top products */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Top Products</p>
            <Link href="/admin/products" className="text-xs text-gold hover:opacity-70">
              Manage →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="py-2">Product</th>
                  <th className="py-2 text-right">Sold</th>
                  <th className="py-2 text-right">Stock</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((p) => (
                  <tr key={p.id} className="border-b border-line/50 last:border-0 text-ink/80">
                    <td className="py-2.5 text-ink">{p.name}</td>
                    <td className="py-2.5 text-right">{p.soldCount}</td>
                    <td className={`py-2.5 text-right ${p.stockQuantity <= 5 ? "text-rose-300" : ""}`}>
                      {p.stockQuantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
