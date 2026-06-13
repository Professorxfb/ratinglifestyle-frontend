"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  couponCode: string | null;
  discount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addLine: (line: Omit<CartLine, "key" | "quantity">, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  clearCoupon: () => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

function lineKey(productId: number, color: string | null, size: string | null) {
  return `${productId}::${color ?? "-"}::${size ?? "-"}`;
}

// Demo coupons — in production validated server-side via /api/cart/coupon
const COUPONS: Record<string, { type: "percentage" | "fixed"; value: number }> = {
  WELCOME10: { type: "percentage", value: 10 },
  FLAT200: { type: "fixed", value: 200 },
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      couponCode: null,
      discount: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addLine: (line, quantity = 1) => {
        const key = lineKey(line.productId, line.color, line.size);
        set((s) => {
          const existing = s.lines.find((l) => l.key === key);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.key === key ? { ...l, quantity: l.quantity + quantity } : l,
              ),
              isOpen: true,
            };
          }
          return { lines: [...s.lines, { ...line, key, quantity }], isOpen: true };
        });
      },

      updateQuantity: (key, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.key !== key)
              : s.lines.map((l) => (l.key === key ? { ...l, quantity } : l)),
        })),

      removeLine: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),

      applyCoupon: (code) => {
        const normalized = code.trim().toUpperCase();
        const coupon = COUPONS[normalized];
        if (!coupon) {
          set({ couponCode: null, discount: 0 });
          return { ok: false, message: "Invalid or expired coupon code." };
        }
        const sub = get().subtotal();
        const discount =
          coupon.type === "percentage"
            ? Math.round((sub * coupon.value) / 100)
            : coupon.value;
        set({ couponCode: normalized, discount });
        return { ok: true, message: `Coupon ${normalized} applied!` };
      },

      clearCoupon: () => set({ couponCode: null, discount: 0 }),
      clear: () => set({ lines: [], couponCode: null, discount: 0 }),

      subtotal: () => get().lines.reduce((t, l) => t + l.unitPrice * l.quantity, 0),
      itemCount: () => get().lines.reduce((t, l) => t + l.quantity, 0),
    }),
    { name: "rt-cart" },
  ),
);
