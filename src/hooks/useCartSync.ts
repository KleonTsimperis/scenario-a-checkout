import { useState, useCallback } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { cartClient } from '@/lib/api/cartClient';

export function useCartSync() {
  const { updateQuantityOptimistic, rollback, setItems } = useCartStore();
  const [isSyncing, setIsSyncing] = useState(false);

  const syncQuantityChange = useCallback(
    async (itemId: string, delta: number) => {
      // 1. Optimistic local update
      const { previousItems } = updateQuantityOptimistic(itemId, delta);
      setIsSyncing(true);

      try {
        // 2. Network call with synthetic latency
        const updatedCart = await cartClient.updateItem(itemId, delta);

        // INTENTIONAL BUG 1:
        // No request sequence ID, timestamp, or AbortController check.
        // If an older request resolves AFTER a newer request, it will overwrite the store:
        setItems(updatedCart.items);
      } catch (err) {
        // Blind rollback destroys concurrent mutations
        rollback(previousItems);
      } finally {
        setIsSyncing(false);
      }
    },
    [updateQuantityOptimistic, rollback, setItems]
  );

  return { syncQuantityChange, isSyncing };
}
