"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  add: (a: Omit<Address, "id">) => void;
  remove: (id: string) => void;
  setDefault: (id: string) => void;
}

export const useAddresses = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [],
      add: (a) =>
        set((s) => {
          const id = `addr_${s.addresses.length + 1}_${a.phone.slice(-4)}`;
          const makeDefault = a.isDefault || s.addresses.length === 0;
          return {
            addresses: [
              ...s.addresses.map((x) => (makeDefault ? { ...x, isDefault: false } : x)),
              { ...a, id, isDefault: makeDefault },
            ],
          };
        }),
      remove: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
      setDefault: (id) =>
        set((s) => ({
          addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),
    }),
    { name: "rt-addresses" },
  ),
);
