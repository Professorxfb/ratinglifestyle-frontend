"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Reveal from "@/components/ui/Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    toast.success("Welcome to the list! Check your inbox for WELCOME10.");
    setEmail("");
  }

  return (
    <section className="container-luxe py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-sm border border-gold/30 bg-charcoal px-6 py-16 text-center">
          <p className="eyebrow mb-3">Join the Atelier</p>
          <h2 className="heading-display mx-auto max-w-xl">
            Get Exclusive Offers in Your Inbox
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Subscribe for early access to new collections, members-only deals, and styling notes.
          </p>
          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-line bg-obsidian px-4 py-3 text-ink placeholder:text-muted focus:border-gold focus:outline-none"
            />
            <button type="submit" className="btn-gold shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}
