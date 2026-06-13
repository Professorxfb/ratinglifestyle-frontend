"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { searchProducts } from "@/lib/api";
import { formatBDT } from "@/lib/site";
import type { Product } from "@/lib/types";
import Placeholder from "@/components/ui/Placeholder";

export default function SearchBar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // debounce 500ms
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setResults((await searchProducts(query)).slice(0, 6));
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-obsidian/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="container-luxe pt-28"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={submit} className="relative">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, categories…"
                className="w-full border-b-2 border-gold bg-transparent pb-4 font-serif text-2xl text-ink placeholder:text-muted focus:outline-none sm:text-3xl"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-0 top-1 text-sm uppercase tracking-luxe text-muted hover:text-gold"
              >
                Close
              </button>
            </form>

            {results.length > 0 && (
              <div className="mt-6 divide-y divide-line rounded-sm border border-line bg-card">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-charcoal"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm">
                      <Placeholder seed={p.id} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-ink">{p.name}</p>
                      <p className="text-xs text-muted">{p.categoryName}</p>
                    </div>
                    <span className="text-sm text-gold">
                      {formatBDT(p.salePrice ?? p.basePrice)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            {query.trim() && results.length === 0 && (
              <p className="mt-6 text-center text-sm text-muted">
                No products found for “{query}”.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
