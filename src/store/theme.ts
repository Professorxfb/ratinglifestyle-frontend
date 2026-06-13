"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeId = "obsidian-gold" | "ivory-pearl" | "midnight-rose" | "royal-emerald";
export type ThemeMode = "dark" | "light";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  mode: ThemeMode;
  /** swatch[0] = background, swatch[1] = accent — used by the switcher dots */
  swatch: [string, string];
}

export const THEMES: ThemeMeta[] = [
  { id: "obsidian-gold", name: "Obsidian Gold", mode: "dark", swatch: ["#050505", "#C9A84C"] },
  { id: "ivory-pearl", name: "Ivory Pearl", mode: "light", swatch: ["#F8F5F0", "#8B6914"] },
  { id: "midnight-rose", name: "Midnight Rose", mode: "dark", swatch: ["#080510", "#C9748A"] },
  { id: "royal-emerald", name: "Royal Emerald", mode: "dark", swatch: ["#050A08", "#4CAF82"] },
];

export const LIGHT_THEME: ThemeId = "ivory-pearl";
const DEFAULT_THEME: ThemeId = "obsidian-gold";

export function themeMeta(id: ThemeId): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

interface ThemeState {
  themeId: ThemeId;
  /** Remembers the last dark theme so the light/dark toggle can restore it. */
  prevDark: ThemeId;
  setTheme: (id: ThemeId) => void;
  /** Toggle between the light theme and the last-used dark theme. */
  toggleMode: () => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeId: DEFAULT_THEME,
      prevDark: DEFAULT_THEME,
      setTheme: (id) =>
        set(() => ({
          themeId: id,
          prevDark: themeMeta(id).mode === "dark" ? id : get().prevDark,
        })),
      toggleMode: () => {
        const { themeId, prevDark } = get();
        if (themeMeta(themeId).mode === "light") {
          set({ themeId: prevDark });
        } else {
          set({ themeId: LIGHT_THEME, prevDark: themeId });
        }
      },
    }),
    { name: "rt-theme" },
  ),
);
