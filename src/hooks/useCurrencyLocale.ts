// INTENTIONAL BUG 2:
// Accesses window / localStorage synchronously during render evaluation.
// On the server (Next.js SSR), this returns 'EUR'.
// On the client, if localStorage has 'USD', it immediately returns 'USD',
// creating a React Hydration Mismatch error.
export function useCurrencyLocale() {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem('user_currency');
    if (saved) {
      return saved;
    }
  }
  return 'EUR';
}
