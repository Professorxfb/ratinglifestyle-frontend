"use client";

// Account data — orders & notifications. Live API when configured, mock otherwise.
// Mock orders are deterministic demo data so the dashboard, history, and tracking
// stepper are fully explorable without a backend.

import { apiGet, apiSend, useApi } from "./http";
import type { OrderDetail, OrderSummary, OrderStatus, UserNotification } from "./types";

// ── Mock demo data ───────────────────────────────────────────────────────────
const DEMO_ORDERS: OrderDetail[] = [
  {
    id: 1001,
    orderNumber: "RT-260512-A1B2C",
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "bkash",
    total: 3270,
    itemsCount: 2,
    createdAt: "2026-05-12",
    subtotal: 3330,
    discount: 120,
    shippingCharge: 60,
    couponCode: "WELCOME10",
    items: [
      { productName: "Imperial Oxford Shirt", color: "Navy", size: "L", quantity: 1, unitPrice: 1990, subtotal: 1990 },
      { productName: "Heritage Polo Tee", color: "Ivory", size: "M", quantity: 1, unitPrice: 1340, subtotal: 1340 },
    ],
    shipping: {
      name: "Demo Customer", phone: "01712345678", email: "demo@rupkothatrendz.com",
      address: "House 12, Road 7, Banani", city: "Banani", district: "Dhaka",
      postalCode: "1213", notes: null,
    },
  },
  {
    id: 1000,
    orderNumber: "RT-260403-X9Y8Z",
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "cod",
    total: 2100,
    itemsCount: 1,
    createdAt: "2026-04-03",
    subtotal: 2040,
    discount: 0,
    shippingCharge: 60,
    couponCode: null,
    items: [
      { productName: "Midnight Selvedge Jeans", color: "Obsidian", size: "32", quantity: 1, unitPrice: 2040, subtotal: 2040 },
    ],
    shipping: {
      name: "Demo Customer", phone: "01712345678", email: "demo@rupkothatrendz.com",
      address: "House 12, Road 7, Banani", city: "Banani", district: "Dhaka",
      postalCode: "1213", notes: "Leave at reception.",
    },
  },
];

// ── Mappers (snake_case API model -> camelCase types) ──────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
function mapSummary(o: any): OrderSummary {
  return {
    id: o.id,
    orderNumber: o.order_number,
    status: o.status,
    paymentStatus: o.payment_status,
    paymentMethod: o.payment_method,
    total: Number(o.total_amount),
    itemsCount: o.items_count ?? o.items?.length ?? 0,
    createdAt: (o.created_at ?? "").slice(0, 10),
  };
}

function mapDetail(o: any): OrderDetail {
  return {
    ...mapSummary(o),
    subtotal: Number(o.subtotal),
    discount: Number(o.discount_amount),
    shippingCharge: Number(o.shipping_charge),
    couponCode: o.coupon_code ?? null,
    items: (o.items ?? []).map((i: any) => ({
      productName: i.product_name,
      color: i.color,
      size: i.size,
      quantity: i.quantity,
      unitPrice: Number(i.unit_price),
      subtotal: Number(i.subtotal),
    })),
    shipping: {
      name: o.shipping_name, phone: o.shipping_phone, email: o.shipping_email,
      address: o.shipping_address, city: o.shipping_city, district: o.shipping_district,
      postalCode: o.shipping_postal_code, notes: o.shipping_notes,
    },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getMyOrders(token: string | null): Promise<OrderSummary[]> {
  if (!useApi || !token) return DEMO_ORDERS.map((o) => o);
  const res = await apiGet<{ data: unknown[] }>("/orders", { token });
  return res.data.map(mapSummary);
}

export async function getMyOrder(
  token: string | null,
  orderNumber: string,
): Promise<OrderDetail | null> {
  if (!useApi || !token) return DEMO_ORDERS.find((o) => o.orderNumber === orderNumber) ?? null;
  try {
    const res = await apiGet<{ data: unknown }>(`/orders/${orderNumber}`, { token });
    return mapDetail(res.data);
  } catch {
    return null;
  }
}

export async function cancelOrder(token: string | null, id: number): Promise<void> {
  if (!useApi || !token) return;
  await apiSend("POST", `/orders/${id}/cancel`, undefined, { token });
}

export async function getNotifications(token: string | null): Promise<UserNotification[]> {
  if (!useApi || !token) {
    return [
      { id: 1, title: "Order shipped", body: "Your order RT-260512-A1B2C is on its way.", type: "order_status", readAt: null, createdAt: "2026-05-14" },
      { id: 2, title: "Welcome to Rupkotha Trendz", body: "Use WELCOME10 for 10% off your first order.", type: "general", readAt: "2026-05-01", createdAt: "2026-05-01" },
    ];
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const res = await apiGet<{ data: any[] }>("/notifications", { token });
  return res.data.map((n: any) => ({
    id: n.id, title: n.title, body: n.body, type: n.type,
    readAt: n.read_at, createdAt: (n.created_at ?? "").slice(0, 10),
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

// Visual tracking steps for the order tracking stepper.
export const TRACKING_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];
