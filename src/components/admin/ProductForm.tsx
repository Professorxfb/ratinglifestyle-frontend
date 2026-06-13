"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import {
  getAdminProduct,
  getAdminCategories,
  saveProduct,
  type ProductInput,
} from "@/lib/admin-api";
import { Card, Field, Spinner, inputClass } from "@/components/admin/ui";
import type { Category } from "@/lib/types";

const EMPTY: ProductInput = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  categorySlug: "",
  basePrice: 0,
  salePrice: null,
  sku: "",
  stockQuantity: 0,
  lowStockThreshold: 5,
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  isHotDeal: false,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductForm({ productId }: { productId: number | null }) {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<ProductInput>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(productId !== null);
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(productId !== null);

  useEffect(() => {
    getAdminCategories(token).then(setCategories);
  }, [token]);

  useEffect(() => {
    if (productId === null) return;
    getAdminProduct(productId, token)
      .then((p) => {
        if (!p) {
          toast.error("Product not found.");
          router.replace("/admin/products");
          return;
        }
        setForm({
          name: p.name,
          slug: p.slug,
          shortDescription: p.shortDescription,
          description: p.description,
          categorySlug: p.categorySlug,
          basePrice: p.basePrice,
          salePrice: p.salePrice,
          sku: p.sku,
          stockQuantity: p.stockQuantity,
          lowStockThreshold: p.lowStockThreshold,
          isFeatured: p.isFeatured,
          isNewArrival: p.isNewArrival,
          isBestSeller: p.isBestSeller,
          isHotDeal: p.isHotDeal,
        });
      })
      .finally(() => setLoading(false));
  }, [productId, token, router]);

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.categorySlug || !form.sku) {
      toast.error("Name, category and SKU are required.");
      return;
    }
    setSaving(true);
    try {
      await saveProduct({ ...form, slug: form.slug || slugify(form.name) }, productId, token);
      toast.success(productId ? "Product updated." : "Product created.");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  const FLAGS: { key: keyof ProductInput; label: string }[] = [
    { key: "isFeatured", label: "Featured" },
    { key: "isNewArrival", label: "New Arrival" },
    { key: "isBestSeller", label: "Best Seller" },
    { key: "isHotDeal", label: "Hot Deal" },
  ];

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <Card className="space-y-4 p-6">
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!slugEdited) set("slug", slugify(e.target.value));
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Slug" hint="URL identifier — auto-generated from name.">
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugEdited(true);
              set("slug", e.target.value);
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Short description">
          <input
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={5}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </Card>

      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        <Field label="Category">
          <select
            value={form.categorySlug}
            onChange={(e) => set("categorySlug", e.target.value)}
            className={inputClass}
          >
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="SKU">
          <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Base price (৳)">
          <input
            type="number"
            min={0}
            value={form.basePrice}
            onChange={(e) => set("basePrice", Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="Sale price (৳)" hint="Leave empty for no sale.">
          <input
            type="number"
            min={0}
            value={form.salePrice ?? ""}
            onChange={(e) => set("salePrice", e.target.value === "" ? null : Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="Stock quantity">
          <input
            type="number"
            min={0}
            value={form.stockQuantity}
            onChange={(e) => set("stockQuantity", Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="Low-stock threshold">
          <input
            type="number"
            min={0}
            value={form.lowStockThreshold}
            onChange={(e) => set("lowStockThreshold", Number(e.target.value))}
            className={inputClass}
          />
        </Field>
      </Card>

      <Card className="p-6">
        <p className="mb-3 text-xs uppercase tracking-wide text-muted">Flags</p>
        <div className="flex flex-wrap gap-4">
          {FLAGS.map((f) => (
            <label key={f.key} className="flex items-center gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={form[f.key] as boolean}
                onChange={(e) => set(f.key, e.target.checked as ProductInput[typeof f.key])}
                className="accent-gold"
              />
              {f.label}
            </label>
          ))}
        </div>
      </Card>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-gold px-6 py-2.5 text-xs">
          {saving ? "Saving…" : productId ? "Update Product" : "Create Product"}
        </button>
        <Link href="/admin/products" className="btn-ghost px-6 py-2.5 text-xs">
          Cancel
        </Link>
      </div>
    </form>
  );
}
