"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import type { Product } from "@/lib/types";
import { formatBDT } from "@/lib/site";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import Placeholder from "@/components/ui/Placeholder";
import Stars from "@/components/ui/Stars";

const BADGE_STYLES: Record<string, string> = {
  new: "bg-platinum text-obsidian",
  hot: "bg-danger text-ink",
  best_selling: "bg-gold-gradient text-obsidian",
  sale: "bg-gold-gradient text-obsidian",
};

const BADGE_LABEL: Record<string, string> = {
  new: "NEW",
  hot: "HOT",
  best_selling: "BEST SELLER",
  sale: "SALE",
};

export default function ProductCard({ product }: { product: Product }) {
  const addLine = useCart((s) => s.addLine);
  const toggleWish = useWishlist((s) => s.toggle);
  const inWishlist = useWishlist((s) => s.ids.includes(product.id));

  const price = product.salePrice ?? product.basePrice;
  const colors = Array.from(
    new Map(product.variants.map((v) => [v.colorHex, v])).values(),
  ).slice(0, 4);
  const discountPct = product.salePrice
    ? Math.round((1 - product.salePrice / product.basePrice) * 100)
    : 0;

  function quickAdd() {
    const firstInStock = product.variants.find((v) => v.stockQuantity > 0);
    addLine({
      productId: product.id,
      variantId: firstInStock?.id ?? null,
      name: product.name,
      slug: product.slug,
      image: null,
      color: firstInStock?.colorName ?? null,
      colorHex: firstInStock?.colorHex ?? null,
      size: firstInStock?.size ?? null,
      unitPrice: price,
    });
    toast.success(`${product.name} added to bag`);
  }

  function wish(e: React.MouseEvent) {
    e.preventDefault();
    toggleWish(product.id);
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist", { icon: "♥" });
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col"
    >
      <Link href={`/product/${product.slug}`} className="relative block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-card">
          {/* primary image */}
          <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0">
            <Placeholder seed={product.id} />
          </div>
          {/* secondary image (crossfade on hover) */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <Placeholder seed={product.id + 99} />
          </div>

          {/* badge */}
          {product.badge && (
            <span
              className={clsx(
                "absolute left-3 top-3 rounded-sm px-2.5 py-1 text-[10px] font-bold tracking-wide",
                BADGE_STYLES[product.badge],
              )}
            >
              {product.badge === "sale" && discountPct > 0
                ? `−${discountPct}%`
                : BADGE_LABEL[product.badge]}
            </span>
          )}

          {/* wishlist */}
          <button
            onClick={wish}
            aria-label="Toggle wishlist"
            className={clsx(
              "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-all",
              inWishlist
                ? "border-gold bg-gold text-obsidian"
                : "border-line bg-obsidian/50 text-ink hover:border-gold hover:text-gold",
            )}
          >
            ♥
          </button>

          {/* add to cart — slides up on hover */}
          <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                quickAdd();
              }}
              className="w-full rounded-sm bg-gold-gradient py-2.5 text-xs font-semibold uppercase tracking-wide text-obsidian shadow-gold transition-transform hover:brightness-110 active:scale-95"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </Link>

      {/* meta */}
      <div className="mt-3 flex flex-col gap-1">
        <p className="text-[11px] uppercase tracking-wide text-muted">{product.categoryName}</p>
        <Link
          href={`/product/${product.slug}`}
          className="font-serif text-base leading-snug text-ink transition-colors hover:text-gold"
        >
          {product.name}
        </Link>
        <Stars rating={product.rating} count={product.reviewsCount} />
        <div className="mt-1 flex items-center gap-2">
          <span className="text-gold">{formatBDT(price)}</span>
          {product.salePrice && (
            <span className="text-sm text-muted line-through">{formatBDT(product.basePrice)}</span>
          )}
        </div>
        {/* color swatches */}
        {colors.length > 0 && (
          <div className="mt-1 flex gap-1.5">
            {colors.map((v) => (
              <span
                key={v.colorHex}
                title={v.colorName}
                className="h-3.5 w-3.5 rounded-full border border-line"
                style={{ backgroundColor: v.colorHex }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
