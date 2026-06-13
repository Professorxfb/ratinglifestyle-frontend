"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import {
  getAdminCoupons,
  saveCoupon,
  deleteCoupon,
  type CouponInput,
} from "@/lib/admin-api";
import { AdminToolbar, Card, Empty, Spinner, Modal, Field, StatusPill, inputClass } from "@/components/admin/ui";
import { formatBDT } from "@/lib/site";
import type { Coupon } from "@/lib/types";

const EMPTY: CouponInput = {
  code: "",
  type: "percentage",
  value: 10,
  minOrderAmount: 0,
  maxDiscount: null,
  usageLimit: null,
  expiresAt: null,
  isActive: true,
};

export default function AdminCouponsPage() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CouponInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    getAdminCoupons(token)
      .then(setCoupons)
      .finally(() => setLoading(false));
  }
  useEffect(load, [token]);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(c: Coupon) {
    setEditId(c.id);
    setForm({
      code: c.code, type: c.type, value: c.value, minOrderAmount: c.minOrderAmount,
      maxDiscount: c.maxDiscount, usageLimit: c.usageLimit, expiresAt: c.expiresAt, isActive: c.isActive,
    });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code) {
      toast.error("Code is required.");
      return;
    }
    setSaving(true);
    try {
      await saveCoupon({ ...form, code: form.code.toUpperCase() }, editId, token);
      toast.success(editId ? "Coupon updated." : "Coupon created.");
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c: Coupon) {
    if (!confirm(`Delete coupon "${c.code}"?`)) return;
    try {
      await deleteCoupon(c.id, token);
      setCoupons((prev) => prev.filter((x) => x.id !== c.id));
      toast.success("Coupon deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div>
      <AdminToolbar
        title="Coupons"
        subtitle={`${coupons.length} coupons`}
        action={
          <button onClick={openCreate} className="btn-gold px-5 py-2.5 text-xs">
            + Add Coupon
          </button>
        }
      />

      <Card>
        {loading ? (
          <Spinner />
        ) : coupons.length === 0 ? (
          <Empty message="No coupons yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Min order</th>
                  <th className="px-4 py-3">Usage</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-line/50 last:border-0 hover:bg-charcoal/40">
                    <td className="px-4 py-3 font-medium text-ink">{c.code}</td>
                    <td className="px-4 py-3 text-ink/70">
                      {c.type === "percentage" ? `${c.value}%` : formatBDT(c.value)}
                      {c.maxDiscount ? <span className="text-muted"> (max {formatBDT(c.maxDiscount)})</span> : ""}
                    </td>
                    <td className="px-4 py-3 text-ink/70">{c.minOrderAmount ? formatBDT(c.minOrderAmount) : "—"}</td>
                    <td className="px-4 py-3 text-ink/70">
                      {c.usedCount}
                      {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                    </td>
                    <td className="px-4 py-3 text-muted">{c.expiresAt ?? "—"}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={c.isActive ? "active" : "inactive"} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3 text-xs">
                        <button onClick={() => openEdit(c)} className="text-gold hover:opacity-70">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(c)} className="text-rose-300 hover:opacity-70">
                          Delete
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

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Edit Coupon" : "Add Coupon"}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Code">
              <input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                className={inputClass}
              />
            </Field>
            <Field label="Type">
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CouponInput["type"] }))}
                className={inputClass}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (৳)</option>
              </select>
            </Field>
            <Field label="Value">
              <input
                type="number"
                min={0}
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                className={inputClass}
              />
            </Field>
            <Field label="Min order (৳)">
              <input
                type="number"
                min={0}
                value={form.minOrderAmount}
                onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: Number(e.target.value) }))}
                className={inputClass}
              />
            </Field>
            <Field label="Max discount (৳)" hint="For % coupons. Blank = no cap.">
              <input
                type="number"
                min={0}
                value={form.maxDiscount ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value === "" ? null : Number(e.target.value) }))}
                className={inputClass}
              />
            </Field>
            <Field label="Usage limit" hint="Blank = unlimited.">
              <input
                type="number"
                min={0}
                value={form.usageLimit ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value === "" ? null : Number(e.target.value) }))}
                className={inputClass}
              />
            </Field>
            <Field label="Expires at" hint="Blank = no expiry.">
              <input
                type="date"
                value={form.expiresAt ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value || null }))}
                className={inputClass}
              />
            </Field>
            <Field label="Status">
              <select
                value={form.isActive ? "1" : "0"}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.value === "1" }))}
                className={inputClass}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </Field>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-gold px-6 py-2.5 text-xs">
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost px-6 py-2.5 text-xs">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
