import { useCartStore } from '../src/stores/useCartStore';
import { useCartSync } from '../src/hooks/useCartSync';
import { cartClient } from '../src/lib/api/cartClient';
import { renderHook, act } from '@testing-library/react';

jest.mock('../src/lib/api/cartClient');

describe('Scenario A: Cart Synchronization & Out-of-Order Resolution', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [{ id: 'item-1', name: 'Mechanical Keyboard', price: 120, quantity: 1 }],
      optimisticVersion: 0,
    });
    jest.clearAllMocks();
  });

  it('MUST maintain correct final state when asynchronous network requests resolve out-of-order', async () => {
    const { result } = renderHook(() => useCartSync());

    let resolveReq1: (val: any) => void = () => {};
    let resolveReq2: (val: any) => void = () => {};

    const req1Promise = new Promise((res) => {
      resolveReq1 = res;
    });
    const req2Promise = new Promise((res) => {
      resolveReq2 = res;
    });

    (cartClient.updateItem as jest.Mock)
      // Call 1: User clicks +1 (target qty: 2). Slow network, resolves second.
      .mockReturnValueOnce(req1Promise)
      // Call 2: User clicks +1 again (target qty: 3). Fast network, resolves first.
      .mockReturnValueOnce(req2Promise);

    // Act 1: User rapidly triggers two increments
    await act(async () => {
      result.current.syncQuantityChange('item-1', 1);
      result.current.syncQuantityChange('item-1', 1);
    });

    // Optimistic expectation: UI should immediately reflect both increments (qty = 3)
    expect(useCartStore.getState().items[0].quantity).toBe(3);

    // Act 2: Network resolves OUT OF ORDER: Request 2 arrives FIRST with quantity 3
    await act(async () => {
      resolveReq2({
        items: [{ id: 'item-1', name: 'Mechanical Keyboard', price: 120, quantity: 3 }],
        subtotal: 360,
        currency: 'EUR',
        updatedAt: Date.now(),
      });
    });

    // Act 3: Stale Request 1 arrives LATE with quantity 2
    await act(async () => {
      resolveReq1({
        items: [{ id: 'item-1', name: 'Mechanical Keyboard', price: 120, quantity: 2 }],
        subtotal: 240,
        currency: 'EUR',
        updatedAt: Date.now() - 500,
      });
    });

    // CRITICAL ASSERTION:
    // Stale Request 1 MUST NOT overwrite the latest user state!
    // In the buggy code, this assertion FAILS because Request 1 blindly overwrote the state with quantity = 2.
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });
});
