"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/lib/types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  logout: () => void;
  setHydrated: () => void;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hydrated: false,
      setAuth: (user, token) => set({ user, token }),
      updateUser: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : s.user })),
      logout: () => set({ user: null, token: null }),
      setHydrated: () => set({ hydrated: true }),
      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: "rt-auth",
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
