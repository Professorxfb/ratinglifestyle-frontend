"use client";

import Link from "next/link";
import { useWishlist } from "@/store/wishlist";
import { products } from "@/lib/mock-data";
import ProductGrid from "@/components/product/ProductGrid";
import PageHeader from "@/components/ui/PageHeader";

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <>
      <PageHeader
        title="My Wishlist"
        description="Your saved pieces, ready when you are."
        crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />
      <div className="container-luxe py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-24 text-center">
            <p className="font-serif text-2xl text-muted">Your wishlist is empty.</p>
            <Link href="/shop" className="btn-gold">
              Discover Products
            </Link>
          </div>
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
    </>
  );
}
