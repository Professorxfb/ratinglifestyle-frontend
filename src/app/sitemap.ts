import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";
import { categories } from "@/lib/mock-data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const staticRoutes = [
    "",
    "/shop",
    "/new-arrivals",
    "/deals",
    "/about",
    "/contact",
    "/faq",
    "/shipping-policy",
    "/return-policy",
    "/privacy-policy",
    "/terms-conditions",
    "/size-guide",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryRoutes = categories.flatMap((c) => [
    { url: `${SITE.url}/shop/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 },
    ...(c.subcategories ?? []).map((s) => ({
      url: `${SITE.url}/shop/${c.slug}/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]);

  const productRoutes = products.map((p) => ({
    url: `${SITE.url}/product/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
