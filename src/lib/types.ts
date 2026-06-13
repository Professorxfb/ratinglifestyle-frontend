// Shared domain types — mirror the Laravel API response shapes so swapping
// mock data for real endpoints later requires no component changes.

export type Badge = "new" | "hot" | "best_selling" | "sale" | null;

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  image: string | null;
  description?: string;
  subcategories?: Category[];
}

export interface ProductImage {
  id: number;
  path: string | null; // null => render gradient placeholder
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  colorName: string;
  colorHex: string;
  size: string;
  additionalPrice: number;
  stockQuantity: number;
}

export interface Review {
  id: number;
  userName: string;
  rating: number; // 1-5
  title: string;
  body: string;
  createdAt: string;
  adminReply?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  basePrice: number;
  salePrice: number | null;
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  badge: Badge;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isHotDeal: boolean;
  material?: string;
  careInstructions?: string;
  brand?: string;
  rating: number; // average
  reviewsCount: number;
  soldCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string | null;
  position: "hero_main" | "hero_secondary" | "promo_strip" | "section_banner";
}

export interface CartLine {
  key: string; // productId + variant signature
  productId: number;
  variantId?: number | null;
  name: string;
  slug: string;
  image: string | null;
  color: string | null;
  colorHex: string | null;
  size: string | null;
  unitPrice: number;
  quantity: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  role: "customer" | "moderator" | "admin";
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export interface OrderItemLine {
  productName: string;
  color: string | null;
  size: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderSummary {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  total: number;
  itemsCount: number;
  createdAt: string;
}

export interface OrderDetail extends OrderSummary {
  subtotal: number;
  discount: number;
  shippingCharge: number;
  couponCode: string | null;
  items: OrderItemLine[];
  shipping: {
    name: string;
    phone: string;
    email: string | null;
    address: string;
    city: string;
    district: string;
    postalCode: string | null;
    notes: string | null;
  };
}

export interface UserNotification {
  id: number;
  title: string;
  body: string | null;
  type: string;
  readAt: string | null;
  createdAt: string;
}

// ── Admin domain types ───────────────────────────────────────────────────────

export interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
}

export interface AdminUserRow {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: "customer" | "moderator" | "admin";
  ordersCount: number;
  totalSpent: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminReviewRow {
  id: number;
  userName: string;
  productName: string;
  productSlug: string;
  rating: number;
  title: string;
  body: string;
  isApproved: boolean;
  createdAt: string;
}

export interface DashboardStats {
  revenueThisMonth: number;
  ordersTotal: number;
  ordersPending: number;
  productsTotal: number;
  productsLowStock: number;
  customersTotal: number;
}

export interface ChartPoint {
  month: string; // "YYYY-MM"
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: number;
  name: string;
  soldCount: number;
  stockQuantity: number;
}

export interface DashboardData {
  stats: DashboardStats;
  chart: ChartPoint[];
  recentOrders: OrderSummary[];
  topProducts: TopProduct[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  freeShippingThreshold: number;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}
