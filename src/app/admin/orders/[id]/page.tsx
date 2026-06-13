"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import { getAdminOrder, updateOrderStatus } from "@/lib/admin-api";
import { formatBDT } from "@/lib/site";
import { Card, Spinner, StatusPill, Field, inputClass } from "@/components/admin/ui";
import type { OrderDetail, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { token } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminOrder(Number(params.id), token)
      .then((o) => {
        setOrder(o);
        if (o) setStatus(o.status);
      })
      .finally(() => setLoading(false));
  }, [params.id, token]);

  async function save() {
    if (!order) return;
    setSaving(true);
    try {
      await updateOrderStatus(order.id, status, token);
      setOrder({ ...order, status });
      toast.success("Order status updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;
  if (!order)
    return (
      <div>
        <p className="text-sm text-rose-300">Order not found.</p>
        <Link href="/admin/orders" className="mt-4 inline-block text-xs text-gold">
          ← Back to orders
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl">
      <Link href="/admin/orders" className="text-xs text-gold hover:opacity-70">
        ← Back to orders
      </Link>
      <div className="mt-3 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted">Placed {order.createdAt}</p>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Items + totals */}
        <div className="space-y-6">
          <Card className="p-5">
            <p className="mb-4 text-sm font-medium text-ink">Items</p>
            <table className="w-full text-sm">
              <tbody>
                {order.items.map((it, i) => (
                  <tr key={i} className="border-b border-line/50 last:border-0">
                    <td className="py-2.5 text-ink">
                      {it.productName}
                      <span className="text-muted">
                        {it.color ? ` · ${it.color}` : ""}
                        {it.size ? ` · ${it.size}` : ""}
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-muted">×{it.quantity}</td>
                    <td className="py-2.5 text-right text-ink">{formatBDT(it.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <Row label="Subtotal" value={formatBDT(order.subtotal)} />
              {order.discount > 0 && (
                <Row label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`} value={`− ${formatBDT(order.discount)}`} />
              )}
              <Row label="Shipping" value={formatBDT(order.shippingCharge)} />
              <div className="flex justify-between border-t border-line pt-2 font-medium text-ink">
                <span>Total</span>
                <span className="text-gold">{formatBDT(order.total)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar: status + customer */}
        <div className="space-y-6">
          <Card className="p-5">
            <p className="mb-3 text-sm font-medium text-ink">Update Status</p>
            <Field label="Order status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <button
              onClick={save}
              disabled={saving || status === order.status}
              className="btn-gold mt-4 w-full py-2.5 text-xs"
            >
              {saving ? "Saving…" : "Save Status"}
            </button>
          </Card>

          <Card className="p-5 text-sm">
            <p className="mb-3 font-medium text-ink">Payment</p>
            <p className="capitalize text-ink/70">
              {order.paymentMethod} · <StatusPill status={order.paymentStatus} />
            </p>
          </Card>

          <Card className="p-5 text-sm">
            <p className="mb-3 font-medium text-ink">Shipping to</p>
            <div className="space-y-1 text-ink/70">
              <p className="text-ink">{order.shipping.name}</p>
              <p>{order.shipping.phone}</p>
              {order.shipping.email && <p>{order.shipping.email}</p>}
              <p>
                {order.shipping.address}, {order.shipping.city}, {order.shipping.district}
                {order.shipping.postalCode ? ` - ${order.shipping.postalCode}` : ""}
              </p>
              {order.shipping.notes && <p className="text-muted">Note: {order.shipping.notes}</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-ink/70">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
