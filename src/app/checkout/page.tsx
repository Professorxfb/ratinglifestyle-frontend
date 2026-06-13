"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { formatBDT, SITE } from "@/lib/site";
import { placeOrder, type PaymentMethod, type ShippingDetails } from "@/lib/orders";
import PageHeader from "@/components/ui/PageHeader";
import Placeholder from "@/components/ui/Placeholder";

const DISTRICTS = [
  "Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal",
  "Rangpur", "Mymensingh", "Cumilla", "Gazipur", "Narayanganj",
];

const PAYMENTS: { key: PaymentMethod; label: string; note: string }[] = [
  { key: "cod", label: "Cash on Delivery", note: "Pay in cash when your order arrives." },
  { key: "bkash", label: "bKash", note: "Pay securely with bKash." },
  { key: "nagad", label: "Nagad", note: "Pay securely with Nagad." },
  { key: "rocket", label: "Rocket", note: "Pay with Rocket mobile banking." },
  { key: "sslcommerz", label: "Card / SSLCommerz", note: "Visa, Mastercard, net banking." },
  { key: "bank_transfer", label: "Bank Transfer", note: "Transfer to our bank, we confirm manually." },
];

const EMPTY: ShippingDetails = {
  name: "", phone: "", email: "", address: "", city: "", district: "Dhaka", postal_code: "", notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, couponCode, discount, clear } = useCart();
  const subtotal = useCart((s) => s.subtotal());
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => s.token);

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState<ShippingDetails>(EMPTY);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [placing, setPlacing] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Prefill name/phone/email from the signed-in user once on mount.
  useEffect(() => {
    setHydrated(true);
    if (user) {
      setShipping((s) => ({
        ...s,
        name: s.name || user.name || "",
        phone: s.phone || user.phone || "",
        email: s.email || user.email || "",
      }));
    }
  }, [user]);

  const shippingCharge = subtotal === 0 || subtotal >= SITE.freeShippingThreshold ? 0 : 60;
  const total = Math.max(0, subtotal - discount) + shippingCharge;

  // Empty-cart guard (after hydration so SSR doesn't flash).
  if (hydrated && lines.length === 0) {
    return (
      <>
        <PageHeader title="Checkout" crumbs={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />
        <div className="container-luxe flex flex-col items-center gap-6 py-28 text-center">
          <p className="font-serif text-2xl text-muted">Your bag is empty — nothing to check out.</p>
          <Link href="/shop" className="btn-gold">Start Shopping</Link>
        </div>
      </>
    );
  }

  function validShipping(): boolean {
    const required: (keyof ShippingDetails)[] = ["name", "phone", "address", "city", "district"];
    for (const f of required) {
      if (!String(shipping[f] ?? "").trim()) {
        toast.error("Please complete all required shipping fields.");
        return false;
      }
    }
    if (!/^01[0-9]{9}$/.test(shipping.phone.replace(/[\s-]/g, ""))) {
      toast.error("Enter a valid Bangladeshi phone number (e.g. 017XXXXXXXX).");
      return false;
    }
    return true;
  }

  function next() {
    if (step === 1 && !validShipping()) return;
    setStep((s) => Math.min(3, s + 1));
  }

  async function submit() {
    setPlacing(true);
    try {
      const result = await placeOrder(lines, shipping, payment, couponCode, token ?? undefined);
      clear();
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl; // hosted gateway
        return;
      }
      router.push(`/checkout/success?order=${encodeURIComponent(result.orderNumber)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not place order. Please try again.");
      router.push("/checkout/failed");
    } finally {
      setPlacing(false);
    }
  }

  const set = (k: keyof ShippingDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setShipping((s) => ({ ...s, [k]: e.target.value }));

  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <div className="container-luxe grid grid-cols-1 gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          {/* Stepper */}
          <div className="mb-10 flex items-center gap-2">
            {["Shipping", "Payment", "Review"].map((label, i) => {
              const n = i + 1;
              return (
                <div key={label} className="flex flex-1 items-center gap-2">
                  <span
                    className={clsx(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm",
                      step >= n ? "border-gold bg-gold text-obsidian" : "border-line text-muted",
                    )}
                  >
                    {n}
                  </span>
                  <span className={clsx("text-sm", step >= n ? "text-ink" : "text-muted")}>{label}</span>
                  {n < 3 && <span className="mx-2 h-px flex-1 bg-line" />}
                </div>
              );
            })}
          </div>

          {/* Step 1 — Shipping */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-ink">Shipping Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name *"><input className={inputCls} value={shipping.name} onChange={set("name")} /></Field>
                <Field label="Phone *"><input className={inputCls} placeholder="017XXXXXXXX" value={shipping.phone} onChange={set("phone")} /></Field>
                <Field label="Email"><input type="email" className={inputCls} value={shipping.email} onChange={set("email")} /></Field>
                <Field label="City / Area *"><input className={inputCls} value={shipping.city} onChange={set("city")} /></Field>
                <Field label="District *">
                  <select className={inputCls} value={shipping.district} onChange={set("district")}>
                    {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Postal Code"><input className={inputCls} value={shipping.postal_code} onChange={set("postal_code")} /></Field>
              </div>
              <Field label="Full Address *"><input className={inputCls} value={shipping.address} onChange={set("address")} /></Field>
              <Field label="Order Notes"><textarea rows={3} className={inputCls} value={shipping.notes} onChange={set("notes")} /></Field>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-ink">Payment Method</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PAYMENTS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPayment(p.key)}
                    className={clsx(
                      "flex flex-col items-start gap-1 rounded-sm border p-4 text-left transition-colors",
                      payment === p.key ? "border-gold bg-card" : "border-line hover:border-gold/50",
                    )}
                  >
                    <span className="font-serif text-ink">{p.label}</span>
                    <span className="text-xs text-muted">{p.note}</span>
                  </button>
                ))}
              </div>
              {payment === "bank_transfer" && (
                <div className="rounded-sm border border-line bg-card p-4 text-sm text-muted">
                  <p className="mb-1 text-ink">Bank details</p>
                  <p>Bank: City Bank • A/C: Rupkotha Trendz • A/C No: 1234567890123 • Branch: Banani</p>
                  <p className="mt-1">Use your order number as the transfer reference.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-ink">Review Your Order</h2>
              <div className="rounded-sm border border-line bg-card p-5 text-sm">
                <p className="text-ink">{shipping.name} · {shipping.phone}</p>
                <p className="mt-1 text-muted">{shipping.address}, {shipping.city}, {shipping.district} {shipping.postal_code}</p>
                {shipping.email && <p className="text-muted">{shipping.email}</p>}
                <p className="mt-2 text-gold">Payment: {PAYMENTS.find((p) => p.key === payment)?.label}</p>
              </div>
              <div className="divide-y divide-line/50 rounded-sm border border-line">
                {lines.map((l) => (
                  <div key={l.key} className="flex items-center gap-3 p-3">
                    <div className="h-14 w-12 overflow-hidden rounded-sm"><Placeholder seed={l.productId} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{l.name}</p>
                      <p className="text-xs text-muted">{[l.color, l.size].filter(Boolean).join(" / ")} × {l.quantity}</p>
                    </div>
                    <span className="text-sm text-gold">{formatBDT(l.unitPrice * l.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <button onClick={() => setStep((s) => s - 1)} className="btn-ghost">← Back</button>
            ) : (
              <Link href="/cart" className="btn-ghost">← Back to Bag</Link>
            )}
            {step < 3 ? (
              <button onClick={next} className="btn-gold">Continue</button>
            ) : (
              <button onClick={submit} disabled={placing} className="btn-gold">
                {placing ? "Placing Order…" : "Place Order"}
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-sm border border-line bg-card p-6 lg:sticky lg:top-32">
          <h2 className="font-display text-xl text-ink">Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <SummaryRow label={`Subtotal (${lines.length} items)`} value={formatBDT(subtotal)} />
            {discount > 0 && <SummaryRow label={`Discount (${couponCode})`} value={`− ${formatBDT(discount)}`} accent />}
            <SummaryRow label="Shipping" value={shippingCharge === 0 ? "Free" : formatBDT(shippingCharge)} />
            <div className="border-t border-line pt-3">
              <div className="flex items-center justify-between">
                <span className="text-ink">Total</span>
                <span className="font-display text-xl text-gold">{formatBDT(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

const inputCls =
  "w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-gold focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={accent ? "text-success" : "text-ink"}>{value}</span>
    </div>
  );
}
