"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { submitContact } from "@/lib/contact";

const SUBJECTS = [
  "General Enquiry",
  "Order Support",
  "Returns & Exchanges",
  "Wholesale / Bulk",
  "Press & Collaborations",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setLoading(true);
    try {
      const message = await submitContact(form);
      setSent(true);
      toast.success(message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-sm border border-gold/40 bg-card p-8 text-center">
        <p className="font-display text-2xl text-ink">Message received</p>
        <p className="mt-3 text-sm text-muted">
          Thank you, {form.name.split(" ")[0]}. Our team will be in touch within 24 hours.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setForm({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" });
          }}
          className="btn-outline mt-6"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Name *</span>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            autoComplete="name"
            className="w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Email *</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
            className="w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Phone</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            autoComplete="tel"
            className="w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Subject</span>
          <select
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            className="w-full border border-line bg-obsidian px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Message *</span>
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={5}
          className="w-full resize-none border border-line bg-obsidian px-4 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
        />
      </label>
      <button type="submit" disabled={loading} className="btn-gold w-full sm:w-auto">
        {loading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
