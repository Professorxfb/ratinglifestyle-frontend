"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import { useAuth } from "@/store/auth";
import { getMyOrder, cancelOrder, TRACKING_STEPS } from "@/lib/account";
import { formatBDT } from "@/lib/site";
import type { OrderDetail } from "@/lib/types";
import StatusBadge from "@/components/account/StatusBadge";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const token = useAuth((s) => s.token);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getMyOrder(token, params.id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [token, params.id]);

  if (loading) return <p className="text-muted">Loading order…</p>;
  if (!order) {
    return (
      <div className="rounded-sm border border-line bg-card p-10 text-center">
        <p className="text-muted">Order not found.</p>
        <Link href="/account/orders" className="btn-ghost mt-4">Back to Orders</Link>
      </div>
    );
  }

  const cancelled = order.status === "cancelled" || order.status === "returned";
  const activeStep = TRACKING_STEPS.findIndex((s) => s.key === order.status);
  const canCancel = order.status === "pending" || order.status === "confirmed";

  async function doCancel() {
    if (!order) return;
    setCancelling(true);
    try {
      await cancelOrder(token, order.id);
      setOrder({ ...order, status: "cancelled" });
      toast.success("Order cancelled.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel order.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/account/orders" className="text-xs text-gold hover:opacity-70">← All orders</Link>
          <h2 className="mt-1 font-display text-2xl text-ink">{order.orderNumber}</h2>
          <p className="text-xs text-muted">Placed {order.createdAt}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Tracking stepper */}
      {!cancelled ? (
        <div className="rounded-sm border border-line bg-card p-6">
          <div className="flex items-center justify-between">
            {TRACKING_STEPS.map((step, i) => {
              const done = i <= activeStep;
              return (
                <div key={step.key} className="flex flex-1 flex-col items-center text-center">
                  <div className="flex w-full items-center">
                    <span className={clsx("h-px flex-1", i === 0 ? "bg-transparent" : done ? "bg-gold" : "bg-line")} />
                    <span
                      className={clsx(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs",
                        done ? "border-gold bg-gold text-obsidian" : "border-line text-muted",
                      )}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <span className={clsx("h-px flex-1", i === TRACKING_STEPS.length - 1 ? "bg-transparent" : i < activeStep ? "bg-gold" : "bg-line")} />
                  </div>
                  <span className={clsx("mt-2 text-[11px]", done ? "text-ink" : "text-muted")}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-sm border border-danger/40 bg-card p-5 text-sm text-danger">
          This order was {order.status}.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Items */}
        <div className="divide-y divide-line/50 rounded-sm border border-line">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm text-ink">{item.productName}</p>
                <p className="text-xs text-muted">
                  {[item.color, item.size].filter(Boolean).join(" / ")} × {item.quantity}
                </p>
              </div>
              <span className="text-sm text-gold">{formatBDT(item.subtotal)}</span>
            </div>
          ))}
        </div>

        {/* Summary + shipping */}
        <div className="space-y-6">
          <div className="rounded-sm border border-line bg-card p-5 text-sm">
            <Row label="Subtotal" value={formatBDT(order.subtotal)} />
            {order.discount > 0 && (
              <Row label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`} value={`− ${formatBDT(order.discount)}`} />
            )}
            <Row label="Shipping" value={order.shippingCharge === 0 ? "Free" : formatBDT(order.shippingCharge)} />
            <div className="mt-2 border-t border-line pt-2">
              <div className="flex items-center justify-between">
                <span className="text-ink">Total</span>
                <span className="font-display text-lg text-gold">{formatBDT(order.total)}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">
              Payment: {order.paymentMethod.toUpperCase()} · {order.paymentStatus}
            </p>
          </div>

          <div className="rounded-sm border border-line bg-card p-5 text-sm">
            <p className="mb-2 text-xs uppercase tracking-wide text-gold">Shipping to</p>
            <p className="text-ink">{order.shipping.name}</p>
            <p className="text-muted">{order.shipping.phone}</p>
            <p className="mt-1 text-muted">
              {order.shipping.address}, {order.shipping.city}, {order.shipping.district} {order.shipping.postalCode}
            </p>
          </div>

          {canCancel && (
            <button onClick={doCancel} disabled={cancelling} className="btn-ghost w-full justify-center hover:border-danger hover:text-danger">
              {cancelling ? "Cancelling…" : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
