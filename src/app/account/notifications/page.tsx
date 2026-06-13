"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useAuth } from "@/store/auth";
import { getNotifications } from "@/lib/account";
import type { UserNotification } from "@/lib/types";

export default function NotificationsPage() {
  const token = useAuth((s) => s.token);
  const [items, setItems] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications(token)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [token]);

  function markRead(id: number) {
    setItems((list) =>
      list.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
    );
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl text-ink">Notifications</h2>
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-sm border border-line bg-card p-10 text-center text-muted">
          You’re all caught up.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={clsx(
                "flex w-full items-start gap-3 rounded-sm border bg-card p-4 text-left transition-colors",
                n.readAt ? "border-line" : "border-gold/40",
              )}
            >
              {!n.readAt && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />}
              <div className={clsx("flex-1", n.readAt && "pl-5")}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-ink">{n.title}</p>
                  <span className="text-xs text-muted">{n.createdAt}</span>
                </div>
                {n.body && <p className="mt-1 text-sm text-muted">{n.body}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
