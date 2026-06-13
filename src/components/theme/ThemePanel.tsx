"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { THEMES, themeMeta, useTheme } from "@/store/theme";

export default function ThemePanel() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const themeId = useTheme((s) => s.themeId);
  const setTheme = useTheme((s) => s.setTheme);
  const toggleMode = useTheme((s) => s.toggleMode);

  useEffect(() => setMounted(true), []);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isLight = mounted && themeMeta(themeId).mode === "light";

  return (
    <div ref={ref} className="fixed bottom-6 left-5 z-[70] flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel w-72 rounded-lg p-5 shadow-luxe"
          >
            <p className="font-logo text-sm uppercase tracking-cinematic text-gold">
              Choose Your Palette
            </p>
            <div className="mt-1 h-px w-12 bg-gold-gradient" />

            {/* Swatches */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              {THEMES.map((t) => {
                const active = mounted && t.id === themeId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="group flex flex-col items-center gap-2"
                    aria-pressed={active}
                  >
                    <span
                      className={clsx(
                        "relative flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110",
                        active ? "ring-2 ring-gold ring-offset-2 ring-offset-transparent" : "",
                      )}
                      style={{ background: t.swatch[0] }}
                    >
                      <span
                        className="h-5 w-5 rounded-full"
                        style={{ background: t.swatch[1] }}
                      />
                      {active && (
                        <motion.span
                          layoutId="theme-active-dot"
                          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-gradient text-[9px] text-obsidian"
                        >
                          ✓
                        </motion.span>
                      )}
                    </span>
                    <span
                      className={clsx(
                        "text-center text-[11px] leading-tight tracking-wide transition-colors",
                        active ? "text-gold" : "text-muted group-hover:text-ink",
                      )}
                    >
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Light / Dark toggle */}
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span className="text-xs uppercase tracking-cinematic text-muted">
                {isLight ? "Light Mode" : "Dark Mode"}
              </span>
              <button
                role="switch"
                aria-checked={isLight}
                aria-label="Toggle light and dark mode"
                onClick={toggleMode}
                className={clsx(
                  "relative h-6 w-12 rounded-full border transition-colors duration-300",
                  isLight ? "border-gold bg-gold-gradient" : "border-line bg-card",
                )}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  className={clsx(
                    "absolute top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full text-[9px]",
                    isLight ? "right-1 bg-obsidian text-gold" : "left-1 bg-gold-gradient text-obsidian",
                  )}
                >
                  {isLight ? "☀" : "☾"}
                </motion.span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Palette trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open theme palette"
        aria-expanded={open}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full glass-panel shadow-gold transition-transform duration-300 hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-gold/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
        <svg
          className="relative h-5 w-5 text-gold"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-.8.7-1.5 1.5-1.5H17a5 5 0 0 0 5-5c0-5-4.5-9-10-9z" />
          <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
          <circle cx="12" cy="7.5" r="1" fill="currentColor" />
          <circle cx="16.5" cy="10.5" r="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
