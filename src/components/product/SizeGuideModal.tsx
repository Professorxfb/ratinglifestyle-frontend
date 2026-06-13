"use client";

import { AnimatePresence, motion } from "framer-motion";

const ROWS = [
  { size: "S", chest: "36-38", length: "27", shoulder: "17" },
  { size: "M", chest: "38-40", length: "28", shoulder: "18" },
  { size: "L", chest: "40-42", length: "29", shoulder: "19" },
  { size: "XL", chest: "42-44", length: "30", shoulder: "20" },
  { size: "XXL", chest: "44-46", length: "31", shoulder: "21" },
];

export default function SizeGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg rounded-sm border border-line bg-card p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-2xl text-ink">Size Guide</h3>
              <button onClick={onClose} className="text-muted hover:text-gold" aria-label="Close">
                ✕
              </button>
            </div>
            <p className="mb-5 text-sm text-muted">All measurements in inches.</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-gold">
                  <th className="py-3">Size</th>
                  <th className="py-3">Chest</th>
                  <th className="py-3">Length</th>
                  <th className="py-3">Shoulder</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.size} className="border-b border-line/50 text-ink/80">
                    <td className="py-3 font-semibold text-ink">{r.size}</td>
                    <td className="py-3">{r.chest}</td>
                    <td className="py-3">{r.length}</td>
                    <td className="py-3">{r.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
