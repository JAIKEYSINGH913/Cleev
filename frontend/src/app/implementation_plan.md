# Cleev UI/UX Architecture Plan (Frontend Completion)

This document outlines the exhaustive list of frontend tasks required to achieve a 100% feature-complete, production-ready React application. Once these frontend tasks are complete, the UI will be fully prepared for the final phase: hooking into the Node.js backend and the CognoDB graph engine.

## 1. Global Components & Infrastructure

### A. Toast/Notification System
*   **Goal:** Provide user feedback for actions (e.g., "Expense added", "Cycle resolved").
*   **UI:** Glassmorphic toast notifications that slide in from the top/bottom.

### B. Global "Add Expense" Modal
*   **Goal:** The core data entry point, accessible via the `+` button in the `TopNav` or `Navigation` capsule.
*   **UI Elements:**
    *   Amount input (large numpad-style or native keyboard).
    *   Description & Category selector (Food, Travel, Rent, etc.).
    *   "Paid by" selector.
    *   "Split between" logic (Equally, Exact Amounts, Percentages).
*   **State:** Needs to handle complex temporary state before submission.

### C. "Settle Up" Modal
*   **Goal:** Interface to record a real-world payment (clearing a debt).
*   **UI Elements:** Payer, Payee, Amount, Payment Method (Cash, UPI), and an optional receipt attachment placeholder.

## 2. Core Routes & Screens

### A. Groups Hub (`/groups`)
*   **Goal:** List all active groups.
*   **UI:** Cards showing group name, member avatars, and total outstanding balance for that specific group. Button to "Create New Group".

### B. Group Details (`/groups/[id]`)
*   **Goal:** The localized hub for a specific group (e.g., "Goa Trip").
*   **Tabs:**
    1.  **Ledger:** Chronological list of expenses in this group.
    2.  **Balances:** Standard "who owes who" list.
    3.  **Graph View:** A localized instance of `DebtGraph.tsx` showing the specific debt cycles of this group.

### C. Activity Feed (`/expenses`)
*   **Goal:** Global audit log of all user transactions.
*   **UI:** Chronological timeline. Green amounts for "you are owed", Red for "you owe". Filters for "All", "Pending", "Settled".

### D. Analytics & Insights (`/analytics`)
*   **Goal:** Visualize spending habits and the power of the Graph DB.
*   **UI:** 
    *   Monthly spend bar charts.
    *   Category breakdown (doughnut chart).
    *   **Graph Engine Stats:** "Total transactions saved by Cleev's Auto-Settle".

### E. Profile & Settings (`/profile`)
*   **Goal:** User management.
*   **UI:** Avatar, Name, Username. "UPI ID" linkage section for 1-click settlements.

## 3. The "Smart Settle" Animation Flow
*   **Goal:** Visualize the primary unique selling point of the app.
*   **UI:** When a user clicks "Resolve Cycle" from the dashboard, a modal opens showing the cycle (A -> B -> C -> A). Upon clicking "Confirm", an animation plays showing the edges glowing green and dissolving to 0, followed by a success celebration.

## 4. Verification Plan
*   All routes will be populated with comprehensive mock data.
*   Every button and tab must be clickable and lead to a valid UI state.
*   Ensure all new panels strictly adhere to the deep black, FinAssist Blue, and pure glassmorphism design language.
