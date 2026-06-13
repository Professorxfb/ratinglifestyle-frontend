"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import { updateProfile, changePassword } from "@/lib/auth-api";

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await updateProfile(token!, { name, phone });
      updateUser({ name: updated.name ?? name, phone: updated.phone ?? phone });
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.next.length < 8) return toast.error("New password must be at least 8 characters.");
    if (pw.next !== pw.confirm) return toast.error("New passwords do not match.");
    setSavingPw(true);
    try {
      const msg = await changePassword(token!, pw.current, pw.next, pw.confirm);
      toast.success(msg);
      setPw({ current: "", next: "", confirm: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password.");
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="max-w-xl space-y-10">
      <section>
        <h2 className="mb-5 font-display text-2xl text-ink">Profile Details</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <Field label="Full Name"><input className={cls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Email"><input className={clsDisabled} value={user?.email ?? ""} disabled /></Field>
          <Field label="Phone"><input className={cls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="017XXXXXXXX" /></Field>
          <button type="submit" disabled={savingProfile} className="btn-gold">
            {savingProfile ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </section>

      <section className="border-t border-line pt-10">
        <h2 className="mb-5 font-display text-2xl text-ink">Change Password</h2>
        <form onSubmit={savePassword} className="space-y-4">
          <Field label="Current Password"><input type="password" className={cls} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" /></Field>
          <Field label="New Password"><input type="password" className={cls} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" /></Field>
          <Field label="Confirm New Password"><input type="password" className={cls} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" /></Field>
          <button type="submit" disabled={savingPw} className="btn-outline">
            {savingPw ? "Updating…" : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
}

const cls = "w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none";
const clsDisabled = cls + " cursor-not-allowed opacity-60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}
