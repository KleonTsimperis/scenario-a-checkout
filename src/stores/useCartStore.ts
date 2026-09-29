import { create } from 'zustand';
import { CartItem, OptimisticUpdateResult } from '@/types/cart';

interface CartState {
  items: CartItem[];
  optimisticVersion: number;
  setItems: (items: CartItem[]) => void;
  updateQuantityOptimistic: (id: string, delta: number) => OptimisticUpdateResult;
  rollback: (previousItems: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [
    { id: 'item-1', name: 'Mechanical Keyboard', price: 120, quantity: 1 },
    { id: 'item-2', name: 'Ergonomic Mouse', price: 80, quantity: 1 },
  ],
  optimisticVersion: 0,

  setItems: (items) => set({ items }),

  updateQuantityOptimistic: (id, delta) => {
    const previousItems = get().items;
    const rollbackId = `rollback_${Date.now()}_${Math.random()}`;

    // INTENTIONAL BUG 1:
    // Updates state without tracking mutation sequence IDs or reconciling concurrent in-flight changes.
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      ),
      optimisticVersion: state.optimisticVersion + 1,
    }));

    return { rollbackId, previousItems };
  },

  rollback: (previousItems) => {
    // INTENTIONAL BUG 1:
    // Blindly overwrites current items with old items, wiping out subsequent optimistic mutations.
    set({ items: previousItems });
  },
}));
