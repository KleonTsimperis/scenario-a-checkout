import { useState, useEffect } from 'react';

// SOLUTION 2:
// Returns server-safe default ('EUR') during initial render pass (both SSR and initial client mount).
// Defers loading client preference from window.localStorage until after initial hydration paint,
// guaranteeing DOM parity and preventing Next.js React hydration mismatch crashes.
export function useCurrencyLocale() {
  const [currency, setCurrency] = useState('EUR');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem('user_currency');
        if (saved) {
          setCurrency(saved);
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return currency;
}
