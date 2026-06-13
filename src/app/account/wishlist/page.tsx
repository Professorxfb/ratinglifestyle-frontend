"use client";

import Link from "next/link";
import { useWishlist } from "@/store/wishlist";
import { products } from "@/lib/mock-data";
import ProductGrid from "@/components/product/ProductGrid";

export default function AccountWishlistPage() {
  const ids = useWishlist((s) => s.ids);
  // Wishlist resolves against the in-memory catalog; on the live API this is
  // replaced by GET /api/wishlist. Product cards still drive add-to-cart, etc.
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl text-ink">My Wishlist</h2>
      {items.length === 0 ? (
        <div className="rounded-sm border border-line bg-card p-10 text-center">
          <p className="text-muted">Your wishlist is empty.</p>
          <Link href="/shop" className="btn-gold mt-4">Discover Products</Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
