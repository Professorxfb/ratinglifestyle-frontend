"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart } from "@/store/cart";
import { formatBDT, SITE } from "@/lib/site";
import Placeholder from "@/components/ui/Placeholder";
import PageHeader from "@/components/ui/PageHeader";

export default function CartPage() {
  const { lines, updateQuantity, removeLine, couponCode, discount, applyCoupon, clearCoupon } =
    useCart();
  const subtotal = useCart((s) => s.subtotal());
  const [code, setCode] = useState("");

  const shipping = subtotal === 0 || subtotal >= SITE.freeShippingThreshold ? 0 : 60;
  const total = Math.max(0, subtotal - discount) + shipping;

  function handleCoupon(e: React.FormEvent) {
    e.preventDefault();
    const res = applyCoupon(code);
    if (res.ok) toast.success(res.message);
    else toast.error(res.message);
  }

  if (lines.length === 0) {
    return (
      <>
        <PageHeader title="Your Bag" crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <div className="container-luxe flex flex-col items-center gap-6 py-28 text-center">
          <p className="font-serif text-2xl text-muted">Your bag is currently empty.</p>
          <Link href="/shop" className="btn-gold">
            Start Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Your Bag" crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <div className="container-luxe grid grid-cols-1 gap-10 py-12 lg:grid-cols-[1fr_380px]">
        {/* Lines */}
        <div>
          <div className="hidden border-b border-line pb-3 text-xs uppercase tracking-wide text-muted sm:grid sm:grid-cols-[1fr_120px_120px]">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
          </div>

          {lines.map((line) => (
            <div
              key={line.key}
              className="grid grid-cols-1 gap-4 border-b border-line/50 py-6 sm:grid-cols-[1fr_120px_120px] sm:items-center"
            >
              <div className="flex gap-4">
                <Link
                  href={`/product/${line.slug}`}
                  className="h-28 w-24 shrink-0 overflow-hidden rounded-sm"
                >
                  <Placeholder seed={line.productId} />
                </Link>
                <div className="flex flex-col">
                  <Link
                    href={`/product/${line.slug}`}
                    className="font-serif text-ink hover:text-gold"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    {[line.color, line.size].filter(Boolean).join(" / ")}
                  </p>
                  <p className="mt-1 text-sm text-gold">{formatBDT(line.unitPrice)}</p>
                  <button
                    onClick={() => removeLine(line.key)}
                    className="mt-2 w-fit text-xs text-muted hover:text-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center border border-line">
                  <button
                    onClick={() => updateQuantity(line.key, line.quantity - 1)}
                    className="px-3 py-2 text-ink/70 hover:text-gold"
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center text-sm text-ink">{line.quantity}</span>
                  <button
                    onClick={() => updateQuantity(line.key, line.quantity + 1)}
                    className="px-3 py-2 text-ink/70 hover:text-gold"
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              </div>

              <span className="text-right text-gold sm:text-base">
                {formatBDT(line.unitPrice * line.quantity)}
              </span>
            </div>
          ))}

          <Link href="/shop" className="mt-8 inline-block text-sm text-gold hover:opacity-70">
            ← Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-sm border border-line bg-card p-6 lg:sticky lg:top-32">
          <h2 className="font-display text-xl text-ink">Order Summary</h2>

          {/* Coupon */}
          <form onSubmit={handleCoupon} className="mt-5">
            {couponCode ? (
              <div className="flex items-center justify-between rounded-sm border border-gold/40 bg-obsidian px-3 py-2.5 text-sm">
                <span className="text-gold">{couponCode} applied</span>
                <button
                  type="button"
                  onClick={() => {
                    clearCoupon();
                    toast("Coupon removed");
                  }}
                  className="text-muted hover:text-danger"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Coupon code (try WELCOME10)"
                  className="w-full border border-line bg-obsidian px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-gold focus:outline-none"
                />
                <button type="submit" className="bg-gold-gradient px-4 text-sm font-semibold text-obsidian">
                  Apply
                </button>
              </div>
            )}
          </form>

          <div className="mt-6 space-y-3 text-sm">
            <Row label="Subtotal" value={formatBDT(subtotal)} />
            {discount > 0 && (
              <Row label="Discount" value={`− ${formatBDT(discount)}`} accent="success" />
            )}
            <Row
              label="Shipping"
              value={shipping === 0 ? "Free" : formatBDT(shipping)}
            />
            <div className="border-t border-line pt-3">
              <Row label="Total" value={formatBDT(total)} large />
            </div>
          </div>

          <Link href="/checkout" className="btn-gold mt-6 w-full">
            Proceed to Checkout
          </Link>
          <p className="mt-3 text-center text-xs text-muted">
            Secure checkout · bKash · Nagad · COD
          </p>
        </aside>
      </div>
    </>
  );
}

function Row({
  label,
  value,
  large,
  accent,
}: {
  label: string;
  value: string;
  large?: boolean;
  accent?: "success";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={large ? "text-ink" : "text-muted"}>{label}</span>
      <span
        className={
          large
            ? "font-display text-xl text-gold"
            : accent === "success"
              ? "text-success"
              : "text-ink"
        }
      >
        {value}
      </span>
    </div>
  );
}
