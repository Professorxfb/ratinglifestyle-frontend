"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "@/lib/mock-data";

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-obsidian/70 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-[70] w-80 max-w-[85vw] overflow-y-auto border-r border-line bg-charcoal p-6 lg:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-logo text-lg tracking-luxe text-ink">
                RUPKOTHA <span className="text-gold">TRENDZ</span>
              </span>
              <button onClick={onClose} aria-label="Close menu" className="text-muted hover:text-gold">
                ✕
              </button>
            </div>

            <nav className="space-y-1">
              <Link href="/shop" onClick={onClose} className="block py-3 font-serif text-lg text-ink">
                Shop All
              </Link>
              {categories.map((cat) => (
                <div key={cat.id} className="border-t border-line/50">
                  <button
                    className="flex w-full items-center justify-between py-3 font-serif text-lg text-ink"
                    onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                  >
                    {cat.name}
                    <span className="text-gold">{expanded === cat.id ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {expanded === cat.id && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pb-2 pl-4"
                      >
                        <li>
                          <Link
                            href={`/shop/${cat.slug}`}
                            onClick={onClose}
                            className="block py-2 text-sm text-gold"
                          >
                            All {cat.name}
                          </Link>
                        </li>
                        {cat.subcategories?.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`/shop/${cat.slug}/${sub.slug}`}
                              onClick={onClose}
                              className="block py-2 text-sm text-ink/70 hover:text-gold"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Link
                href="/deals"
                onClick={onClose}
                className="block border-t border-line/50 py-3 font-serif text-lg text-gold"
              >
                Sale
              </Link>
            </nav>

            <div className="mt-8 space-y-2 border-t border-line pt-6 text-sm">
              <Link href="/account" onClick={onClose} className="block py-2 text-ink/70 hover:text-gold">
                My Account
              </Link>
              <Link href="/account/orders" onClick={onClose} className="block py-2 text-ink/70 hover:text-gold">
                Track Orders
              </Link>
              <Link href="/contact" onClick={onClose} className="block py-2 text-ink/70 hover:text-gold">
                Contact Us
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
