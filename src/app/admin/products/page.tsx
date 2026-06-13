"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import { getAdminProducts, deleteProduct } from "@/lib/admin-api";
import { formatBDT } from "@/lib/site";
import { AdminToolbar, Card, Empty, Spinner, inputClass } from "@/components/admin/ui";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<number | null>(null);

  function load() {
    setLoading(true);
    getAdminProducts(token)
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(load, [token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    );
  }, [products, query]);

  async function handleDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setBusy(p.id);
    try {
      await deleteProduct(p.id, token);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      toast.success("Product deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <AdminToolbar
        title="Products"
        subtitle={`${products.length} products`}
        action={
          <Link href="/admin/products/new" className="btn-gold px-5 py-2.5 text-xs">
            + Add Product
          </Link>
        }
      />

      <div className="mb-4 max-w-sm">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or SKU…"
          className={inputClass}
        />
      </div>

      <Card>
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <Empty message="No products found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-line/50 last:border-0 hover:bg-charcoal/40">
                    <td className="px-4 py-3 text-ink">{p.name}</td>
                    <td className="px-4 py-3 text-muted">{p.sku}</td>
                    <td className="px-4 py-3 text-ink/70">{p.categoryName}</td>
                    <td className="px-4 py-3 text-right text-ink">
                      {p.salePrice ? (
                        <span>
                          <span className="text-gold">{formatBDT(p.salePrice)}</span>{" "}
                          <span className="text-xs text-muted line-through">{formatBDT(p.basePrice)}</span>
                        </span>
                      ) : (
                        formatBDT(p.basePrice)
                      )}
                    </td>
                    <td className={`px-4 py-3 text-right ${p.stockQuantity <= p.lowStockThreshold ? "text-rose-300" : "text-ink/70"}`}>
                      {p.stockQuantity}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3 text-xs">
                        <Link href={`/admin/products/${p.id}`} className="text-gold hover:opacity-70">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={busy === p.id}
                          className="text-rose-300 hover:opacity-70 disabled:opacity-40"
                        >
                          {busy === p.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
