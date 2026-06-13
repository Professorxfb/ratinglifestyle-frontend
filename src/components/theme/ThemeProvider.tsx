"use client";

import { useEffect } from "react";
import { useTheme } from "@/store/theme";

/**
 * Applies the persisted theme to <html data-theme="…">.
 * A blocking inline script in layout.tsx sets the attribute before paint to
 * avoid FOUC; this component keeps it in sync after hydration / on change.
 */
export default function ThemeProvider() {
  const themeId = useTheme((s) => s.themeId);

  useEffect(() => {
    document.documentElement.dataset.theme = themeId;
  }, [themeId]);

  return null;
}
