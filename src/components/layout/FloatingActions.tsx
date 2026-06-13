"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "@/lib/site";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waNumber = SITE.whatsapp.replace(/[^0-9]/g, "");

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-center gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-ink transition-colors hover:border-gold hover:text-gold"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${waNumber}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-gold/30" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient shadow-gold transition-transform group-hover:scale-110">
          <svg className="h-7 w-7 text-obsidian" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.04c-.24.68-1.4 1.3-1.94 1.34-.5.04-.97.21-3.27-.68-2.76-1.09-4.51-3.92-4.65-4.1-.13-.18-1.1-1.47-1.1-2.8 0-1.33.7-1.98.95-2.25.24-.27.52-.34.7-.34.18 0 .35 0 .5.01.16.01.38-.06.59.45.24.58.81 2 .88 2.15.07.14.12.31.02.49-.09.18-.14.29-.27.45-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.22.61-.13.25.09 1.58.75 1.85.88.27.14.45.2.52.32.07.11.07.66-.17 1.34z" />
          </svg>
        </span>
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-sm border border-line bg-card px-3 py-1.5 text-xs text-ink group-hover:block">
          Chat with us
        </span>
      </a>
    </div>
  );
}
