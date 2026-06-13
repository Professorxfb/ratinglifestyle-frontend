"use client";

import { useState } from "react";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import type { Product, Review } from "@/lib/types";
import Stars from "@/components/ui/Stars";

type Tab = "description" | "specs" | "reviews";

export default function ProductTabs({
  product,
  reviews,
}: {
  product: Product;
  reviews: Review[];
}) {
  const [tab, setTab] = useState<Tab>("description");

  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "specs", label: "Specifications" },
    { key: "reviews", label: `Reviews (${product.reviewsCount})` },
  ];

  // rating distribution (mock derived)
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const total = reviews.length || 1;

  return (
    <div className="mt-20">
      <div className="flex gap-8 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              "relative pb-4 text-sm uppercase tracking-wide transition-colors",
              tab === t.key ? "text-gold" : "text-muted hover:text-ink",
            )}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-gradient" />
            )}
          </button>
        ))}
      </div>

      <div className="py-8">
        {tab === "description" && (
          <div className="max-w-3xl space-y-4 leading-relaxed text-muted">
            <p>{product.description}</p>
          </div>
        )}

        {tab === "specs" && (
          <table className="max-w-xl text-sm">
            <tbody>
              {[
                ["Brand", product.brand],
                ["Material", product.material],
                ["Care", product.careInstructions],
                ["SKU", product.sku],
                ["Category", product.categoryName],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-line/50">
                  <td className="py-3 pr-8 text-ink/60">{k}</td>
                  <td className="py-3 text-ink">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "reviews" && (
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            {/* summary */}
            <div>
              <div className="rounded-sm border border-line bg-card p-6 text-center">
                <p className="font-display text-5xl text-gold">{product.rating.toFixed(1)}</p>
                <div className="mt-2 flex justify-center">
                  <Stars rating={product.rating} />
                </div>
                <p className="mt-2 text-xs text-muted">{product.reviewsCount} reviews</p>
              </div>
              <div className="mt-5 space-y-2">
                {dist.map((d) => (
                  <div key={d.star} className="flex items-center gap-2 text-xs text-muted">
                    <span className="w-6">{d.star}★</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full bg-gold-gradient"
                        style={{ width: `${(d.count / total) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* list + form */}
            <div>
              <div className="space-y-6">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-line/50 pb-6">
                    <div className="flex items-center justify-between">
                      <p className="font-serif text-ink">{r.userName}</p>
                      <span className="text-xs text-muted">{r.createdAt}</span>
                    </div>
                    <div className="mt-1">
                      <Stars rating={r.rating} />
                    </div>
                    <p className="mt-2 font-semibold text-ink">{r.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{r.body}</p>
                    {r.adminReply && (
                      <div className="mt-3 border-l-2 border-gold pl-4">
                        <p className="text-xs uppercase tracking-wide text-gold">
                          Rupkotha Trendz
                        </p>
                        <p className="mt-1 text-sm text-muted">{r.adminReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <ReviewForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Please complete all fields.");
      return;
    }
    // In production: POST /api/reviews/{product_id} (auth required)
    toast.success("Thank you! Your review is pending approval.");
    setTitle("");
    setBody("");
    setRating(5);
  }

  return (
    <form onSubmit={submit} className="mt-10 rounded-sm border border-line bg-card p-6">
      <h3 className="font-display text-xl text-ink">Write a Review</h3>
      <div className="mt-4 flex gap-1 text-2xl">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setRating(s)}
            className={s <= rating ? "text-gold" : "text-line"}
            aria-label={`${s} stars`}
          >
            ★
          </button>
        ))}
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Review title"
        className="mt-4 w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-gold focus:outline-none"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share your thoughts…"
        rows={4}
        className="mt-3 w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-gold focus:outline-none"
      />
      <button type="submit" className="btn-gold mt-4">
        Submit Review
      </button>
    </form>
  );
}
