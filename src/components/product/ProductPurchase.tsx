"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import type { Product } from "@/lib/types";
import { formatBDT } from "@/lib/site";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import Stars from "@/components/ui/Stars";
import SizeGuideModal from "./SizeGuideModal";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const addLine = useCart((s) => s.addLine);
  const openCart = useCart((s) => s.openCart);
  const toggleWish = useWishlist((s) => s.toggle);
  const inWishlist = useWishlist((s) => s.ids.includes(product.id));

  // distinct colors
  const colors = useMemo(
    () =>
      Array.from(new Map(product.variants.map((v) => [v.colorName, v])).values()),
    [product.variants],
  );

  const [color, setColor] = useState(colors[0]?.colorName ?? "");
  const [size, setSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [sizeGuide, setSizeGuide] = useState(false);

  // sizes available for the selected color
  const sizeStock = useMemo(() => {
    const map = new Map<string, number>();
    product.variants
      .filter((v) => v.colorName === color)
      .forEach((v) => map.set(v.size, v.stockQuantity));
    return map;
  }, [product.variants, color]);

  const selectedVariant = product.variants.find(
    (v) => v.colorName === color && v.size === size,
  );
  const price = product.salePrice ?? product.basePrice;
  const currentStock = selectedVariant?.stockQuantity ?? 0;
  const lowStock = size && currentStock > 0 && currentStock <= product.lowStockThreshold;

  function addToCart(buyNow = false) {
    if (!size) {
      toast.error("Please select a size.");
      return;
    }
    if (currentStock <= 0) {
      toast.error("This option is out of stock.");
      return;
    }
    addLine(
      {
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        name: product.name,
        slug: product.slug,
        image: null,
        color,
        colorHex: colors.find((c) => c.colorName === color)?.colorHex ?? null,
        size,
        unitPrice: price,
      },
      qty,
    );
    if (buyNow) {
      router.push("/checkout");
    } else {
      toast.success(`${product.name} added to bag`);
      openCart();
    }
  }

  return (
    <div className="flex flex-col">
      <p className="text-xs uppercase tracking-luxe text-muted">{product.categoryName}</p>
      <h1 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
        {product.name}
      </h1>
      <div className="mt-3">
        <Stars rating={product.rating} count={product.reviewsCount} size="md" />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="font-display text-3xl text-gold">{formatBDT(price)}</span>
        {product.salePrice && (
          <>
            <span className="text-lg text-muted line-through">
              {formatBDT(product.basePrice)}
            </span>
            <span className="rounded-sm bg-gold-gradient px-2 py-0.5 text-xs font-bold text-obsidian">
              SAVE {formatBDT(product.basePrice - product.salePrice)}
            </span>
          </>
        )}
      </div>

      <p className="mt-5 leading-relaxed text-muted">{product.shortDescription}</p>

      {/* Color selection */}
      <div className="mt-7">
        <p className="mb-3 text-sm uppercase tracking-wide text-ink/80">
          Color: <span className="text-gold">{color}</span>
        </p>
        <div className="flex flex-wrap gap-3">
          {colors.map((v) => (
            <button
              key={v.colorName}
              title={v.colorName}
              onClick={() => {
                setColor(v.colorName);
                setSize("");
              }}
              className={clsx(
                "h-9 w-9 rounded-full border-2 transition-transform",
                color === v.colorName ? "border-gold scale-110" : "border-line hover:scale-105",
              )}
              style={{ backgroundColor: v.colorHex }}
            />
          ))}
        </div>
      </div>

      {/* Size selection */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm uppercase tracking-wide text-ink/80">Size</p>
          <button
            onClick={() => setSizeGuide(true)}
            className="text-xs uppercase tracking-wide text-gold hover:opacity-70"
          >
            Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {ALL_SIZES.map((s) => {
            const stock = sizeStock.get(s) ?? 0;
            const available = stock > 0;
            return (
              <button
                key={s}
                disabled={!available}
                onClick={() => setSize(s)}
                className={clsx(
                  "relative h-11 w-14 border text-sm transition-colors",
                  size === s
                    ? "border-gold bg-gold text-obsidian"
                    : available
                      ? "border-line text-ink hover:border-gold"
                      : "cursor-not-allowed border-line/50 text-muted line-through",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        {lowStock && (
          <p className="mt-3 text-sm text-danger">Only {currentStock} left — order soon!</p>
        )}
      </div>

      {/* Quantity + actions */}
      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center border border-line">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-3 text-ink/70 hover:text-gold"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-10 text-center text-ink">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-4 py-3 text-ink/70 hover:text-gold"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button onClick={() => addToCart(false)} className="btn-gold flex-1">
          Add to Bag
        </button>
        <button
          onClick={() => {
            toggleWish(product.id);
            toast(inWishlist ? "Removed from wishlist" : "Added to wishlist", { icon: "♥" });
          }}
          aria-label="Toggle wishlist"
          className={clsx(
            "flex h-12 w-12 items-center justify-center border transition-colors",
            inWishlist
              ? "border-gold bg-gold text-obsidian"
              : "border-line text-ink hover:border-gold hover:text-gold",
          )}
        >
          ♥
        </button>
      </div>

      <button onClick={() => addToCart(true)} className="btn-outline mt-3 w-full">
        Buy Now
      </button>

      {/* Shipping snippet */}
      <div className="mt-7 space-y-2 border-t border-line pt-6 text-sm text-muted">
        <p>✓ Free shipping on orders above ৳1500</p>
        <p>✓ Delivery in 3–5 business days nationwide</p>
        <p>✓ 7-day easy returns</p>
        <p className="text-xs">SKU: {product.sku}</p>
      </div>

      <SizeGuideModal open={sizeGuide} onClose={() => setSizeGuide(false)} />
    </div>
  );
}
