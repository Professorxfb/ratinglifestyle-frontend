"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import {
  getAdminBanners,
  saveBanner,
  deleteBanner,
  type BannerInput,
} from "@/lib/admin-api";
import { AdminToolbar, Card, Empty, Spinner, Modal, Field, inputClass } from "@/components/admin/ui";
import type { Banner } from "@/lib/types";

const POSITIONS: Banner["position"][] = [
  "hero_main",
  "hero_secondary",
  "promo_strip",
  "section_banner",
];

const EMPTY: BannerInput = {
  title: "",
  subtitle: "",
  ctaText: "",
  ctaLink: "",
  image: null,
  position: "hero_main",
};

export default function AdminBannersPage() {
  const { token } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<BannerInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    getAdminBanners(token)
      .then(setBanners)
      .finally(() => setLoading(false));
  }
  useEffect(load, [token]);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(b: Banner) {
    setEditId(b.id);
    setForm({ title: b.title, subtitle: b.subtitle, ctaText: b.ctaText, ctaLink: b.ctaLink, image: b.image, position: b.position });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) {
      toast.error("Title is required.");
      return;
    }
    setSaving(true);
    try {
      await saveBanner(form, editId, token);
      toast.success(editId ? "Banner updated." : "Banner created.");
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(b: Banner) {
    if (!confirm(`Delete banner "${b.title}"?`)) return;
    try {
      await deleteBanner(b.id, token);
      setBanners((prev) => prev.filter((x) => x.id !== b.id));
      toast.success("Banner deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div>
      <AdminToolbar
        title="Banners"
        subtitle={`${banners.length} banners`}
        action={
          <button onClick={openCreate} className="btn-gold px-5 py-2.5 text-xs">
            + Add Banner
          </button>
        }
      />

      {loading ? (
        <Card>
          <Spinner />
        </Card>
      ) : banners.length === 0 ? (
        <Card>
          <Empty message="No banners yet." />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((b) => (
            <Card key={b.id} className="flex flex-col overflow-hidden">
              <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-charcoal to-card">
                <span className="font-logo text-2xl tracking-luxe text-gold/20">RT</span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="mb-2 inline-block w-fit rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                  {b.position.replace(/_/g, " ")}
                </span>
                <p className="font-medium text-ink">{b.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{b.subtitle}</p>
                <div className="mt-4 flex gap-3 border-t border-line pt-3 text-xs">
                  <button onClick={() => openEdit(b)} className="text-gold hover:opacity-70">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(b)} className="text-rose-300 hover:opacity-70">
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Edit Banner" : "Add Banner"}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Subtitle">
            <input
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="CTA text">
              <input
                value={form.ctaText}
                onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="CTA link">
              <input
                value={form.ctaLink}
                onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
                placeholder="/shop"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Position">
            <select
              value={form.position}
              onChange={(e) => setForm((f) => ({ ...f, position: e.target.value as Banner["position"] }))}
              className={inputClass}
            >
              {POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </Field>
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
