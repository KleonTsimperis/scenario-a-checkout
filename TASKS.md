# Engineering Sprint: Production Bug Backlog (Scenario A)

**Welcome to the Engineering Assessment Sprint.**  
You have been assigned two high-priority production bug tickets reported by QA and Site Reliability Engineering. Review the tickets below, inspect the codebase, and submit your fixes.

---

## 🎫 Ticket 1: [BUG-1042] Shopping cart item quantity flickers and reverts under fast clicks
* **Issue Type:** Bug  
* **Priority:** High  
* **Reporter:** QA Automation Team  
* **Components:** Checkout / Store / Network Sync  

### Description:
Users on mobile devices and variable 4G networks report that when rapidly tapping the "+" or "-" buttons on an item in the cart drawer, the quantity counter behaves erratically. The counter momentarily increases, but then abruptly jumps backward to a previous number before eventually stabilizing on an incorrect count.

### Steps to Reproduce:
1. Start the dev server (`pnpm dev`) and open `http://localhost:3000`.
2. Open the Shopping Cart Drawer.
3. Rapidly click "+" on "Mechanical Keyboard" 3 times in quick succession (or click the *"Simulate Rapid Clicks"* button on the Candidate HUD widget).
4. Observe that the counter briefly shows `4`, then flickers back to `2` or `3` when the network responses arrive out-of-order.

### Acceptance Criteria:
* Rapid clicks must provide immediate, non-blocking optimistic UI updates.
* **Strict UX Constraint:** You **MUST NOT** disable the buttons (e.g. `disabled={isSyncing}`) or add a click debounce/throttle. The UI must remain immediately interactive.
* All network responses must be reconciled deterministically so that the final state always reflects the cumulative user inputs, even if older requests resolve late.
* The test in `__tests__/cartSync.test.ts` must pass without modifications to the test file.

---

## 🎫 Ticket 2: [BUG-1043] Sentry Alert: React Hydration Mismatch in CartDrawer
* **Issue Type:** Bug  
* **Priority:** Critical  
* **Reporter:** Platform Observability / Sentry  
* **Components:** CartDrawer / Localization / SSR  

### Description:
Our production monitoring dashboard triggered a high-severity alert for recurring React hydration mismatch crashes:
`Error: Text content does not match server-rendered HTML: "EUR €238.00" on server vs "USD $142.80" on client.`
This occurs for returning international customers who have previously selected a custom currency stored in their browser.

### Steps to Reproduce:
1. Set a stored currency preference in browser storage (or click the *"Set Stored Currency: USD"* button on the Candidate HUD widget).
2. Refresh the page at `http://localhost:3000`.
3. Check the browser developer console to see the React Hydration error.

### Acceptance Criteria:
* The initial HTML rendered by the server (SSR) must match the initial DOM rendered by the client upon hydration.
* Client preferences stored in the browser must be synchronized safely without crashing the React hydration lifecycle.
* The test in `__tests__/hydration.test.tsx` must pass without modifications to the test file.

---

## 📋 General Sprint Guidelines & Submission Checklist
- [ ] Run `pnpm test` to verify both tests pass.
- [ ] Run `pnpm typecheck` to verify no TypeScript compilation errors.
- [ ] Do **not** alter the test assertions in `__tests__/`.
- [ ] Complete the prompt log and Root Cause Analysis (RCA) in `PROMPTS.md`.
