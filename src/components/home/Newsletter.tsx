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
    <section className="container-luxe py-28">
      <Reveal>
        <div className="grain relative overflow-hidden rounded-xl gold-border-grad px-6 py-20 text-center">
          {/* ambient gold glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative">
            <p className="eyebrow mb-3">Join the Atelier</p>
            <h2 className="mx-auto max-w-xl font-display font-light tracking-cinematic text-4xl leading-tight text-ink sm:text-5xl">
              Get Exclusive Offers in Your <span className="text-gold-grad italic">Inbox</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-muted">
              Subscribe for early access to new collections, members-only deals, and styling notes.
            </p>
            <form onSubmit={submit} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
              <div className="flex-1 gold-border-grad rounded-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-4 py-3.5 text-ink placeholder:text-muted focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-gold shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
