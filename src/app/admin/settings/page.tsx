"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import { getAdminSettings, updateSettings } from "@/lib/admin-api";
import { AdminToolbar, Card, Field, Spinner, inputClass } from "@/components/admin/ui";
import type { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminSettings(token)
      .then(setSettings)
      .finally(() => setLoading(false));
  }, [token]);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const saved = await updateSettings(settings, token);
      setSettings(saved);
      toast.success("Settings saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;
  if (!settings) return <p className="text-sm text-rose-300">Failed to load settings.</p>;

  return (
    <div className="max-w-3xl">
      <AdminToolbar title="Settings" subtitle="Store information and contact details." />

      <form onSubmit={submit} className="space-y-6">
        <Card className="space-y-4 p-6">
          <p className="text-xs uppercase tracking-wide text-gold">General</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Site name">
              <input value={settings.siteName} onChange={(e) => set("siteName", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Tagline">
              <input value={settings.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputClass} />
            </Field>
          </div>
          <Field label="Free-shipping threshold (৳)">
            <input
              type="number"
              min={0}
              value={settings.freeShippingThreshold}
              onChange={(e) => set("freeShippingThreshold", Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </Card>

        <Card className="space-y-4 p-6">
          <p className="text-xs uppercase tracking-wide text-gold">Contact</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <input type="email" value={settings.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Phone">
              <input value={settings.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} />
            </Field>
            <Field label="WhatsApp">
              <input value={settings.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Address">
              <input value={settings.address} onChange={(e) => set("address", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <p className="text-xs uppercase tracking-wide text-gold">Social</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook">
              <input value={settings.facebook} onChange={(e) => set("facebook", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Instagram">
              <input value={settings.instagram} onChange={(e) => set("instagram", e.target.value)} className={inputClass} />
            </Field>
            <Field label="YouTube">
              <input value={settings.youtube} onChange={(e) => set("youtube", e.target.value)} className={inputClass} />
            </Field>
            <Field label="TikTok">
              <input value={settings.tiktok} onChange={(e) => set("tiktok", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </Card>

        <button type="submit" disabled={saving} className="btn-gold px-6 py-2.5 text-xs">
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
