import React from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCartStore } from '@/stores/useCartStore';

describe('Scenario A: SSR and Hydration Resilience', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [
        { id: 'item-1', name: 'Mechanical Keyboard', price: 120, quantity: 1 },
        { id: 'item-2', name: 'Ergonomic Mouse', price: 80, quantity: 1 },
      ],
      optimisticVersion: 0,
    });
    window.localStorage.clear();
  });

  it('MUST NOT mismatch server-rendered markup when client localStorage contains custom currency', () => {
    // 1. Simulate server render (SSR output where window.localStorage is undefined or empty)
    const rawServerHtml = renderToString(<CartDrawer />);
    // Strip React SSR delimiter comments for clean DOM markup comparison
    const serverHtml = rawServerHtml.replace(/<!-- -->/g, '');

    // 2. Simulate client environment where localStorage has a stored preference 'USD'
    window.localStorage.setItem('user_currency', 'USD');

    // 3. Render in client DOM
    const { container } = render(<CartDrawer />);
    const clientInitialHtml = container.innerHTML;

    // The fixed implementation must defer client-only preference loading (e.g. via useEffect) or
    // provide an SSR-safe boundary so the initial client DOM matches serverHtml.
    expect(clientInitialHtml).toBe(serverHtml);
  });
});
