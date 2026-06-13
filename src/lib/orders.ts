"use client";

// Order submission. Uses the live API when configured, otherwise simulates a
// successful order so the checkout flow is demonstrable without a backend.
//
// NOTE: the backend's POST /api/orders sits behind auth:sanctum. Real submission
// therefore needs a Sanctum token (pass `token`). Guest checkout would require
// either an auth step (login/register pages — a later milestone) or moving the
// route out of the auth group on the backend.

import { apiSend, useApi } from "./http";
import type { CartLine } from "./types";

export interface ShippingDetails {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  postal_code?: string;
  notes?: string;
}

export type PaymentMethod =
  | "cod"
  | "bkash"
  | "nagad"
  | "rocket"
  | "sslcommerz"
  | "bank_transfer";

export interface PlaceOrderResult {
  orderNumber: string;
  requiresPayment: boolean;
  redirectUrl?: string | null;
}

export async function placeOrder(
  lines: CartLine[],
  shipping: ShippingDetails,
  paymentMethod: PaymentMethod,
  couponCode: string | null,
  token?: string,
): Promise<PlaceOrderResult> {
  const items = lines.map((l) => ({
    product_id: l.productId,
    variant_id: l.variantId ?? null,
    quantity: l.quantity,
  }));

  if (!useApi) {
    // Simulated success (no backend configured).
    const rand = Math.abs(lines.reduce((a, l) => a + l.productId * l.quantity, 7)) % 100000;
    return {
      orderNumber: `RT-DEMO-${String(rand).padStart(5, "0")}`,
      requiresPayment: paymentMethod !== "cod" && paymentMethod !== "bank_transfer",
    };
  }

  const res = await apiSend<{
    order: { order_number: string };
    requires_payment: boolean;
  }>("POST", "/orders", { items, shipping, payment_method: paymentMethod, coupon_code: couponCode }, { token });

  let redirectUrl: string | null = null;
  if (res.requires_payment) {
    const pay = await apiSend<{ redirect_url?: string | null }>(
      "POST",
      "/payment/initiate",
      { order_number: res.order.order_number },
      { token },
    );
    redirectUrl = pay.redirect_url ?? null;
  }

  return {
    orderNumber: res.order.order_number,
    requiresPayment: res.requires_payment,
    redirectUrl,
  };
}
