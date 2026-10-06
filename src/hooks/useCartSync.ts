import { useState, useCallback, useRef } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { cartClient } from '@/lib/api/cartClient';

export function useCartSync() {
  const { updateQuantityOptimistic, rollback, setItems } = useCartStore();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Track monotonic sequence of mutation requests to discard out-of-order stale responses
  const latestMutationRef = useRef(0);

  const syncQuantityChange = useCallback(
    async (itemId: string, delta: number) => {
      // 1. Increment sequence counter and apply optimistic update
      const currentMutationId = ++latestMutationRef.current;
      const { previousItems } = updateQuantityOptimistic(itemId, delta);
      setIsSyncing(true);

      try {
        // 2. Network call with synthetic latency
        const updatedCart = await cartClient.updateItem(itemId, delta);

        // SOLUTION 1:
        // Only apply response if this is the latest mutation in flight.
        // Stale responses arriving out of order are discarded.
        if (currentMutationId === latestMutationRef.current) {
          setItems(updatedCart.items);
        }
      } catch (err) {
        if (currentMutationId === latestMutationRef.current) {
          rollback(previousItems);
        }
      } finally {
        if (currentMutationId === latestMutationRef.current) {
          setIsSyncing(false);
        }
      }
    },
    [updateQuantityOptimistic, rollback, setItems]
  );

  return { syncQuantityChange, isSyncing };
}
