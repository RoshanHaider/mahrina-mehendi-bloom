import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  qty: number;
};

export type Customer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
};

type State = {
  items: CartItem[];
  customer: Customer;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setCustomer: (c: Customer) => void;
};

export const useCart = create<State>()(
  persist(
    (set) => ({
      items: [],
      customer: { name: "", phone: "", email: "", address: "", city: "Lahore" },
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return { items: s.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)) };
          }
          return { items: [...s.items, { ...item, qty: 1 }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      setCustomer: (c) => set({ customer: c }),
    }),
    { name: "mahrina-cart" }
  )
);

export function totalQty(items: CartItem[]) {
  return items.reduce((s, i) => s + i.qty, 0);
}
export function subtotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.qty * i.price, 0);
}
