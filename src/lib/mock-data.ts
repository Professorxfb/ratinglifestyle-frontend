import type { Product, Category, Banner } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// Stand-in for the Laravel API. Replace the accessor functions in lib/api.ts
// with real fetch() calls once the backend is live — components stay unchanged.
// Images are intentionally null so the UI renders luxury gradient placeholders.
// ─────────────────────────────────────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: 1,
    name: "Men",
    slug: "men",
    parentId: null,
    image: null,
    subcategories: [
      { id: 11, name: "T-Shirts", slug: "men-t-shirts", parentId: 1, image: null },
      { id: 12, name: "Shirts", slug: "men-shirts", parentId: 1, image: null },
      { id: 13, name: "Jeans", slug: "men-jeans", parentId: 1, image: null },
      { id: 14, name: "Jerseys", slug: "men-jerseys", parentId: 1, image: null },
    ],
  },
  {
    id: 2,
    name: "Women",
    slug: "women",
    parentId: null,
    image: null,
    subcategories: [
      { id: 21, name: "Tops", slug: "women-tops", parentId: 2, image: null },
      { id: 22, name: "Dresses", slug: "women-dresses", parentId: 2, image: null },
      { id: 23, name: "Kurtis", slug: "women-kurtis", parentId: 2, image: null },
      { id: 24, name: "Jeans", slug: "women-jeans", parentId: 2, image: null },
    ],
  },
  {
    id: 3,
    name: "Kids",
    slug: "kids",
    parentId: null,
    image: null,
    subcategories: [
      { id: 31, name: "Boys", slug: "kids-boys", parentId: 3, image: null },
      { id: 32, name: "Girls", slug: "kids-girls", parentId: 3, image: null },
      { id: 33, name: "Infants", slug: "kids-infants", parentId: 3, image: null },
    ],
  },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Obsidian", hex: "#0A0A0A" },
  { name: "Ivory", hex: "#E8E0D0" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Olive", hex: "#5A5A3C" },
  { name: "Burgundy", hex: "#5A1B2A" },
];

function makeVariants(seed: number) {
  // deterministic variant set per product (no Math.random — keeps SSR stable)
  const colorCount = 2 + (seed % 3);
  const variants = [];
  let vid = seed * 100;
  for (let c = 0; c < colorCount; c++) {
    const color = COLORS[(seed + c) % COLORS.length];
    for (let s = 0; s < SIZES.length; s++) {
      vid++;
      variants.push({
        id: vid,
        colorName: color.name,
        colorHex: color.hex,
        size: SIZES[s],
        additionalPrice: 0,
        // make some sizes out of stock deterministically
        stockQuantity: (seed + s + c) % 7 === 0 ? 0 : 3 + ((seed + s * c) % 20),
      });
    }
  }
  return variants;
}

const PRODUCT_NAMES = [
  "Imperial Oxford Shirt",
  "Midnight Selvedge Jeans",
  "Heritage Polo Tee",
  "Royal Linen Kurti",
  "Obsidian Bomber Jacket",
  "Platinum Crewneck Tee",
  "Sovereign Slim Chinos",
  "Aurelia Silk Dress",
  "Noir Graphic Tee",
  "Regalia Football Jersey",
  "Velour Hooded Sweatshirt",
  "Cashmere Touch Sweater",
  "Little Prince Romper",
  "Sienna Floral Top",
  "Monarch Denim Jacket",
  "Ivory Tailored Blazer",
];

const CATEGORY_POOL = [
  { slug: "men-shirts", name: "Men's Shirts" },
  { slug: "men-jeans", name: "Men's Jeans" },
  { slug: "men-t-shirts", name: "Men's T-Shirts" },
  { slug: "women-kurtis", name: "Women's Kurtis" },
  { slug: "men-t-shirts", name: "Men's T-Shirts" },
  { slug: "men-t-shirts", name: "Men's T-Shirts" },
  { slug: "men-jeans", name: "Men's Chinos" },
  { slug: "women-dresses", name: "Women's Dresses" },
  { slug: "men-t-shirts", name: "Men's T-Shirts" },
  { slug: "men-jerseys", name: "Men's Jerseys" },
  { slug: "men-t-shirts", name: "Men's Hoodies" },
  { slug: "women-tops", name: "Women's Sweaters" },
  { slug: "kids-infants", name: "Kids' Rompers" },
  { slug: "women-tops", name: "Women's Tops" },
  { slug: "men-shirts", name: "Men's Jackets" },
  { slug: "women-tops", name: "Women's Blazers" },
];

const BADGES = ["new", "sale", "hot", "best_selling", null] as const;

export const products: Product[] = PRODUCT_NAMES.map((name, i) => {
  const seed = i + 1;
  const cat = CATEGORY_POOL[i];
  const basePrice = 990 + ((seed * 317) % 4500);
  const onSale = seed % 3 === 0;
  const salePrice = onSale ? Math.round(basePrice * 0.7) : null;
  const badge = BADGES[seed % BADGES.length];
  const variants = makeVariants(seed);
  const stock = variants.reduce((t, v) => t + v.stockQuantity, 0);
  return {
    id: seed,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    shortDescription:
      "Crafted from premium fabric with a tailored silhouette for an effortlessly refined look.",
    description:
      "A signature Rupkotha Trendz piece engineered for comfort and statement. Cut from carefully sourced premium fabric, finished with reinforced stitching and a fit that flatters. Designed in Dhaka, made to last. Pair it with our coordinated essentials for a complete cinematic wardrobe.",
    categorySlug: cat.slug,
    categoryName: cat.name,
    basePrice,
    salePrice,
    sku: `RT-${1000 + seed}`,
    stockQuantity: stock,
    lowStockThreshold: 5,
    badge: onSale ? "sale" : badge,
    isFeatured: seed % 2 === 0,
    isNewArrival: seed % 4 === 0 || seed <= 4,
    isBestSeller: seed % 3 === 1,
    isHotDeal: onSale,
    material: "Premium cotton blend",
    careInstructions: "Machine wash cold. Do not bleach. Iron on low.",
    brand: "Rupkotha Trendz",
    rating: 3.8 + ((seed * 7) % 12) / 10, // 3.8 – 4.9
    reviewsCount: 6 + ((seed * 13) % 120),
    soldCount: 20 + ((seed * 37) % 900),
    images: [
      { id: seed * 10 + 1, path: null, alt: `${name} front view`, isPrimary: true },
      { id: seed * 10 + 2, path: null, alt: `${name} back view`, isPrimary: false },
      { id: seed * 10 + 3, path: null, alt: `${name} detail`, isPrimary: false },
    ],
    variants,
  };
});

export const featuredCategories = [
  { name: "Men", slug: "men", span: "lg:col-span-2 lg:row-span-2" },
  { name: "Women", slug: "women", span: "" },
  { name: "Kids", slug: "kids", span: "" },
  { name: "T-Shirts", slug: "men-t-shirts", span: "" },
  { name: "Jeans", slug: "men-jeans", span: "" },
  { name: "Sale", slug: "deals", span: "lg:col-span-2" },
];

export const banners: Banner[] = [
  {
    id: 1,
    title: "Wear the Story.",
    subtitle: "The Summer Atelier Collection — crafted for those who command attention.",
    ctaText: "Explore Collection",
    ctaLink: "/new-arrivals",
    image: null,
    position: "hero_main",
  },
  {
    id: 2,
    title: "Timeless. Tailored.",
    subtitle: "Discover heritage menswear reimagined for the modern silhouette.",
    ctaText: "Shop Men",
    ctaLink: "/shop/men",
    image: null,
    position: "hero_main",
  },
  {
    id: 3,
    title: "Effortless Elegance.",
    subtitle: "Women's edits that move from boardroom to soirée without missing a beat.",
    ctaText: "Shop Women",
    ctaLink: "/shop/women",
    image: null,
    position: "hero_main",
  },
];

export const promoBanner: Banner = {
  id: 10,
  title: "Summer Collection — Up to 40% OFF",
  subtitle: "A limited edit of seasonal essentials. While the moment lasts.",
  ctaText: "Shop the Sale",
  ctaLink: "/deals",
  image: null,
  position: "section_banner",
};
