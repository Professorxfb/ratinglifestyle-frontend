// ─────────────────────────────────────────────────────────────────────────────
// DATA ACCESS LAYER
// Each function calls the live Laravel API when NEXT_PUBLIC_API_URL is set
// (`useApi`), and otherwise returns mock data so the storefront runs standalone.
// The API's response shapes (Laravel API Resources) already match the TS types in
// lib/types.ts, so mapping is mostly an envelope unwrap (`{ data: ... }`).
// ─────────────────────────────────────────────────────────────────────────────

import { products, categories, banners, promoBanner } from "./mock-data";
import type { Product, Category, Banner, Review } from "./types";
import { apiGet, useApi } from "./http";

// Revalidate catalog data every 60s when served from the API (ISR).
const CATALOG_TTL = 60;

export async function getProducts(): Promise<Product[]> {
  if (!useApi) return products;
  const res = await apiGet<{ data: Product[] }>("/products", {
    params: { per_page: 48 },
    revalidate: CATALOG_TTL,
  });
  return res.data;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!useApi) return products.find((p) => p.slug === slug);
  try {
    const res = await apiGet<{ data: Product }>(`/products/${slug}`, { revalidate: CATALOG_TTL });
    return res.data;
  } catch {
    return undefined;
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  if (!useApi) {
    return products.filter(
      (p) => p.categorySlug === categorySlug || p.categorySlug.startsWith(`${categorySlug}-`),
    );
  }
  const res = await apiGet<{ data: Product[] }>(`/categories/${categorySlug}/products`, {
    params: { per_page: 48 },
    revalidate: CATALOG_TTL,
  });
  return res.data;
}

export async function getNewArrivals(): Promise<Product[]> {
  if (!useApi) return products.filter((p) => p.isNewArrival).slice(0, 8);
  return (await getProducts()).filter((p) => p.isNewArrival).slice(0, 8);
}

export async function getBestSellers(): Promise<Product[]> {
  if (!useApi) return [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);
  return [...(await getProducts())].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);
}

export async function getHotDeals(): Promise<Product[]> {
  if (!useApi) return products.filter((p) => p.isHotDeal).slice(0, 8);
  return (await getProducts()).filter((p) => p.isHotDeal).slice(0, 8);
}

export async function getFeatured(): Promise<Product[]> {
  if (!useApi) return products.filter((p) => p.isFeatured).slice(0, 8);
  return (await getProducts()).filter((p) => p.isFeatured).slice(0, 8);
}

export async function getRelated(product: Product): Promise<Product[]> {
  const pool = useApi ? await getProducts() : products;
  return pool
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];
  if (!useApi) {
    const lower = q.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.categoryName.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower),
    );
  }
  const res = await apiGet<{ data: Product[] }>("/products", {
    params: { search: q, per_page: 24 },
  });
  return res.data;
}

export async function getCategories(): Promise<Category[]> {
  if (!useApi) return categories;
  const res = await apiGet<{ data: Category[] }>("/categories", { revalidate: 300 });
  return res.data;
}

export async function getHeroBanners(): Promise<Banner[]> {
  if (!useApi) return banners.filter((b) => b.position === "hero_main");
  const res = await apiGet<{ data: Banner[] }>("/banners", {
    params: { position: "hero_main" },
    revalidate: 300,
  });
  return res.data.length ? res.data : banners.filter((b) => b.position === "hero_main");
}

export async function getPromoBanner(): Promise<Banner> {
  if (!useApi) return promoBanner;
  const res = await apiGet<{ data: Banner[] }>("/banners", {
    params: { position: "section_banner" },
    revalidate: 300,
  });
  return res.data[0] ?? promoBanner;
}

export async function getReviews(product: Product): Promise<Review[]> {
  if (!useApi) return getMockReviews(product);
  try {
    const res = await apiGet<{ data: Review[] }>(`/reviews/${product.id}`, { revalidate: CATALOG_TTL });
    return res.data;
  } catch {
    return [];
  }
}

// Mock reviews for a product detail page (used when the API is not configured).
export function getMockReviews(product: Product): Review[] {
  const names = ["Tanvir A.", "Sadia R.", "Rakib H.", "Nusrat J.", "Imran K."];
  const count = Math.min(5, Math.max(2, product.reviewsCount % 6));
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    userName: names[i % names.length],
    rating: Math.min(5, 4 + ((product.id + i) % 2)),
    title: ["Exceeded expectations", "Premium quality", "Perfect fit", "Worth every taka"][i % 4],
    body: "The fabric feels genuinely premium and the stitching is immaculate. Sizing is accurate and delivery was quick. Will be ordering again.",
    createdAt: ["2026-05-12", "2026-04-28", "2026-04-03", "2026-03-19", "2026-02-21"][i % 5],
    adminReply: i === 0 ? "Thank you for the kind words — we're thrilled you love it!" : null,
  }));
}
