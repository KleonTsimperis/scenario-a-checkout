import React from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { CartDrawer } from '../src/components/cart/CartDrawer';
import { useCartStore } from '../src/stores/useCartStore';

describe('Scenario A: SSR and Hydration Resilience', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [{ id: 'item-1', name: 'Mechanical Keyboard', price: 120, quantity: 1 }],
      optimisticVersion: 0,
    });
    window.localStorage.clear();
  });

  it('MUST NOT mismatch server-rendered markup when client localStorage contains custom currency', () => {
    // 1. Simulate server render (SSR output where window.localStorage is undefined or empty)
    const serverHtml = renderToString(<CartDrawer />);

    // 2. Simulate client environment where localStorage has a stored preference 'USD'
    window.localStorage.setItem('user_currency', 'USD');

    // 3. Render in client DOM
    const { container } = render(<CartDrawer />);
    const clientInitialHtml = container.innerHTML;

    // INTENTIONAL BUG 2 ASSERTION:
    // When useCurrencyLocale() reads window.localStorage synchronously during render,
    // server HTML has 'EUR €142.80' but client initial HTML has 'USD $142.80', causing Next.js hydration crash.
    // The fixed implementation must defer client-only preference loading (e.g. via useEffect) or
    // provide an SSR-safe boundary so the initial client DOM matches serverHtml.
    expect(clientInitialHtml).toBe(serverHtml);
  });
});
