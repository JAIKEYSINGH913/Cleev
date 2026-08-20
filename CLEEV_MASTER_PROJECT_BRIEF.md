# CLEEV — Master Project Brief
## The Complete Handoff Document (v1.0)
### For: Any AI assistant, developer, or designer picking this up cold

---

> **How to use this document**: Read Section 1 first (5 min). It gives you the full mental model. Then go to whichever section is relevant to what you're building. Everything you need to understand, build, or continue this project is in this single file. No prior context needed.

---

## SECTION 1: THE ONE-PAGE SUMMARY

### What is Cleev?

**Cleev** (pronounced *cleev*, rhymes with *leave*) is a graph-database-powered expense-splitting and debt-settlement app built specifically for the Indian market, with UPI-native payment flows. It is the product of a 48-hour take-home assignment for **Wexa AI** (a CognoDB graph database company), being built by **Jaikey Singh**, a final-year B.Tech CSE student at AKTU, Ghaziabad, India.

The name comes from **"cleave"** — the ancient English verb meaning to split cleanly. It was chosen because:
- It literally means what the product does (split expenses)
- It has no existing fintech/payment app competition globally
- It becomes a natural verb in Hinglish: *"Cleev kar de yaar"* = "just split it, man"
- It follows the Amazon/Apple naming playbook — a real word borrowed from an unrelated domain and fully colonised

### The one-sentence pitch

> **Cleev is what happens when Splitwise gets a brain transplant — powered by a graph database that detects circular debts, suggests minimal payment paths, and lets you settle in seconds via UPI QR.**

### What makes it different from Splitwise

| Feature | Splitwise | Cleev |
|---|---|---|
| Expense splitting | ✅ | ✅ |
| Group management | ✅ | ✅ |
| Debt tracking | ✅ (trust-based) | ✅ (graph-powered) |
| UPI payment integration | ❌ | ✅ (QR + deep link) |
| Circular debt detection | ❌ | ✅ (graph query) |
| Debt graph visualization | ❌ | ✅ (Cytoscape.js) |
| Biometric app unlock | ❌ | ✅ (fingerprint + PIN) |
| Settlement optimization | ❌ | ✅ (A→B→C collapses to A→C) |
| Indian-first design | ❌ | ✅ (UPI, INR, Hinglish) |

### The core insight (why graph database)

Traditional expense apps store debts in relational tables. They can tell you "A owes B ₹500." But they can't efficiently answer: "Does settling A→B also resolve part of B→C? Is there a circular chain I can net to zero? What's the minimum number of transactions to clear all debts in this group?"

A graph database answers all three natively. The `OWES` relationship between User nodes is traversable — find cycles, find paths, find the minimum spanning settlement. This is the technical heart of Cleev and the reason CognoDB (a Neo4j-compatible graph database) is the correct choice.

---

## SECTION 2: BUILDER CONTEXT

### Who is building this

**Jaikey Singh**
- Final-year B.Tech Computer Science Engineering, AKTU University, Ghaziabad, India
- Expected graduation: mid-2026
- Background: 3 internships (Infosys Springboard, Microsoft-SAP initiative, AI role)
- Reliance Foundation Scholar
- Smart India Hackathon national finalist
- Former President, CODSoc Society (mentored 100+ students)
- Published research: GraphRAG + Neo4j architecture (NyayMitra legal AI system)
- Has prior incomplete work on a Splitwise-style app (Sync Wallet) — now rebuilding from scratch as Cleev

### Why this project exists

This is a **Wexa AI take-home assignment** with a 48-hour deadline. Wexa AI makes CognoDB, a managed graph database. The assignment requires:
1. Build any application using CognoDB as the database layer
2. CognoDB speaks openCypher over the Bolt protocol (Bolt 5.0–5.4)
3. Works with official Neo4j drivers for Python, JavaScript, Go, Java, .NET
4. Free tier at console.cognodb.com (no credit card, provisions in under 1 minute)
5. Submit: GitHub repo + hosted demo + screen recording + README

### Assignment evaluation criteria (from Wexa AI)
- Thoughtful graph data model (labeled nodes, typed relationships, properties)
- Real or realistic seed data loaded by a script
- Cypher queries including at least one multi-hop traversal (2+ hops)
- At least one query a relational DB would find awkward
- Parameterised queries (no string-concatenated Cypher)
- Functional web application a non-technical person could use
- Clean, intentional UI/UX with loading, empty, and error states
- Connection details read from environment variables (never committed)
- Graceful error handling when database is unreachable

---

## SECTION 3: PRODUCT VISION

### Target users

**Primary**: Indian college students and young professionals (18–28) who:
- Split expenses with roommates, friends, travel groups
- Use UPI daily (Google Pay, PhonePe, Paytm)
- Are comfortable with mobile-first apps
- Live in a social context where lending/borrowing between friends is constant

**Secondary**: Friend groups, travel groups, roommate setups, any informal shared expense scenario

### Core user problems being solved

1. **The awkward ask** — "Hey, you owe me ₹340 from last Tuesday" — Cleev makes this automatic and un-awkward
2. **The calculation headache** — Who owes what after 15 group expenses across 3 weeks — Cleev calculates it instantly
3. **The payment friction** — Even after knowing who owes what, actually transferring money is a separate step — Cleev generates a UPI QR that handles the transfer in the same flow
4. **The circular debt waste** — A owes B, B owes C, C owes A — three transactions that should be zero — Cleev detects this and nets to zero
5. **The non-app-user problem** — Your friend isn't on Cleev yet — Cleev lets you add them as a dummy user and invite them

### The product name decision

The name went through multiple iterations:
- **Sync Wallet** (original) — rejected: descriptive but not verb-able, doesn't pass slang test
- **Vaapas** (Hindi for "give back") — strong but existing Hindi word with prior search competition
- **Paakdo** / **Nikaal** — invented Hinglish words, very India-specific, harder to scale globally
- **Spliq** — invented portmanteau (split + quick), good energy but no real-word anchor
- **Cleft** — linguistically perfect (literally means "split") but rejected: medically loaded (cleft lip/palate), existing app "Cleft Notes" in TechCrunch
- **Cleev** ✅ — final choice: from "cleave" (to split cleanly), invented modern spelling, zero fintech competition globally, four unrelated tiny businesses own fragments of the word (UK knife brand, Swiss agency, French no-code agency, AI mental health tool) — none compete, none are consumer apps, Google disambiguation box = open namespace

**Cleev is the name. All product references should use Cleev.**

### Logo & Visual Identity

- Logo: A stitch/woven pattern image (generated by Jaikey, to be provided)
- The logo is being built as a Three.js animated 3D motion graphic for the landing page
- Problem to solve: current logo renders as a square image dropped into the page — needs to be integrated as a live 3D animated element that feels native to the landing page, not pasted on top of it
- The Three.js implementation should: remove the square bounding box, make the logo float/animate, integrate with the page's color scheme, feel like the logo IS the page's hero element rather than an image placed on it

---

## SECTION 4: COMPLETE FEATURE SPECIFICATION

### 4.1 Onboarding & Authentication

#### Splash Screen
- Animated logo (Three.js / Framer Motion)
- "Cleev" wordmark with tagline: *"Split smart. Settle fast."*
- 2–3 second duration, auto-transitions to login
- Background: gradient animation (dark purple → deep blue → dark)
- No skip button (too short to need one)

#### Login / Signup Landing
- Two options: **Continue with Google** | **Continue with Email**
- Clean, minimal layout
- Subtle particle or wave animation in background
- "New to Cleev? Sign up" / "Already have an account? Log in" toggle

#### Sign-Up Flow (Multi-Step)
All steps have a progress indicator and back navigation.

**Step 1 — Identity**
- Full Name (text)
- Username (unique, real-time availability check via API, lowercase, no spaces, underscores allowed)
- Date of Birth (calendar picker — for age verification and birthday milestones)
- Profile Picture (optional — camera capture or gallery upload; if skipped, generate avatar from initials)

**Step 2 — Contact & Security**
- Email address (with OTP verification — 6-digit, 30-second expiry, resend after 60s)
- Phone number (must be UPI-registered; validate format +91-XXXXXXXXXX)
- UPI ID (vpa@upi format — validate against known UPI handle patterns; auto-populate bank name if possible)
- Password (min 8 chars, 1 uppercase, 1 number, 1 special character; strength meter shown)

**Step 3 — Biometric Setup**
- Fingerprint enrollment (Web Authentication API / device native)
- PIN setup (4–6 digits, confirm entry)
- Skip option (can set up later from Settings → Security)

**Step 4 — Contact Sync**
- Permission request: "Find friends already on Cleev?"
- If granted: scan phone contacts, show list of matches already on app
- Non-matches: show "Invite" button per contact (opens SMS/email share)
- Skip option

**Step 5 — Welcome**
- Personalized: "Welcome to Cleev, [Name]! 🎉"
- Empty state dashboard with first-action prompt: "Add your first expense →"

#### Post-Login Authentication (Every App Open)
- Never ask for email/password again after first login
- App opens to Biometric Lock Screen
- Large fingerprint icon, "Touch to unlock"
- Fallback: "Use PIN" button
- Fallback: "Use Password" button (rare case)
- Session stored securely (JWT in secure storage, refresh token)
- Session timeout: 30 minutes of inactivity → re-authenticate with fingerprint/PIN only (not full password)

---

### 4.2 Home / Dashboard

#### Header
- Greeting: "Hi, [Name] 👋" (time-aware: Good morning/afternoon/evening)
- Notification bell (red badge for unread count)
- Avatar (links to Profile)

#### Net Balance Card (Hero Element)
- Dominant visual: large number showing net position
- "You owe ₹2,340" (red) or "You're owed ₹1,200" (green) or "All settled ✓" (neutral)
- Sub-text: breakdown (e.g., "across 3 people")
- Tap to expand into debt breakdown

#### Quick Action Buttons (Horizontal scroll row)
- ➕ Add Expense
- 👥 Create Group
- ⚡ Settle Debts
- 📊 View Analytics
- 🔍 Find Friends

#### Recent Activity Feed
- Last 5 expenses (card format)
- Each card: avatar + name, description, your share, date, status badge
- Swipe left: delete (with confirmation)
- Tap: expense detail

#### Upcoming / Overdue Section
- Only shown if overdue debts exist
- "⚠️ You have 2 overdue payments"
- Each item: name, amount, days overdue, "Pay Now" CTA

#### Bottom Navigation Bar (Capsule Style)
- Floating capsule above bottom edge of screen
- 5 items: 🏠 Home | 💸 Expenses | 👥 Groups | 📊 Analytics | 👤 Profile
- Active item: filled icon + subtle highlight
- Smooth transition animation on switch
- No labels on inactive items (icons only when inactive, label appears on active)

---

### 4.3 Expense Management

#### Create Expense
**Step 1 — Basics**
- Description (text field with history suggestions)
- Total amount (large numeric input, INR by default)
- Date (defaults to today, calendar picker to change)
- Category (auto-suggested based on description keywords; manual override)
  - Categories: 🍕 Food, ✈️ Travel, 🏠 Housing, ⚡ Utilities, 🎬 Entertainment, 🏥 Health, 🛍️ Shopping, 📦 Other
- Receipt photo (optional, camera or upload)
- Note / memo (optional)

**Step 2 — Who Paid?**
- Default: "I paid"
- Alternative: select another participant as payer (for when someone else covered the bill)

**Step 3 — Split Type**
- **Equal** (default): amount ÷ N participants, shown as ₹X each
- **Custom amounts**: text field per person, must sum to total (live validation)
- **Percentage**: percentage slider per person, must sum to 100%
- **Item-wise**: add line items, assign each item to one or more people
- **Ratio**: e.g., 2:1:1 ratio (drag sliders)

**Step 4 — Add Participants**
- Search field (autocomplete from: Cleev friends, phone contacts, recently split with)
- Each result shows: avatar, name, username, mutual groups
- Non-Cleev contacts: show "Invite" badge, can still add as dummy user
- Dummy user creation: name + phone/email stored, marked as "not on Cleev yet"
- Remove participant button per row
- Your share auto-adjusts when participants added/removed

**Step 5 — Preview & Confirm**
- Full breakdown: who pays whom, amounts
- "Looks good?" confirmation
- Edit button (returns to relevant step)
- Submit creates expense + PARTICIPANT_IN + OWES nodes in graph DB

#### Edit Expense
- All fields editable
- Recalculates OWES relationships
- Notifies all participants of the change
- Audit trail maintained

#### Delete Expense
- Confirmation modal
- Reverts OWES relationships
- Notifies all participants

#### Expense Detail View
- All fields displayed
- Split breakdown table
- Payment status per participant (Pending / Settled)
- Comments thread (future scope)
- Edit / Delete actions
- "Settle my share" CTA

#### Expenses List
- Paginated (20 per page)
- Filter bar: date range, category, group, person, status, amount range
- Sort: date, amount, status
- Search by description
- Empty state: friendly illustration + "No expenses yet. Add your first one! →"
- Error state: "Couldn't load expenses. Check your connection."

---

### 4.4 Group Management

#### Create Group
- Group name (e.g., "Goa Trip 2026", "Flat 4B")
- Description (optional)
- Group avatar (upload or choose from emoji set)
- Add members (search from contacts)
- Privacy: Private (invite only) | Friends-only | Public
- Creator becomes Admin automatically

#### Group Detail Page
**Tabs:**

*Expenses Tab*
- All group expenses (most recent first)
- Group summary banner: Total spent ₹X | Your share ₹Y | Outstanding ₹Z
- Filter/sort within group

*Settlement Tab* ⭐ (Graph DB power feature)
- Visual: current debt web in the group (nodes + edges)
- "Optimize Settlement" button → runs graph query → shows reduced transaction set
- Example: "5 transactions → 2 transactions (saves you ₹0 but saves 3 steps)"
- "Settle All" → generates QR codes for each required payment in sequence
- Individual debt rows with "Pay" CTA each

*Members Tab*
- Member list with roles (Admin, Member)
- Outstanding balance per member (color coded: red = owes, green = owed)
- Add member button (admin only)
- Remove member (admin only; requires settling their debts first)
- Leave group option (for non-admins; same requirement)

*Settings Tab* (admin only)
- Rename group
- Change avatar
- Change description
- Change privacy
- Archive group (no new expenses, history preserved)
- Delete group (permanent, requires all debts settled)

#### Group FAB
- Floating "+" button (bottom right)
- Creates expense pre-assigned to this group

---

### 4.5 Debt Management & Settlement

#### Debts Overview Page
**Tabs:**

*You Owe*
- List: avatar + name + total amount + "Pay" button
- Sorted: highest amount first
- Tap row: see individual expenses composing this debt

*You're Owed*
- List: avatar + name + total amount + "Remind" button
- "Remind" sends in-app notification + optionally SMS to the person

*Debt Graph* ⭐ (Graph DB visualization)
- Cytoscape.js network graph
- Nodes: circular avatars of users
- Edges: directed arrows (A → B means A owes B)
- Edge thickness: proportional to debt amount
- Edge color: green (due soon), orange (due), red (overdue), grey (settled)
- Labels: ₹ amount on each edge
- Interactive: hover shows tooltip, click edge opens settlement flow
- Your node is always centered
- Zoom / pan enabled

#### Settlement Flow

**Trigger:** tap any debt row or graph edge

**Step 1 — Choose payment method**
- 📱 UPI QR (recommended)
- 🔗 UPI Payment Link
- ✓ Mark as Settled (manual / offline / cash)

**Step 2a — UPI QR Flow** (most common)
- Generate UPI QR containing:
  - `pa` = payee's UPI ID
  - `pn` = payee's name
  - `am` = exact amount
  - `tn` = "Cleev: [expense description]"
  - `tr` = unique transaction reference ID
- Display: large QR (scannable by any UPI app)
- Instructions: "Ask [Name] to scan this with Google Pay / PhonePe / any UPI app"
- Download QR button
- Copy UPI link button (fallback)
- "I've paid — mark as settled" button (manual attestation, default for MVP)
- Auto-detection if Razorpay webhook integrated (Phase 2)
- 10-minute QR expiry with auto-refresh

**Step 2b — UPI Payment Link Flow**
- Generate `upi://pay?pa=...&pn=...&am=...&tn=...&tr=...` deep link
- Show as button: "Open in UPI App" (on mobile, this opens their default UPI app)
- On desktop: show QR of the link

**Step 2c — Manual Settlement**
- "Confirm you paid ₹[amount] to [Name]?"
- Optional note (e.g., "Cash at dinner")
- Timestamp (defaulting to now, can be backdated)
- One-tap confirm → expense marked settled for both parties

**After Settlement**
- Confetti animation
- "Cleev'd! ✓" success screen
- Debt removed from list
- Both parties notified
- OWES relationship updated to status: SETTLED in graph DB

---

### 4.6 Graph Intelligence Features ⭐

These features are unique to Cleev and powered by the graph database.

#### Circular Debt Detection
- **What it does**: Detects when A owes B, B owes C, and C owes A — forming a cycle
- **What it shows**: "You, Alice, and Bob have a circular debt. Settle to zero in one click."
- **How it works**: Multi-hop Cypher traversal detects cycles, calculates the minimum amount to net to zero
- **User action**: "Resolve Cycle" button — marks all three OWES as settled, creates zero-sum settlement record

#### Settlement Path Optimization (Group)
- **What it does**: In a group with N members and M debts, finds the minimum number of transactions to clear all debts
- **Example**: 6 people, 8 transactions needed naively → 4 transactions after optimization
- **How it works**: Shortest path + debt netting Cypher queries
- **User action**: "Optimize & Settle" shows the reduced transaction plan

#### Relationship Strength Score
- **What it does**: Scores your financial relationship with each friend (total transacted, frequency, settle speed)
- **Shown on**: Friend profile, contacts list
- **Purpose**: Surface your closest financial relationships (your "inner circle")
- **Graph query**: Count + sum of OWES and PARTICIPANT_IN relationships between two users

#### Smart Settlement Suggestions
- **What it does**: On dashboard, proactively suggests "Settle with Alice now — she also owes Bob who owes you. One payment clears two debts."
- **How it works**: 2-hop traversal — find users where settling one debt creates a cascade of settlements

---

### 4.7 Contacts & User Discovery

#### Search Users
- Search bar: username, phone number, email
- Results show: avatar, name, username, mutual friends count, mutual groups
- "Add Friend" CTA (one-tap)
- "Split Expense" CTA (shortcut)

#### Contact Sync
- Import phone contacts (permission-gated)
- Highlight contacts already on Cleev (green badge)
- "Invite" button for contacts not on Cleev
  - Invite message: "Hey! I use Cleev to split expenses with friends. Join me — [invite link]"
  - Invite via: SMS, WhatsApp, Email
- Invited contacts shown in "Pending Invites" section

#### Dummy User System
- When adding someone not on Cleev to an expense:
  - Enter their name + phone number or email
  - They appear in your expense as "[Name] (not on Cleev)"
  - They receive an SMS/email: "You owe ₹[amount] on a Cleev expense. Download Cleev to settle → [link]"
  - When they sign up with matching phone/email, all dummy expenses auto-migrate to their real account
  - You're notified: "[Name] joined Cleev! Their expenses are now linked."

#### QR Code Friend Add
- Your profile has a personal QR
- Someone scans it → instant friend request
- Works for: adding friends, joining groups (group QR)

---

### 4.8 Analytics & Insights

#### Dashboard Cards (top row)
- Total owed to you
- Total you owe
- Net position
- Unsettled expenses count

#### Charts

*Spending by Category* — Donut chart
- Each category: color, amount, percentage
- Tap segment: drill into that category's expenses

*Monthly Spending Trend* — Line chart
- Last 6 months of total spending
- Overlay: what you paid vs. what others paid for you

*Spending by Person* — Horizontal bar chart
- Who you spend most with

*Spending by Group* — Bar chart
- Which groups generate most expenses

*Settlement Speed* — Personal metric
- Average days to settle a debt (yours vs. group average)
- "You settle 2x faster than average" type insight

#### Milestones & Badges
- 🎯 "First Split" — added first expense
- 💨 "Quick Settler" — settled a debt within 24 hours
- 🤝 "Reliable" — settled 10 debts in a row on time
- 💰 "Big Spender" — ₹10,000+ in a single month
- 🌐 "Connected" — 10+ friends on Cleev
- ⭐ "Group Leader" — created 3+ groups
- 🧮 "Debt Buster" — resolved a circular debt
- Progress bars for upcoming milestones

#### History
- Complete log of all transactions
- Filters: date, type (expense/settlement/payment), person, group
- Export as CSV / PDF (future scope)

---

### 4.9 Notifications

#### In-App
- Someone added you to an expense
- Someone settled a debt with you
- Payment reminder (configurable: 3 days before, 1 day before, day of, overdue)
- Friend joined Cleev (from your invite)
- Group invitation
- Milestone unlocked
- Settlement suggestion (graph-detected opportunity)

#### Push Notifications (Phase 2)
- Toggle per category
- Quiet hours (10 PM – 8 AM default)
- Overdue payment alerts always on

#### Email
- Weekly digest (spending summary, outstanding debts)
- Payment confirmation receipts
- Security alerts (new device login, password change)

---

### 4.10 Profile & Settings

#### Profile Page
- Avatar, name, username, bio
- Stats: total expenses, total settled, friends count, groups count
- Privacy: Public / Friends-only / Private
- Edit profile CTA

#### Settings Sections
- **Security**: biometric toggle, PIN change, password change, active sessions, login history
- **Privacy**: profile visibility, who can add you to expenses, blocked users
- **Notifications**: toggle per type, quiet hours, reminder timing
- **Preferences**: default currency (INR), language, theme (light/dark/auto)
- **Data**: export my data, delete account
- **Help**: FAQ, contact support, report issue
- **About**: version, privacy policy, terms of service

---

## SECTION 5: TECHNICAL ARCHITECTURE

### 5.1 Technology Stack

**Frontend**
- Framework: **Next.js 14** (React 18, TypeScript, SSR + API routes)
- Styling: **Tailwind CSS** (utility-first, no CSS modules)
- Animations: **Framer Motion** (page transitions, micro-interactions, gesture support)
- 3D/Logo: **Three.js** (animated logo on landing page)
- Charts: **Recharts** (spending analytics)
- Graph Visualization: **Cytoscape.js** (debt network graph, force-directed layout with `cytoscape-fcose`)
- State: **React Query (TanStack Query)** (server state, caching, background refetch)
- Forms: **React Hook Form** + **Zod** (validation)
- Icons: **Lucide React**
- QR Generation: **qrcode** npm package

**Backend**
- Runtime: **Node.js 20+**
- Framework: **Express.js** (lightweight, fast setup)
- Language: **TypeScript** throughout
- Auth: **JWT** (access token 15min, refresh token 7 days) + **bcryptjs** (password hashing)
- Validation: **Zod** (shared with frontend)
- Rate limiting: **express-rate-limit**
- Logging: **Winston**
- Testing: **Jest** + **Supertest**

**Database**
- Primary: **CognoDB** (managed Neo4j-compatible graph DB, Bolt protocol)
- Driver: **neo4j-driver** (official, JavaScript/TypeScript)
- Queries: **Cypher** (openCypher spec, parameterised — never string-concatenated)
- Caching: **Redis** (session tokens, OTP codes, settlement suggestion cache)

**External Services**
- Auth: **Firebase Auth** or **Passport.js** (Google OAuth)
- Email/OTP: **SendGrid** (transactional email) + **Twilio** or **MSG91** (SMS OTP)
- Payment: **Razorpay** (UPI link/QR generation + webhook for payment confirmation)
- File Storage: **AWS S3** or **Cloudflare R2** (profile pictures, receipts)
- UPI Validation: NPCI registry API (validate UPI IDs before storing)

**Infrastructure**
- Frontend hosting: **Vercel** (Next.js native, free tier, global CDN)
- Backend hosting: **Render** (Node.js, free tier, GitHub auto-deploy)
- Database: **CognoDB Cloud** (free c0 instance: 0.5 vCPU, 256MB RAM, 1GB disk)
- CI/CD: **GitHub Actions** (lint, test, deploy on merge to main)
- Environment: `.env.local` (never committed) + `.env.example` (committed as template)

### 5.2 Repository Structure

```
cleev/
├── frontend/                         # Next.js app
│   ├── app/
│   │   ├── layout.tsx               # Root layout, fonts, providers
│   │   ├── page.tsx                 # Landing page (Three.js logo, hero, CTAs)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (app)/                   # Protected routes (require auth)
│   │   │   ├── layout.tsx           # App shell with navigation
│   │   │   ├── home/page.tsx
│   │   │   ├── expenses/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── groups/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── debts/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/settle/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   └── profile/page.tsx
│   │   └── api/                     # Next.js API routes (thin proxy to backend)
│   ├── components/
│   │   ├── auth/
│   │   ├── expense/
│   │   ├── groups/
│   │   ├── debts/
│   │   │   ├── DebtGraph.tsx        # Cytoscape.js visualization
│   │   │   └── SettlementModal.tsx
│   │   ├── analytics/
│   │   ├── landing/
│   │   │   ├── ThreeJsLogo.tsx      # Three.js animated logo component
│   │   │   └── HeroSection.tsx
│   │   └── common/
│   │       ├── Navigation.tsx       # Bottom capsule nav
│   │       ├── BiometricLock.tsx
│   │       └── Toast.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useExpenses.ts
│   │   ├── useDebts.ts
│   │   └── useBiometric.ts
│   ├── lib/
│   │   ├── api.ts                   # Axios instance with auth headers
│   │   ├── auth.ts                  # JWT storage, refresh logic
│   │   └── upi.ts                   # UPI link/QR generation helpers
│   └── .env.example
│
├── backend/                          # Express.js app
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # CognoDB driver setup
│   │   │   ├── redis.ts
│   │   │   └── env.ts               # Zod env validation
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── expenses.ts
│   │   │   ├── groups.ts
│   │   │   ├── debts.ts
│   │   │   ├── payments.ts
│   │   │   ├── settlements.ts
│   │   │   └── users.ts
│   │   ├── services/
│   │   │   ├── settlementService.ts  # Graph queries, debt optimization
│   │   │   ├── paymentService.ts     # UPI QR, Razorpay
│   │   │   └── notificationService.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT verification
│   │   │   ├── errorHandler.ts      # Global error handler
│   │   │   └── rateLimiter.ts
│   │   └── app.ts
│   ├── seed/
│   │   ├── seedData.ts              # Faker-generated realistic data
│   │   └── seed.ts                  # Runner: connects to CognoDB, creates nodes
│   └── .env.example
│
└── README.md                         # Assignment-ready README
```

### 5.3 Environment Variables

**Backend `.env.example`**
```
# CognoDB (Neo4j-compatible graph database)
DATABASE_URL=bolt+s://[instance-id].databases.cognodb.cloud
DATABASE_USER=cognodb
DATABASE_PASSWORD=your_cognodb_password_here

# Auth
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Redis
REDIS_URL=redis://localhost:6379

# External (optional for MVP)
SENDGRID_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

**Frontend `.env.example`**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
```

---

## SECTION 6: GRAPH DATABASE SCHEMA

### 6.1 Node Labels & Properties

```cypher
// ─── USER ───────────────────────────────────────────────────
(:User {
  id: String,              // UUID, primary key
  email: String,           // unique, indexed
  username: String,        // unique, indexed, lowercase
  phoneNumber: String,     // E.164 format (+91XXXXXXXXXX)
  name: String,
  dob: Date,
  profilePictureUrl: String,
  bio: String,
  upiId: String,           // vpa@upi format
  passwordHash: String,    // bcrypt
  createdAt: DateTime,
  lastLoginAt: DateTime,
  isActive: Boolean,
  isDummy: Boolean,        // true for non-Cleev users added to expenses
  privacyLevel: String     // PUBLIC | FRIENDS_ONLY | PRIVATE
})

// ─── GROUP ──────────────────────────────────────────────────
(:Group {
  id: String,
  name: String,
  description: String,
  createdBy: String,       // User.id
  createdAt: DateTime,
  avatarUrl: String,
  privacyLevel: String,
  status: String           // ACTIVE | ARCHIVED
})

// ─── EXPENSE ────────────────────────────────────────────────
(:Expense {
  id: String,
  description: String,
  amount: Float,
  currency: String,        // default: INR
  category: String,        // FOOD|TRAVEL|HOUSING|UTILITIES|ENTERTAINMENT|HEALTH|SHOPPING|OTHER
  date: Date,
  receiptUrl: String,
  createdBy: String,       // User.id
  createdAt: DateTime,
  status: String           // PENDING | SETTLED | DISPUTED
})

// ─── PAYMENT ────────────────────────────────────────────────
(:Payment {
  id: String,
  amount: Float,
  method: String,          // UPI | MANUAL | BANK_TRANSFER
  upiRefId: String,        // UPI transaction reference (from webhook)
  razorpayPaymentId: String,
  status: String,          // PENDING | CONFIRMED | SETTLED | FAILED
  createdAt: DateTime,
  settledAt: DateTime,
  notes: String,
  qrExpiresAt: DateTime    // QR code expiry
})
```

### 6.2 Relationship Types & Properties

```cypher
// ─── MEMBERSHIP ─────────────────────────────────────────────
(:User)-[:IS_MEMBER_OF { role: 'ADMIN'|'MEMBER', joinedAt: DateTime }]->(:Group)

// ─── EXPENSE OWNERSHIP ──────────────────────────────────────
(:User)-[:OWNS { createdAt: DateTime }]->(:Expense)

// ─── EXPENSE PARTICIPATION ──────────────────────────────────
(:User)-[:PARTICIPANT_IN {
  shareAmount: Float,
  sharePercentage: Float,
  status: 'PENDING'|'SETTLED'
}]->(:Expense)

// ─── DEBT (PRIMARY GRAPH RELATIONSHIP) ──────────────────────
(:User)-[:OWES {
  amount: Float,
  status: 'PENDING'|'OVERDUE'|'SETTLED',
  createdAt: DateTime,
  dueDate: Date,
  sourceExpenseId: String  // which expense created this debt
}]->(:User)

// ─── EXPENSE-GROUP LINK ──────────────────────────────────────
(:Expense)-[:BELONGS_TO { addedAt: DateTime }]->(:Group)

// ─── PAYMENT PARTIES ────────────────────────────────────────
(:Payment)-[:FROM]->(:User)
(:Payment)-[:TO]->(:User)

// ─── CONTACT LINKING ────────────────────────────────────────
(:User)-[:HAS_CONTACT {
  name: String,
  addedAt: DateTime,
  isCleevUser: Boolean
}]->(:User)

// ─── FRIENDSHIP ─────────────────────────────────────────────
(:User)-[:FRIENDS_WITH { since: DateTime }]->(:User)
```

### 6.3 Core Cypher Queries

**Q1: Get all debts for a user (who they owe + who owes them)**
```cypher
MATCH (user:User { id: $userId })-[owes:OWES]->(creditor:User)
WHERE owes.status IN ['PENDING', 'OVERDUE']
RETURN
  creditor.id AS creditorId,
  creditor.name AS creditorName,
  creditor.upiId AS creditorUpiId,
  sum(owes.amount) AS totalOwed,
  collect(owes.sourceExpenseId) AS expenseIds,
  max(CASE WHEN owes.status = 'OVERDUE' THEN 1 ELSE 0 END) AS hasOverdue
ORDER BY totalOwed DESC
```

**Q2: Detect circular debt — 3-person cycle (multi-hop traversal)**
```cypher
MATCH (a:User { id: $userId })-[r1:OWES]->(b:User)-[r2:OWES]->(c:User)-[r3:OWES]->(a)
WHERE r1.status = 'PENDING'
  AND r2.status = 'PENDING'
  AND r3.status = 'PENDING'
  AND a <> c
RETURN
  a.name AS userA, b.name AS userB, c.name AS userC,
  r1.amount AS a_owes_b,
  r2.amount AS b_owes_c,
  r3.amount AS c_owes_a,
  min(r1.amount, r2.amount, r3.amount) AS netSettlement,
  CASE
    WHEN r1.amount = min(r1.amount, r2.amount, r3.amount)
      THEN c.name + ' pays ' + a.name + ' ₹' + toString(r1.amount) + ' — cycle cleared'
    WHEN r2.amount = min(r1.amount, r2.amount, r3.amount)
      THEN a.name + ' pays ' + c.name + ' ₹' + toString(r2.amount) + ' — cycle cleared'
    ELSE b.name + ' pays ' + a.name + ' ₹' + toString(r3.amount) + ' — cycle cleared'
  END AS suggestion
LIMIT 10
```

**Q3: Shortest settlement path between two users (multi-hop)**
```cypher
MATCH (from:User { id: $fromId }), (to:User { id: $toId })
MATCH path = shortestPath((from)-[:OWES*1..5]->(to))
RETURN
  [n IN nodes(path) | n.name] AS pathNames,
  [n IN nodes(path) | n.id] AS pathIds,
  [r IN relationships(path) | r.amount] AS amounts,
  length(path) AS hops
ORDER BY hops ASC
LIMIT 3
```

**Q4: Group settlement — all debts in a group**
```cypher
MATCH (g:Group { id: $groupId })<-[:IS_MEMBER_OF]-(member:User)
MATCH (member)-[owes:OWES { status: 'PENDING' }]->(creditor:User)-[:IS_MEMBER_OF]->(g)
WITH member, creditor, sum(owes.amount) AS netOwed
RETURN
  member.id AS debtorId,
  member.name AS debtorName,
  creditor.id AS creditorId,
  creditor.name AS creditorName,
  creditor.upiId AS creditorUpiId,
  netOwed
ORDER BY netOwed DESC
```

**Q5: Settlement optimization (reduce N transactions to minimum)**
```cypher
MATCH (g:Group { id: $groupId })<-[:IS_MEMBER_OF]-(member:User)
MATCH (member)-[owes:OWES { status: 'PENDING' }]->(creditor:User)
WHERE (creditor)-[:IS_MEMBER_OF]->(g)
WITH member.id AS debtorId, creditor.id AS creditorId, sum(owes.amount) AS amount
// Returns net debts — application layer runs minimum transaction algorithm
RETURN debtorId, creditorId, amount
ORDER BY amount DESC
```

**Q6: Relationship strength between two users**
```cypher
MATCH (u1:User { id: $userId1 }), (u2:User { id: $userId2 })
OPTIONAL MATCH (u1)-[owes1:OWES]->(u2)
OPTIONAL MATCH (u2)-[owes2:OWES]->(u1)
OPTIONAL MATCH (u1)-[:PARTICIPANT_IN]->(e:Expense)<-[:PARTICIPANT_IN]-(u2)
RETURN
  count(distinct e) AS sharedExpenses,
  sum(owes1.amount) + sum(owes2.amount) AS totalTransacted,
  count(distinct owes1) + count(distinct owes2) AS debtCount
```

**Q7: Smart settlement suggestion (2-hop opportunity)**
```cypher
MATCH (me:User { id: $userId })-[r1:OWES { status: 'PENDING' }]->(b:User)
MATCH (b)-[r2:OWES { status: 'PENDING' }]->(c:User)
WHERE me <> c
RETURN
  me.name AS from,
  b.name AS via,
  c.name AS to,
  r1.amount AS meOwesB,
  r2.amount AS bOwesC,
  'Settling with ' + b.name + ' also clears ' + b.name + '→' + c.name AS suggestion
ORDER BY r1.amount DESC
LIMIT 5
```

**Q8: Dashboard summary for a user**
```cypher
MATCH (user:User { id: $userId })
OPTIONAL MATCH (user)-[owes:OWES { status: 'PENDING' }]->(creditor:User)
OPTIONAL MATCH (debtor:User)-[owed:OWES { status: 'PENDING' }]->(user)
OPTIONAL MATCH (user)-[:PARTICIPANT_IN]->(expense:Expense)
WHERE expense.date >= date() - duration('P30D')
RETURN
  user.name AS name,
  coalesce(sum(owes.amount), 0) AS totalIOwe,
  coalesce(sum(owed.amount), 0) AS totalOwedToMe,
  count(distinct expense) AS expensesThisMonth,
  coalesce(sum(expense.amount), 0) AS totalSpentThisMonth
```

---

## SECTION 7: API SPECIFICATION

### Base URL
- Development: `http://localhost:3001`
- Production: `https://cleev-api.onrender.com`

### Authentication
All protected routes require: `Authorization: Bearer <jwt_token>`

### Endpoints

#### Auth
```
POST /auth/signup          — Create account
POST /auth/login           — Login, get tokens
POST /auth/logout          — Invalidate refresh token
POST /auth/refresh         — Get new access token
GET  /auth/me              — Get current user
POST /auth/verify-otp      — Verify OTP
POST /auth/resend-otp      — Resend OTP
POST /auth/forgot-password — Send reset link
POST /auth/reset-password  — Reset with token
```

#### Users
```
GET    /users/search?q=    — Search users by username/phone/email
GET    /users/:id          — Get user profile
PUT    /users/me           — Update own profile
DELETE /users/me           — Delete account
POST   /users/me/contacts  — Sync contacts
GET    /users/me/contacts  — List contacts with Cleev status
```

#### Expenses
```
POST   /expenses           — Create expense with splits
GET    /expenses           — List all user's expenses (paginated, filterable)
GET    /expenses/:id       — Get expense detail
PUT    /expenses/:id       — Update expense
DELETE /expenses/:id       — Delete expense
GET    /expenses/stats     — Spending stats (for analytics)
```

#### Groups
```
POST   /groups             — Create group
GET    /groups             — List user's groups
GET    /groups/:id         — Get group detail + members
PUT    /groups/:id         — Update group
DELETE /groups/:id         — Delete group (admin)
POST   /groups/:id/members — Add member
DELETE /groups/:id/members/:userId — Remove member
GET    /groups/:id/expenses — Group expenses
GET    /groups/:id/debts   — All debts in group
GET    /groups/:id/settlement — Settlement suggestions
```

#### Debts
```
GET    /debts              — All of user's debts (owe + owed)
GET    /debts/graph        — Graph data (nodes + edges) for visualization
GET    /debts/suggestions  — Smart settlement suggestions (2-hop)
GET    /debts/circular     — Circular debt detection results
PUT    /debts/:id/settle   — Mark debt as settled (manual)
```

#### Payments
```
POST   /payments/generate-qr    — Generate UPI QR for a debt
POST   /payments/generate-link  — Generate UPI deep link
GET    /payments/:id/status     — Check payment status
POST   /webhooks/razorpay       — Razorpay payment confirmation webhook
```

---

## SECTION 8: UI/UX SPECIFICATION

### Design Language

**Color Palette**
- Background: `#0A0A0F` (near-black, dark mode primary)
- Surface: `#13131A` (cards, modals)
- Surface-2: `#1C1C26` (elevated elements)
- Accent: `#7C5CFC` (primary purple — Cleev brand color)
- Accent-2: `#5B8AF0` (secondary blue)
- Success: `#22C55E` (green, settled, positive balance)
- Danger: `#EF4444` (red, owed, overdue)
- Warning: `#F59E0B` (orange, due soon)
- Text-primary: `#FFFFFF`
- Text-secondary: `#A1A1AA`
- Text-muted: `#52525B`
- Border: `rgba(255,255,255,0.08)`

**Typography**
- Font: `Inter` (clean, modern, great at all weights)
- Heading: 700 weight
- Body: 400 weight
- Mono (for amounts): `JetBrains Mono` or `Fira Code`

**Spacing**: 4px base unit (4, 8, 12, 16, 20, 24, 32, 48, 64)

**Border Radius**: 8px (small), 12px (cards), 16px (modals), 9999px (pills/buttons)

**Shadows**: Subtle glow on accent elements (`box-shadow: 0 0 20px rgba(124,92,252,0.3)`)

### Animation Principles

- **Entrance**: elements slide up + fade in (translateY 20px → 0, opacity 0 → 1, 300ms ease-out)
- **Exit**: fade out + slight scale down (opacity 1 → 0, scale 1 → 0.95, 200ms ease-in)
- **Page transitions**: slide left/right (for navigation flow)
- **Number changes**: count-up animation on dashboard numbers
- **Settlement success**: confetti + scale bounce on success card
- **Loading**: skeleton screens (not spinners) for content areas
- **Micro-interactions**: haptic feedback on mobile for button taps (if Web Vibration API)

### Key Component Specs

**Bottom Navigation (Capsule)**
```
height: 64px
padding: 8px 24px
background: rgba(19,19,26,0.9) with backdrop-blur: 20px
border: 1px solid rgba(255,255,255,0.08)
border-radius: 32px
position: fixed, bottom: 24px, centered
box-shadow: 0 8px 32px rgba(0,0,0,0.4)
```

**Debt Graph Node**
```
size: 60px diameter
shape: circle
fill: user avatar (if available) or initials on accent gradient
border: 3px solid var(--accent) for self, white for others
label: username below node, 12px, muted color
```

**Debt Graph Edge**
```
style: curved bezier
width: log(amount) + 1 (min 1px, max 8px)
color: green (settled) | orange (pending) | red (overdue)
arrow: filled triangle head
label: ₹[amount] on midpoint, 11px
```

**UPI QR Card**
```
size: 240x240px centered
border: 2px dashed rgba(255,255,255,0.2)
border-radius: 16px
background: white (QR requires white bg)
padding: 16px
Below QR: amount bold, description muted, timer countdown
```

### Complete Screen List

1. Splash Screen
2. Landing Page (Three.js logo + hero)
3. Login Page
4. Signup — Step 1: Identity
5. Signup — Step 2: Contact & Security
6. Signup — Step 3: OTP Verification
7. Signup — Step 4: Biometric Setup
8. Signup — Step 5: Contact Sync
9. Signup — Step 6: Welcome
10. Biometric Lock Screen (every app open)
11. Home / Dashboard
12. Notifications Page
13. Add Expense — Step 1: Basics
14. Add Expense — Step 2: Who Paid
15. Add Expense — Step 3: Split Type
16. Add Expense — Step 4: Add Participants
17. Add Expense — Step 5: Preview & Confirm
18. Expense Detail Page
19. Expenses List Page
20. Create Group Page
21. Group Detail — Expenses Tab
22. Group Detail — Settlement Tab
23. Group Detail — Members Tab
24. Group Detail — Settings Tab
25. Debts Page — You Owe Tab
26. Debts Page — You're Owed Tab
27. Debts Page — Debt Graph Tab
28. Settlement — Method Selection
29. Settlement — UPI QR Display
30. Settlement — UPI Link Display
31. Settlement — Manual Confirm
32. Settlement — Success Screen
33. Circular Debt Detection Screen
34. Group Settlement Optimization Screen
35. Analytics / Insights Page
36. Milestones & Badges Page
37. User Search / Discovery Page
38. User Profile (other user)
39. Contact Sync Page
40. QR Scanner Page (add friend / join group)
41. Profile Page (own)
42. Settings — Security
43. Settings — Privacy
44. Settings — Notifications
45. Settings — Preferences
46. Settings — Help
47. Error State — Database Unreachable
48. Error State — Payment Failed
49. Error State — UPI Invalid
50. Empty States (per page)

---

## SECTION 9: THREE.JS LOGO INTEGRATION

### The Problem
The Cleev logo (a stitch/woven pattern image) is currently rendering as a flat square image placed on the landing page, looking like it was pasted on top of the design rather than integrated into it.

### The Solution
Implement the logo as a Three.js animated 3D element that:
1. Removes all square/rectangular bounding box appearance
2. Makes the logo float with gentle animation (slow rotation or bob)
3. Integrates with the page's dark background (transparent canvas background)
4. Adds depth with subtle lighting and shadow
5. Feels like the logo IS part of the page, not an image ON the page

### Three.js Implementation Approach

```javascript
// Recommended approach:
// 1. Load logo as texture on a plane geometry (or custom mesh)
// 2. Apply alphaMap to remove white background
// 3. Add subtle rotation or float animation
// 4. Use transparent renderer background
// 5. Add gentle point light for 3D depth

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  alpha: true,           // transparent background — key to no square
  antialias: true
});
renderer.setClearColor(0x000000, 0); // fully transparent

// Load logo texture
const texture = new THREE.TextureLoader().load('/logo.png');
const material = new THREE.MeshPhongMaterial({
  map: texture,
  transparent: true,     // remove white background from image
  alphaTest: 0.1,
  side: THREE.DoubleSide
});

// Gentle float animation
const animate = () => {
  mesh.position.y = Math.sin(Date.now() * 0.001) * 0.1; // bob up/down
  mesh.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1; // slight sway
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
```

### Required from Jaikey
- Provide the logo image file (PNG with transparent background preferred)
- Confirm: should the logo animate with rotation, float, pulse, or particle effects?
- Confirm: should the logo be the full hero element, or one part of the landing page hero?

---

## SECTION 10: MVP SCOPE (48-HOUR DELIVERY)

### What ships in MVP

✅ CognoDB connection + seed script (20 users, 30 expenses, groups, debts)
✅ User signup + login (email/password, Google OAuth)
✅ JWT auth + session management
✅ Create expense with equal + custom split
✅ OWES graph relationships auto-calculated on expense creation
✅ Debts page (you owe + you're owed)
✅ UPI QR generation (static, manual mark-as-paid)
✅ Dashboard with net balance + recent activity
✅ Debt graph visualization (Cytoscape.js)
✅ Basic spending chart (Recharts pie chart by category)
✅ Groups (create, add members, group expenses, group debts)
✅ Settlement suggestions (basic, query-based)
✅ Mobile-responsive UI
✅ Loading states, empty states, error states
✅ README with why-graph-DB explanation + screenshots

### What ships in Phase 2 (post-assignment)

⏳ Biometric + PIN app lock
⏳ Circular debt detection UI
⏳ Razorpay webhook for auto payment confirmation
⏳ OTP verification (SMS via Twilio/MSG91)
⏳ Contact sync
⏳ Milestones & badges
⏳ Advanced analytics
⏳ Three.js logo animation
⏳ Push notifications
⏳ Dummy user invite flow

### What ships in Phase 3 (future)

🔮 React Native mobile app
🔮 Offline support (PWA + IndexedDB)
🔮 Receipt OCR (Google Vision API)
🔮 Multi-currency
🔮 Recurring expenses
🔮 AI expense categorization
🔮 NPCI UPI aggregator license (direct transfers)

---

## SECTION 11: DEPLOYMENT

### Frontend — Vercel
1. Connect GitHub repo at vercel.com
2. Set root directory: `frontend/`
3. Environment variables: `NEXT_PUBLIC_API_URL=https://cleev-api.onrender.com`
4. Deploy on every push to `main`

### Backend — Render
1. New Web Service at render.com
2. Connect GitHub repo
3. Root directory: `backend/`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add all env variables from `.env.example`
7. Keep CognoDB instance running (Wexa AI requirement)

### Submission
- Email: `hr@wexa.ai`
- Subject: `CognoDB Assignment 2 – Jaikey Singh`
- Body: GitHub repo URL + live demo URL + screen recording link
- Keep CognoDB instance live after submission

---

## SECTION 12: QUICK REFERENCE FOR ANY AI PICKING THIS UP

### If you're continuing the frontend:
- Framework: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- Key components needed: DebtGraph (Cytoscape.js), SettlementModal, BiometricLock, ThreeJsLogo
- Design: Dark mode, purple accent (#7C5CFC), Inter font, capsule bottom nav
- API calls: go through `lib/api.ts` (Axios instance with JWT headers)

### If you're continuing the backend:
- Framework: Express.js, TypeScript, Node.js 20+
- Database: CognoDB via `neo4j-driver`, Bolt protocol, Cypher queries
- All queries MUST be parameterised (never string-concatenated Cypher)
- JWT: access token 15min, refresh token 7 days
- Error handling: global middleware in `middleware/errorHandler.ts`

### If you're working on the graph queries:
- Primary relationship: `(:User)-[:OWES { amount, status }]->(:User)`
- Key queries: see Section 6.3 (Q1–Q8)
- The multi-hop traversal (Q2, Q3) is the assignment's key requirement
- Run queries against CognoDB (bolt+s:// endpoint)

### If you're working on the UI/UX:
- See Section 8 for complete color palette, typography, animation principles
- 50 screens listed in Section 8 (screen list)
- Three.js logo: see Section 9

### If you're writing the README:
- Must explain: why graph DB (circular debt, multi-hop, visualization)
- Must include: data model diagram, setup instructions, core queries, screenshots
- Assignment evaluates this heavily — make it excellent

### Current status (as of last session):
- SRS complete ✅
- Tech blueprint complete ✅
- Data model designed ✅
- Cypher queries drafted ✅
- Product named: Cleev ✅
- Logo: stitch/woven pattern (Three.js integration pending)
- Development: NOT STARTED — beginning now

---

*This document is the single source of truth for the Cleev project. Version 1.0. Last updated by Claude (Anthropic) during pair-programming session with Jaikey Singh.*

