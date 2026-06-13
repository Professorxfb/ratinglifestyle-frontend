"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface FaqItem {
  question: string;
  answer: string;
}

function Accordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-medium text-ink">{item.question}</span>
        <span
          className={`shrink-0 text-gold transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-ink/70">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div>
      {items.map((item, i) => (
        <Accordion key={i} item={item} />
      ))}
    </div>
  );
}
