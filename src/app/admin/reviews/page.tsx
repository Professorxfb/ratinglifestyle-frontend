"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import { useAuth } from "@/store/auth";
import { getAdminReviews, approveReview, deleteReview } from "@/lib/admin-api";
import { AdminToolbar, Card, Empty, Spinner } from "@/components/admin/ui";
import Stars from "@/components/ui/Stars";
import type { AdminReviewRow } from "@/lib/types";

type Filter = "all" | "pending" | "approved";

export default function AdminReviewsPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<AdminReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    getAdminReviews(token)
      .then(setReviews)
      .finally(() => setLoading(false));
  }, [token]);

  const visible = reviews.filter((r) =>
    filter === "all" ? true : filter === "approved" ? r.isApproved : !r.isApproved,
  );

  async function approve(r: AdminReviewRow) {
    setReviews((list) => list.map((x) => (x.id === r.id ? { ...x, isApproved: true } : x)));
    try {
      await approveReview(r.id, token);
      toast.success("Review approved.");
    } catch (err) {
      setReviews((list) => list.map((x) => (x.id === r.id ? { ...x, isApproved: false } : x)));
      toast.error(err instanceof Error ? err.message : "Failed.");
    }
  }

  async function remove(r: AdminReviewRow) {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(r.id, token);
      setReviews((list) => list.filter((x) => x.id !== r.id));
      toast.success("Review deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed.");
    }
  }

  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  return (
    <div>
      <AdminToolbar
        title="Reviews"
        subtitle={`${pendingCount} awaiting moderation`}
      />

      <div className="mb-4 flex gap-2">
        {(["all", "pending", "approved"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "rounded-full border px-3.5 py-1.5 text-xs capitalize transition-colors",
              filter === f
                ? "border-gold bg-gold-gradient text-obsidian"
                : "border-line text-ink/70 hover:border-gold hover:text-gold",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <Card>
          <Spinner />
        </Card>
      ) : visible.length === 0 ? (
        <Card>
          <Empty message="No reviews in this view." />
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <Stars rating={r.rating} />
                    {!r.isApproved && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-300">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-medium text-ink">{r.title}</p>
                  <p className="mt-1 text-sm text-ink/70">{r.body}</p>
                  <p className="mt-2 text-xs text-muted">
                    by {r.userName} on{" "}
                    <Link href={`/product/${r.productSlug}`} className="text-gold hover:opacity-70">
                      {r.productName}
                    </Link>{" "}
                    · {r.createdAt}
                  </p>
                </div>
                <div className="flex shrink-0 gap-3 text-xs">
                  {!r.isApproved && (
                    <button onClick={() => approve(r)} className="text-emerald-300 hover:opacity-70">
                      Approve
                    </button>
                  )}
                  <button onClick={() => remove(r)} className="text-rose-300 hover:opacity-70">
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
