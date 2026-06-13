"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { OrderStatus } from "@/lib/types";

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-sm border border-line bg-card ${className}`}>{children}</div>
  );
}

// ── Page toolbar (title + action) ─────────────────────────────────────────────
export function AdminToolbar({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Status pill (orders) ──────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  confirmed: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  processing: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  shipped: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  delivered: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  returned: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  failed: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  refunded: "bg-muted/15 text-muted border-line",
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  inactive: "bg-muted/15 text-muted border-line",
};

export function StatusPill({ status }: { status: OrderStatus | string }) {
  const style = STATUS_STYLES[status] ?? "bg-muted/15 text-muted border-line";
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${style}`}>
      {status}
    </span>
  );
}

// ── Empty / loading states ────────────────────────────────────────────────────
export function Empty({ message }: { message: string }) {
  return <div className="py-16 text-center text-sm text-muted">{message}</div>;
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return <div className="py-16 text-center text-sm text-muted">{label}</div>;
}

// ── Modal ──────────────────────────────────────────────────────────────────────
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-obsidian/80 p-4 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className={`w-full ${wide ? "max-w-2xl" : "max-w-lg"} rounded-sm border border-line bg-card p-6 sm:p-8`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl text-ink">{title}</h3>
              <button onClick={onClose} className="text-muted hover:text-gold" aria-label="Close">
                ✕
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Form field helpers (shared by admin forms) ─────────────────────────────────
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted/70">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full border border-line bg-obsidian px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none";
