# Cleev Frontend Execution Checklist

## 1. Global Infrastructure
- `[x]` Scaffold basic routing (`/groups`, `/groups/[id]`, `/expenses`, `/analytics`, `/profile`)
- `[x]` Implement Toast/Notification context or library (e.g., Sonner).

## 2. Core Modals
- `[x]` Build Global "Add Expense" Modal (Amount, Category, Payer, Split logic).
- `[ ]` Build "Settle Up" Modal (Payer, Payee, Amount, UPI integration placeholder).
- `[ ]` Build "Smart Settle" Animation Modal (Cycle visualization and resolution).
- `[ ]` Wire Modals to the Dashboard (`/home`) and bottom Navigation capsule.

## 3. Screens Implementation (with Mock Data)
- `[ ]` **Groups Hub (`/groups`)**: Create group cards and "New Group" UI.
- `[ ]` **Group Details (`/groups/[id]`)**: Build Ledger tab, Balances tab, and localized Graph tab.
- `[ ]` **Activity Feed (`/expenses`)**: Build chronological transaction ledger with filters.
- `[ ]` **Analytics (`/analytics`)**: Build spending charts and "Transactions Saved" metrics.
- `[ ]` **Profile (`/profile`)**: Build user details and UPI setup UI.

## 4. Final Polish
- `[ ]` Ensure strict adherence to Glassmorphism & FinAssist Blue theme across all new screens.
- `[ ]` Responsive testing (Mobile vs Desktop layouts).
