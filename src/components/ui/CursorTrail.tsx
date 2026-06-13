"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Subtle gold dot trail that follows the cursor on desktop.
 * Disabled on touch devices and when the user prefers reduced motion.
 * Uses a single rAF loop with eased interpolation (no React re-renders).
 */
export default function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;
    setEnabled(true);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { ...target };
    const ringPos = { ...target };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const onDown = () => ringRef.current?.style.setProperty("transform", "translate(-50%,-50%) scale(0.7)");
    const onUp = () => ringRef.current?.style.setProperty("transform", "translate(-50%,-50%) scale(1)");

    const tick = () => {
      dotPos.x += (target.x - dotPos.x) * 0.35;
      dotPos.y += (target.y - dotPos.y) * 0.35;
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.left = `${dotPos.x}px`;
        dotRef.current.style.top = `${dotPos.y}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.x}px`;
        ringRef.current.style.top = `${ringPos.y}px`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      <div
        ref={ringRef}
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/60"
        style={{ width: 30, height: 30, transform: "translate(-50%,-50%)", transition: "transform 0.2s ease" }}
      />
      <div
        ref={dotRef}
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
        style={{ width: 6, height: 6, boxShadow: "0 0 10px rgb(var(--accent) / 0.8)" }}
      />
    </div>
  );
}
