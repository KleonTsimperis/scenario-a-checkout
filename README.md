# Scenario A: Optimistic Checkout State Machine

Welcome to the technical evaluation challenge.

## Objective
This Next.js application implements an e-commerce checkout drawer with optimistic UI updates. Currently, there are two distinct, interdependent bugs in the project:

1. **Race Condition / State Desynchronization (`src/hooks/useCartSync.ts`, `src/stores/useCartStore.ts`):**
   * Rapid clicks on item quantity trigger optimistic updates.
   * If network requests complete out of order (e.g., Request 1 resolves after Request 2), the older response overwrites the latest state.
   * *Requirement:* Do **not** disable the buttons or debounce user clicks. The UI must remain immediately responsive.

2. **Hydration Mismatch (`src/components/cart/CartDrawer.tsx`, `src/hooks/useCurrencyLocale.ts`):**
   * Storing and retrieving the user currency preference directly in render causes server markup and client hydration markup to diverge.
   * *Requirement:* The initial hydration must match the SSR output cleanly, and updates must only occur without crashing or mismatching the DOM tree.

---

## Commands
* Install: `pnpm install`
* Dev server: `pnpm dev`
* Run tests: `pnpm test`
* Check types: `pnpm typecheck`

## Submission
1. Ensure all tests in `__tests__/` pass (`pnpm test`).
2. Do **not** modify files in `__tests__/`.
3. Complete the prompt log in `PROMPTS.md`.
