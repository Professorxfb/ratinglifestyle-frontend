"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import ProductGrid from "@/components/product/ProductGrid";
import { formatBDT } from "@/lib/site";

type SortKey = "newest" | "price_asc" | "price_desc" | "best_selling" | "rating";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
  { key: "best_selling", label: "Best Selling" },
  { key: "rating", label: "Most Reviewed" },
];

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ShopView({
  products,
  initialSort = "newest",
}: {
  products: Product[];
  initialSort?: SortKey;
}) {
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [visible, setVisible] = useState(8);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // available colors across the result set
  const colorOptions = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) =>
      p.variants.forEach((v) => map.set(v.colorName, v.colorHex)),
    );
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const priceCeiling = useMemo(
    () => Math.max(...products.map((p) => p.salePrice ?? p.basePrice), 1000),
    [products],
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const price = p.salePrice ?? p.basePrice;
      if (maxPrice && price > maxPrice) return false;
      if (inStockOnly && p.stockQuantity <= 0) return false;
      if (minRating && p.rating < minRating) return false;
      if (sizes.length) {
        const has = p.variants.some(
          (v) => sizes.includes(v.size) && v.stockQuantity > 0,
        );
        if (!has) return false;
      }
      if (colors.length) {
        const has = p.variants.some((v) => colors.includes(v.colorName));
        if (!has) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      const pa = a.salePrice ?? a.basePrice;
      const pb = b.salePrice ?? b.basePrice;
      switch (sort) {
        case "price_asc":
          return pa - pb;
        case "price_desc":
          return pb - pa;
        case "best_selling":
          return b.soldCount - a.soldCount;
        case "rating":
          return b.reviewsCount - a.reviewsCount;
        default:
          return b.id - a.id; // newest
      }
    });
    return list;
  }, [products, maxPrice, inStockOnly, minRating, sizes, colors, sort]);

  function toggle(list: string[], val: string, setter: (v: string[]) => void) {
    setter(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
  }

  const Filters = (
    <div className="space-y-8">
      {/* Price */}
      <div>
        <h3 className="eyebrow mb-4">Price Range</h3>
        <input
          type="range"
          min={0}
          max={priceCeiling}
          step={100}
          value={maxPrice || priceCeiling}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-gold"
        />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>৳0</span>
          <span className="text-gold">Up to {formatBDT(maxPrice || priceCeiling)}</span>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="eyebrow mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggle(sizes, s, setSizes)}
              className={`h-9 w-11 border text-sm transition-colors ${
                sizes.includes(s)
                  ? "border-gold bg-gold text-obsidian"
                  : "border-line text-ink/70 hover:border-gold"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="eyebrow mb-4">Color</h3>
        <div className="flex flex-wrap gap-2.5">
          {colorOptions.map((c) => (
            <button
              key={c.name}
              title={c.name}
              onClick={() => toggle(colors, c.name, setColors)}
              className={`h-8 w-8 rounded-full border-2 transition-transform ${
                colors.includes(c.name) ? "border-gold scale-110" : "border-line"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="eyebrow mb-4">Minimum Rating</h3>
        <div className="flex gap-2">
          {[4, 3, 0].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`border px-3 py-1.5 text-xs transition-colors ${
                minRating === r
                  ? "border-gold bg-gold text-obsidian"
                  : "border-line text-ink/70 hover:border-gold"
              }`}
            >
              {r === 0 ? "All" : `${r}★ & up`}
            </button>
          ))}
        </div>
      </div>

      {/* In stock */}
      <label className="flex cursor-pointer items-center gap-3 text-sm text-ink/80">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 accent-gold"
        />
        In stock only
      </label>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-32">{Filters}</div>
      </aside>

      <div>
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-sm text-muted">{filtered.length} products</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="btn-ghost lg:hidden"
            >
              Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-line bg-card px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile filters */}
        {filtersOpen && (
          <div className="mb-8 rounded-sm border border-line bg-card p-6 lg:hidden">{Filters}</div>
        )}

        <ProductGrid products={filtered.slice(0, visible)} />

        {visible < filtered.length && (
          <div className="mt-12 text-center">
            <button onClick={() => setVisible((v) => v + 8)} className="btn-outline">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
