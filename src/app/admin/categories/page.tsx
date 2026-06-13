"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import {
  getAdminCategories,
  saveCategory,
  deleteCategory,
  type CategoryInput,
} from "@/lib/admin-api";
import { AdminToolbar, Card, Empty, Spinner, Modal, Field, inputClass } from "@/components/admin/ui";
import type { Category } from "@/lib/types";

const EMPTY: CategoryInput = { name: "", slug: "", parentId: null, description: "" };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    getAdminCategories(token)
      .then(setCategories)
      .finally(() => setLoading(false));
  }
  useEffect(load, [token]);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(c: Category) {
    setEditId(c.id);
    setForm({ name: c.name, slug: c.slug, parentId: c.parentId, description: c.description ?? "" });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) {
      toast.error("Name is required.");
      return;
    }
    setSaving(true);
    try {
      await saveCategory({ ...form, slug: form.slug || slugify(form.name) }, editId, token);
      toast.success(editId ? "Category updated." : "Category created.");
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c: Category) {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    try {
      await deleteCategory(c.id, token);
      setCategories((prev) => prev.filter((x) => x.id !== c.id));
      toast.success("Category deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  const parentName = (id: number | null) =>
    id === null ? "—" : categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div>
      <AdminToolbar
        title="Categories"
        subtitle={`${categories.length} categories`}
        action={
          <button onClick={openCreate} className="btn-gold px-5 py-2.5 text-xs">
            + Add Category
          </button>
        }
      />

      <Card>
        {loading ? (
          <Spinner />
        ) : categories.length === 0 ? (
          <Empty message="No categories yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Parent</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-line/50 last:border-0 hover:bg-charcoal/40">
                    <td className="px-4 py-3 text-ink">{c.name}</td>
                    <td className="px-4 py-3 text-muted">{c.slug}</td>
                    <td className="px-4 py-3 text-ink/70">{parentName(c.parentId)}</td>
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

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Edit Category" : "Add Category"}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Slug" hint="Auto-generated if left blank.">
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Parent category">
            <select
              value={form.parentId ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value === "" ? null : Number(e.target.value) }))}
              className={inputClass}
            >
              <option value="">None (top level)</option>
              {categories
                .filter((c) => c.id !== editId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className={`${inputClass} resize-none`}
            />
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
