# Candidate AI Worklog & Prompt Defense (`PROMPTS.md`)

*Candidate Name / ID:* ___________________________  
*Track:* [ ] Mid-Level (Sections 1 & 2)  |  [ ] Senior (Sections 1, 2, & 3)  
*Date:* ___________________________

---

## 1. AI Tooling Inventory
List the AI assistants or extensions used during this session (e.g., Cursor, Claude 3.5 Sonnet, ChatGPT-4o, GitHub Copilot):
* Tool(s) used: 

---

## 2. Prompt Log & AI Output Audit
Provide a minimum of 2 prompt iterations that you executed while tackling the challenges.

### Prompt Iteration 1
* **Target Issue:** (e.g., Optimistic update race condition in Scenario A)
* **Verbatim Prompt Sent to AI:**
  ```text
  [Paste your exact prompt here]
  ```
* **AI Output Summary:**
  > [Summarize what the AI proposed]
* **Deficiencies / Naive Assumptions Identified:**
  > [Explain what the AI got wrong or why its initial code failed project constraints (e.g., "The AI suggested disabling the button on click, which violated the non-blocking UI requirement")]
* **Manual Corrections Made:**
  > [Explain how you modified or restructured the AI's proposal to actually resolve the problem]

---

### Prompt Iteration 2
* **Target Issue:** (e.g., Hydration mismatch or Render cascade)
* **Verbatim Prompt Sent to AI:**
  ```text
  [Paste your exact prompt here]
  ```
* **AI Output Summary:**
  > [Summarize what the AI proposed]
* **Deficiencies / Naive Assumptions Identified:**
  > [Explain what the AI got wrong]
* **Manual Corrections Made:**
  > [Explain your manual verification and corrections]

---

## 3. Root Cause Analysis (RCA)

### Scenario A - Bug 1: Out-of-Order Optimistic State Desync
*Explain the technical root cause in under 150 words. Why did the optimistic UI desynchronize, and how does your solution ensure deterministic final state regardless of network latency jitter?*
> 

### Scenario A - Bug 2: SSR / Client Hydration Mismatch
*Explain why the hydration error occurred and how your solution guarantees DOM parity between server render and client mount.*
> 
