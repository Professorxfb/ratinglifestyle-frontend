"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/store/cart";
import { formatBDT, SITE } from "@/lib/site";
import Placeholder from "@/components/ui/Placeholder";

export default function CartDrawer() {
  const { isOpen, closeCart, lines, updateQuantity, removeLine } = useCart();
  const subtotal = useCart((s) => s.subtotal());
  const remaining = Math.max(0, SITE.freeShippingThreshold - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-obsidian/70 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-[90] flex w-[420px] max-w-[90vw] flex-col border-l border-line bg-charcoal"
          >
            <div className="flex items-center justify-between border-b border-line p-5">
              <h2 className="font-display text-xl text-ink">
                Your Bag <span className="text-gold">({lines.length})</span>
              </h2>
              <button onClick={closeCart} aria-label="Close cart" className="text-muted hover:text-gold">
                ✕
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="font-serif text-lg text-muted">Your bag is empty.</p>
                <button onClick={closeCart} className="btn-outline">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Free shipping progress */}
                {remaining > 0 ? (
                  <p className="border-b border-line bg-obsidian px-5 py-3 text-center text-xs text-platinum/80">
                    Add <span className="text-gold">{formatBDT(remaining)}</span> more for free shipping
                  </p>
                ) : (
                  <p className="border-b border-line bg-obsidian px-5 py-3 text-center text-xs text-success">
                    🎉 You’ve unlocked free shipping!
                  </p>
                )}

                <div className="flex-1 overflow-y-auto p-5">
                  {lines.map((line) => (
                    <div key={line.key} className="mb-5 flex gap-4">
                      <Link
                        href={`/product/${line.slug}`}
                        onClick={closeCart}
                        className="h-24 w-20 shrink-0 overflow-hidden rounded-sm"
                      >
                        <Placeholder seed={line.productId} />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <Link
                            href={`/product/${line.slug}`}
                            onClick={closeCart}
                            className="font-serif text-sm text-ink hover:text-gold"
                          >
                            {line.name}
                          </Link>
                          <button
                            onClick={() => removeLine(line.key)}
                            aria-label="Remove"
                            className="text-muted hover:text-danger"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          {[line.color, line.size].filter(Boolean).join(" / ")}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center border border-line">
                            <button
                              onClick={() => updateQuantity(line.key, line.quantity - 1)}
                              className="px-2.5 py-1 text-ink/70 hover:text-gold"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="min-w-8 text-center text-sm text-ink">{line.quantity}</span>
                            <button
                              onClick={() => updateQuantity(line.key, line.quantity + 1)}
                              className="px-2.5 py-1 text-ink/70 hover:text-gold"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm text-gold">
                            {formatBDT(line.unitPrice * line.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-line p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm uppercase tracking-wide text-muted">Subtotal</span>
                    <span className="font-display text-xl text-ink">{formatBDT(subtotal)}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href="/checkout" onClick={closeCart} className="btn-gold w-full">
                      Checkout
                    </Link>
                    <Link href="/cart" onClick={closeCart} className="btn-ghost w-full justify-center">
                      View Bag
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
