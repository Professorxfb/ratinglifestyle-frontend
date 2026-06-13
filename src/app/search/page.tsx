import type { Metadata } from "next";
import { Suspense } from "react";
import { searchProducts } from "@/lib/api";
import ShopView from "@/components/shop/ShopView";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

async function Results({ query }: { query: string }) {
  const products = await searchProducts(query);
  return (
    <div className="container-luxe py-12">
      {query ? (
        products.length > 0 ? (
          <ShopView products={products} />
        ) : (
          <p className="py-20 text-center font-serif text-lg text-muted">
            No results for “{query}”. Try a different search.
          </p>
        )
      ) : (
        <p className="py-20 text-center font-serif text-lg text-muted">
          Enter a search term to find products.
        </p>
      )}
    </div>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q ?? "";
  return (
    <>
      <PageHeader
        title={query ? `Search: “${query}”` : "Search"}
        crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />
      <Suspense>
        <Results query={query} />
      </Suspense>
    </>
  );
}
