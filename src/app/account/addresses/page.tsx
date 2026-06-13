"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import { useAddresses } from "@/store/addresses";

const DISTRICTS = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh"];
const EMPTY = { label: "Home", name: "", phone: "", address: "", city: "", district: "Dhaka", postalCode: "", isDefault: false };

export default function AddressesPage() {
  const { addresses, add, remove, setDefault } = useAddresses();
  const [form, setForm] = useState(EMPTY);
  const [adding, setAdding] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      toast.error("Please complete name, phone, address and city.");
      return;
    }
    add(form);
    toast.success("Address saved.");
    setForm(EMPTY);
    setAdding(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">Saved Addresses</h2>
        <button onClick={() => setAdding((v) => !v)} className="btn-ghost">
          {adding ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {adding && (
        <form onSubmit={save} className="mb-8 grid grid-cols-1 gap-4 rounded-sm border border-line bg-card p-6 sm:grid-cols-2">
          <Field label="Label"><input className={cls} value={form.label} onChange={set("label")} placeholder="Home / Office" /></Field>
          <Field label="Full Name *"><input className={cls} value={form.name} onChange={set("name")} /></Field>
          <Field label="Phone *"><input className={cls} value={form.phone} onChange={set("phone")} /></Field>
          <Field label="City / Area *"><input className={cls} value={form.city} onChange={set("city")} /></Field>
          <Field label="District">
            <select className={cls} value={form.district} onChange={set("district")}>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Postal Code"><input className={cls} value={form.postalCode} onChange={set("postalCode")} /></Field>
          <div className="sm:col-span-2">
            <Field label="Address *"><input className={cls} value={form.address} onChange={set("address")} /></Field>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-gold">Save Address</button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="rounded-sm border border-line bg-card p-10 text-center text-muted">
          No saved addresses yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={clsx(
                "rounded-sm border bg-card p-5",
                a.isDefault ? "border-gold/50" : "border-line",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-gold">{a.label}</span>
                {a.isDefault && <span className="text-[10px] uppercase tracking-wide text-muted">Default</span>}
              </div>
              <p className="mt-2 text-ink">{a.name}</p>
              <p className="text-sm text-muted">{a.phone}</p>
              <p className="mt-1 text-sm text-muted">{a.address}, {a.city}, {a.district} {a.postalCode}</p>
              <div className="mt-4 flex gap-3 text-xs">
                {!a.isDefault && (
                  <button onClick={() => setDefault(a.id)} className="text-gold hover:opacity-70">Set default</button>
                )}
                <button onClick={() => remove(a.id)} className="text-muted hover:text-danger">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const cls = "w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}
