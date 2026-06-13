"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DATA ACCESS LAYER
// Mirrors the storefront data layer pattern: every function calls the live
// Laravel admin API (prefix /admin, behind auth:sanctum + admin middleware) when
// NEXT_PUBLIC_API_URL is set, and otherwise serves in-memory mock data so the
// admin panel is fully explorable without a backend. Mock mutations persist for
// the lifetime of the tab so create/edit/delete feel real during a demo.
// ─────────────────────────────────────────────────────────────────────────────

import { apiGet, apiSend, useApi } from "./http";
import { products as mockProducts, categories as mockCategories, banners as mockBanners } from "./mock-data";
import { SITE } from "./site";
import type {
  Product,
  Category,
  Banner,
  Coupon,
  AdminUserRow,
  AdminReviewRow,
  DashboardData,
  OrderDetail,
  OrderSummary,
  OrderStatus,
  SiteSettings,
} from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Mock stores (mutable for the session) ───────────────────────────────────
let _products: Product[] = [...mockProducts];
let _categories: Category[] = mockCategories.flatMap((c) => [c, ...(c.subcategories ?? [])]);
let _banners: Banner[] = [...mockBanners];

let _coupons: Coupon[] = [
  { id: 1, code: "WELCOME10", type: "percentage", value: 10, minOrderAmount: 0, maxDiscount: 500, usageLimit: null, usedCount: 312, expiresAt: "2026-12-31", isActive: true },
  { id: 2, code: "FLAT200", type: "fixed", value: 200, minOrderAmount: 2000, maxDiscount: null, usageLimit: 1000, usedCount: 148, expiresAt: "2026-09-30", isActive: true },
  { id: 3, code: "EID25", type: "percentage", value: 25, minOrderAmount: 3000, maxDiscount: 1500, usageLimit: 500, usedCount: 500, expiresAt: "2026-04-15", isActive: false },
];

const _users: AdminUserRow[] = [
  { id: 1, name: "Admin", email: "admin@rupkothatrendz.com", phone: "01700000000", role: "admin", ordersCount: 0, totalSpent: 0, isActive: true, createdAt: "2026-01-01" },
  { id: 2, name: "Rifat Ahmed", email: "rifat@example.com", phone: "01711111111", role: "customer", ordersCount: 7, totalSpent: 18650, isActive: true, createdAt: "2026-02-14" },
  { id: 3, name: "Nusrat Jahan", email: "nusrat@example.com", phone: "01722222222", role: "customer", ordersCount: 3, totalSpent: 9120, isActive: true, createdAt: "2026-03-02" },
  { id: 4, name: "Tanvir Hasan", email: "tanvir@example.com", phone: "01733333333", role: "moderator", ordersCount: 1, totalSpent: 2100, isActive: true, createdAt: "2026-03-20" },
  { id: 5, name: "Sadia Islam", email: "sadia@example.com", phone: "01744444444", role: "customer", ordersCount: 12, totalSpent: 34200, isActive: false, createdAt: "2026-01-19" },
];

let _reviews: AdminReviewRow[] = [
  { id: 1, userName: "Rifat Ahmed", productName: mockProducts[0]?.name ?? "Product", productSlug: mockProducts[0]?.slug ?? "#", rating: 5, title: "Excellent quality", body: "Fabric feels premium and the fit is perfect.", isApproved: true, createdAt: "2026-05-28" },
  { id: 2, userName: "Nusrat Jahan", productName: mockProducts[1]?.name ?? "Product", productSlug: mockProducts[1]?.slug ?? "#", rating: 4, title: "Looks great", body: "Colour is slightly different but still lovely.", isApproved: false, createdAt: "2026-06-01" },
  { id: 3, userName: "Sadia Islam", productName: mockProducts[2]?.name ?? "Product", productSlug: mockProducts[2]?.slug ?? "#", rating: 2, title: "Sizing runs small", body: "Had to exchange for a larger size.", isApproved: false, createdAt: "2026-06-08" },
];

const MOCK_ORDERS: OrderDetail[] = Array.from({ length: 14 }).map((_, i) => {
  const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  const status = statuses[i % statuses.length];
  const total = 1200 + i * 430;
  return {
    id: 2000 - i,
    orderNumber: `RT-2606${String(20 - i).padStart(2, "0")}-${String.fromCharCode(65 + (i % 26))}${1000 + i}`,
    status,
    paymentStatus: status === "cancelled" ? "failed" : i % 3 === 0 ? "pending" : "paid",
    paymentMethod: ["bkash", "nagad", "cod", "sslcommerz"][i % 4],
    total,
    itemsCount: (i % 3) + 1,
    createdAt: `2026-06-${String(13 - (i % 13)).padStart(2, "0")}`,
    subtotal: total - 60,
    discount: i % 4 === 0 ? 200 : 0,
    shippingCharge: 60,
    couponCode: i % 4 === 0 ? "FLAT200" : null,
    items: [
      { productName: mockProducts[i % mockProducts.length]?.name ?? "Product", color: "Navy", size: "L", quantity: 1, unitPrice: total - 60, subtotal: total - 60 },
    ],
    shipping: {
      name: _users[(i % 4) + 1]?.name ?? "Customer",
      phone: "01712345678",
      email: "customer@example.com",
      address: "House 12, Road 7, Banani",
      city: "Banani",
      district: "Dhaka",
      postalCode: "1213",
      notes: i % 5 === 0 ? "Please call before delivery." : null,
    },
  };
});

const MOCK_CHART = [
  { month: "2025-07", revenue: 142000, orders: 84 },
  { month: "2025-08", revenue: 168500, orders: 96 },
  { month: "2025-09", revenue: 155200, orders: 90 },
  { month: "2025-10", revenue: 198400, orders: 112 },
  { month: "2025-11", revenue: 245900, orders: 138 },
  { month: "2025-12", revenue: 312700, orders: 176 },
  { month: "2026-01", revenue: 221300, orders: 124 },
  { month: "2026-02", revenue: 264800, orders: 149 },
  { month: "2026-03", revenue: 289100, orders: 161 },
  { month: "2026-04", revenue: 198600, orders: 109 },
  { month: "2026-05", revenue: 301450, orders: 168 },
  { month: "2026-06", revenue: 132900, orders: 71 },
];

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((r) => setTimeout(() => r(value), ms));
}

function nextId(rows: { id: number }[]): number {
  return rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export async function getDashboard(token: string | null): Promise<DashboardData> {
  if (!useApi) {
    return delay({
      stats: {
        revenueThisMonth: MOCK_CHART[MOCK_CHART.length - 1].revenue,
        ordersTotal: 1284,
        ordersPending: MOCK_ORDERS.filter((o) => o.status === "pending").length,
        productsTotal: _products.length,
        productsLowStock: _products.filter((p) => p.stockQuantity <= p.lowStockThreshold).length,
        customersTotal: _users.filter((u) => u.role === "customer").length,
      },
      chart: MOCK_CHART,
      recentOrders: MOCK_ORDERS.slice(0, 8).map(toSummary),
      topProducts: [..._products]
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, 5)
        .map((p) => ({ id: p.id, name: p.name, soldCount: p.soldCount, stockQuantity: p.stockQuantity })),
    });
  }
  const [dash, chart] = await Promise.all([
    apiGet<any>("/admin/dashboard", { token: token ?? undefined }),
    apiGet<{ data: any[] }>("/admin/dashboard/chart", { token: token ?? undefined }),
  ]);
  return {
    stats: {
      revenueThisMonth: dash.stats.revenue_this_month,
      ordersTotal: dash.stats.orders_total,
      ordersPending: dash.stats.orders_pending,
      productsTotal: dash.stats.products_total,
      productsLowStock: dash.stats.products_low_stock,
      customersTotal: dash.stats.customers_total,
    },
    chart: chart.data.map((r) => ({ month: r.month, revenue: Number(r.revenue), orders: Number(r.orders) })),
    recentOrders: (dash.recent_orders ?? []).map(mapOrderSummary),
    topProducts: (dash.top_products ?? []).map((p: any) => ({
      id: p.id, name: p.name, soldCount: p.sold_count, stockQuantity: p.stock_quantity,
    })),
  };
}

function toSummary(o: OrderDetail): OrderSummary {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    total: o.total,
    itemsCount: o.itemsCount,
    createdAt: o.createdAt,
  };
}

function mapOrderSummary(o: any): OrderSummary {
  return {
    id: o.id,
    orderNumber: o.order_number ?? o.orderNumber,
    status: o.status,
    paymentStatus: o.payment_status ?? o.paymentStatus,
    paymentMethod: o.payment_method ?? o.paymentMethod,
    total: Number(o.total_amount ?? o.total ?? 0),
    itemsCount: o.items_count ?? o.itemsCount ?? 0,
    createdAt: o.created_at ?? o.createdAt,
  };
}

// ── Products ─────────────────────────────────────────────────────────────────
export async function getAdminProducts(token: string | null): Promise<Product[]> {
  if (!useApi) return delay(_products);
  const res = await apiGet<{ data: Product[] }>("/admin/products", { params: { per_page: 100 }, token: token ?? undefined });
  return res.data;
}

export async function getAdminProduct(id: number, token: string | null): Promise<Product | null> {
  if (!useApi) return delay(_products.find((p) => p.id === id) ?? null);
  try {
    const res = await apiGet<{ data: Product }>(`/admin/products/${id}`, { token: token ?? undefined });
    return res.data;
  } catch {
    return null;
  }
}

export interface ProductInput {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  basePrice: number;
  salePrice: number | null;
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isHotDeal: boolean;
}

export async function saveProduct(input: ProductInput, id: number | null, token: string | null): Promise<Product> {
  if (!useApi) {
    const cat = _categories.find((c) => c.slug === input.categorySlug);
    if (id) {
      const idx = _products.findIndex((p) => p.id === id);
      const updated = { ..._products[idx], ...input, categoryName: cat?.name ?? _products[idx].categoryName };
      _products[idx] = updated as Product;
      return delay(updated as Product);
    }
    const created: Product = {
      id: nextId(_products),
      ...input,
      categoryName: cat?.name ?? "Uncategorised",
      badge: null,
      material: "",
      careInstructions: "",
      brand: SITE.name,
      rating: 0,
      reviewsCount: 0,
      soldCount: 0,
      images: [],
      variants: [],
    };
    _products = [created, ..._products];
    return delay(created);
  }
  const body = {
    name: input.name, slug: input.slug, short_description: input.shortDescription, description: input.description,
    category_slug: input.categorySlug, base_price: input.basePrice, sale_price: input.salePrice, sku: input.sku,
    stock_quantity: input.stockQuantity, low_stock_threshold: input.lowStockThreshold,
    is_featured: input.isFeatured, is_new_arrival: input.isNewArrival, is_best_seller: input.isBestSeller, is_hot_deal: input.isHotDeal,
  };
  const res = await apiSend<{ data: Product }>(id ? "PUT" : "POST", id ? `/admin/products/${id}` : "/admin/products", body, { token: token ?? undefined });
  return res.data;
}

export async function deleteProduct(id: number, token: string | null): Promise<void> {
  if (!useApi) {
    _products = _products.filter((p) => p.id !== id);
    await delay(null);
    return;
  }
  await apiSend("DELETE", `/admin/products/${id}`, undefined, { token: token ?? undefined });
}

// ── Orders ───────────────────────────────────────────────────────────────────
export async function getAdminOrders(token: string | null, status?: OrderStatus | "all"): Promise<OrderSummary[]> {
  if (!useApi) {
    const list = status && status !== "all" ? MOCK_ORDERS.filter((o) => o.status === status) : MOCK_ORDERS;
    return delay(list.map(toSummary));
  }
  const res = await apiGet<{ data: any[] }>("/admin/orders", {
    params: { status: status && status !== "all" ? status : undefined, per_page: 100 },
    token: token ?? undefined,
  });
  return res.data.map(mapOrderSummary);
}

export async function getAdminOrder(id: number, token: string | null): Promise<OrderDetail | null> {
  if (!useApi) return delay(MOCK_ORDERS.find((o) => o.id === id) ?? null);
  try {
    const res = await apiGet<{ data: any }>(`/admin/orders/${id}`, { token: token ?? undefined });
    return res.data as OrderDetail;
  } catch {
    return null;
  }
}

export async function updateOrderStatus(id: number, status: OrderStatus, token: string | null): Promise<void> {
  if (!useApi) {
    const o = MOCK_ORDERS.find((x) => x.id === id);
    if (o) o.status = status;
    await delay(null);
    return;
  }
  await apiSend("PUT", `/admin/orders/${id}/status`, { status }, { token: token ?? undefined });
}

// ── Categories ───────────────────────────────────────────────────────────────
export async function getAdminCategories(token: string | null): Promise<Category[]> {
  if (!useApi) return delay(_categories);
  const res = await apiGet<{ data: Category[] }>("/admin/categories", { token: token ?? undefined });
  return res.data;
}

export interface CategoryInput {
  name: string;
  slug: string;
  parentId: number | null;
  description?: string;
}

export async function saveCategory(input: CategoryInput, id: number | null, token: string | null): Promise<Category> {
  if (!useApi) {
    if (id) {
      const idx = _categories.findIndex((c) => c.id === id);
      _categories[idx] = { ..._categories[idx], ...input };
      return delay(_categories[idx]);
    }
    const created: Category = { id: nextId(_categories), image: null, subcategories: [], ...input };
    _categories = [..._categories, created];
    return delay(created);
  }
  const body = { name: input.name, slug: input.slug, parent_id: input.parentId, description: input.description };
  const res = await apiSend<{ data: Category }>(id ? "PUT" : "POST", id ? `/admin/categories/${id}` : "/admin/categories", body, { token: token ?? undefined });
  return res.data;
}

export async function deleteCategory(id: number, token: string | null): Promise<void> {
  if (!useApi) {
    _categories = _categories.filter((c) => c.id !== id);
    await delay(null);
    return;
  }
  await apiSend("DELETE", `/admin/categories/${id}`, undefined, { token: token ?? undefined });
}

// ── Coupons ──────────────────────────────────────────────────────────────────
export async function getAdminCoupons(token: string | null): Promise<Coupon[]> {
  if (!useApi) return delay(_coupons);
  const res = await apiGet<{ data: Coupon[] }>("/admin/coupons", { token: token ?? undefined });
  return res.data;
}

export type CouponInput = Omit<Coupon, "id" | "usedCount">;

export async function saveCoupon(input: CouponInput, id: number | null, token: string | null): Promise<Coupon> {
  if (!useApi) {
    if (id) {
      const idx = _coupons.findIndex((c) => c.id === id);
      _coupons[idx] = { ..._coupons[idx], ...input };
      return delay(_coupons[idx]);
    }
    const created: Coupon = { id: nextId(_coupons), usedCount: 0, ...input };
    _coupons = [created, ..._coupons];
    return delay(created);
  }
  const body = {
    code: input.code, type: input.type, value: input.value, min_order_amount: input.minOrderAmount,
    max_discount: input.maxDiscount, usage_limit: input.usageLimit, expires_at: input.expiresAt, is_active: input.isActive,
  };
  const res = await apiSend<{ data: Coupon }>(id ? "PUT" : "POST", id ? `/admin/coupons/${id}` : "/admin/coupons", body, { token: token ?? undefined });
  return res.data;
}

export async function deleteCoupon(id: number, token: string | null): Promise<void> {
  if (!useApi) {
    _coupons = _coupons.filter((c) => c.id !== id);
    await delay(null);
    return;
  }
  await apiSend("DELETE", `/admin/coupons/${id}`, undefined, { token: token ?? undefined });
}

// ── Banners ──────────────────────────────────────────────────────────────────
export async function getAdminBanners(token: string | null): Promise<Banner[]> {
  if (!useApi) return delay(_banners);
  const res = await apiGet<{ data: Banner[] }>("/admin/banners", { token: token ?? undefined });
  return res.data;
}

export type BannerInput = Omit<Banner, "id">;

export async function saveBanner(input: BannerInput, id: number | null, token: string | null): Promise<Banner> {
  if (!useApi) {
    if (id) {
      const idx = _banners.findIndex((b) => b.id === id);
      _banners[idx] = { ..._banners[idx], ...input };
      return delay(_banners[idx]);
    }
    const created: Banner = { id: nextId(_banners), ...input };
    _banners = [..._banners, created];
    return delay(created);
  }
  const body = { title: input.title, subtitle: input.subtitle, cta_text: input.ctaText, cta_link: input.ctaLink, position: input.position };
  const res = await apiSend<{ data: Banner }>(id ? "PUT" : "POST", id ? `/admin/banners/${id}` : "/admin/banners", body, { token: token ?? undefined });
  return res.data;
}

export async function deleteBanner(id: number, token: string | null): Promise<void> {
  if (!useApi) {
    _banners = _banners.filter((b) => b.id !== id);
    await delay(null);
    return;
  }
  await apiSend("DELETE", `/admin/banners/${id}`, undefined, { token: token ?? undefined });
}

// ── Users ────────────────────────────────────────────────────────────────────
export async function getAdminUsers(token: string | null): Promise<AdminUserRow[]> {
  if (!useApi) return delay(_users);
  const res = await apiGet<{ data: AdminUserRow[] }>("/admin/users", { token: token ?? undefined });
  return res.data;
}

export async function updateUserRole(id: number, role: AdminUserRow["role"], token: string | null): Promise<void> {
  if (!useApi) {
    const u = _users.find((x) => x.id === id);
    if (u) u.role = role;
    await delay(null);
    return;
  }
  await apiSend("PUT", `/admin/users/${id}/role`, { role }, { token: token ?? undefined });
}

export async function toggleUserStatus(id: number, token: string | null): Promise<void> {
  if (!useApi) {
    const u = _users.find((x) => x.id === id);
    if (u) u.isActive = !u.isActive;
    await delay(null);
    return;
  }
  await apiSend("PUT", `/admin/users/${id}/status`, undefined, { token: token ?? undefined });
}

// ── Reviews ──────────────────────────────────────────────────────────────────
export async function getAdminReviews(token: string | null): Promise<AdminReviewRow[]> {
  if (!useApi) return delay(_reviews);
  const res = await apiGet<{ data: any[] }>("/admin/reviews", { token: token ?? undefined });
  return res.data.map((r: any) => ({
    id: r.id, userName: r.user?.name ?? "Customer", productName: r.product?.name ?? "Product",
    productSlug: r.product?.slug ?? "#", rating: r.rating, title: r.title ?? "", body: r.comment ?? r.body ?? "",
    isApproved: Boolean(r.is_approved), createdAt: r.created_at,
  }));
}

export async function approveReview(id: number, token: string | null): Promise<void> {
  if (!useApi) {
    const r = _reviews.find((x) => x.id === id);
    if (r) r.isApproved = true;
    await delay(null);
    return;
  }
  await apiSend("PUT", `/admin/reviews/${id}/approve`, undefined, { token: token ?? undefined });
}

export async function deleteReview(id: number, token: string | null): Promise<void> {
  if (!useApi) {
    _reviews = _reviews.filter((x) => x.id !== id);
    await delay(null);
    return;
  }
  await apiSend("DELETE", `/admin/reviews/${id}`, undefined, { token: token ?? undefined });
}

// ── Settings ─────────────────────────────────────────────────────────────────
let _settings: SiteSettings = {
  siteName: SITE.name,
  tagline: SITE.tagline,
  email: SITE.email,
  phone: SITE.phone,
  whatsapp: SITE.whatsapp,
  address: SITE.address,
  freeShippingThreshold: SITE.freeShippingThreshold,
  facebook: SITE.social.facebook,
  instagram: SITE.social.instagram,
  youtube: SITE.social.youtube,
  tiktok: SITE.social.tiktok,
};

export async function getAdminSettings(token: string | null): Promise<SiteSettings> {
  if (!useApi) return delay(_settings);
  const res = await apiGet<{ data: SiteSettings }>("/admin/settings", { token: token ?? undefined });
  return res.data;
}

export async function updateSettings(input: SiteSettings, token: string | null): Promise<SiteSettings> {
  if (!useApi) {
    _settings = { ...input };
    return delay(_settings);
  }
  const res = await apiSend<{ data: SiteSettings }>("PUT", "/admin/settings", input, { token: token ?? undefined });
  return res.data;
}
