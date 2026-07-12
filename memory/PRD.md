# TransitOps — Product Requirements Doc

## Original Problem Statement
Build the complete frontend for **TransitOps**, a Smart Transport Operations Platform for logistics companies. Replaces manual spreadsheets/logbooks. Stack: React + Tailwind + React Router + Recharts + mock JSON data (Spring Boot API to be wired later). Dark theme UI, card-based, RBAC-driven sidebar.

## User Personas
| Role | Primary Job |
|---|---|
| Fleet Manager | Manage vehicles (CRUD), open/close maintenance, oversee fleet |
| Driver | Create/dispatch/complete trips, log fuel on completion |
| Safety Officer | Monitor drivers, license expiries, safety scores, suspend/reinstate |
| Financial Analyst | Read-only dashboards, cost/ROI analytics, CSV exports |

## Architecture (v1, frontend-only)
- CRA + Tailwind + React Router v7 + Recharts + sonner
- State: React Context + `localStorage` (`transitops.state.v1`, `transitops.auth.v1`)
- Mock demo login (4 accounts in `mockData.js`); signup creates a Driver-role account
- Design system: Chivo (headings), IBM Plex Sans (body), JetBrains Mono (data). Yellow `#FACC15` accent on `#0A0A0A` base.

## What's Implemented (Feb 2026)
- Login / Signup with 4 one-click demo accounts, hero panel with truck image
- RBAC-aware Sidebar + Topbar (role badge on avatar)
- Dashboard: 8 KPI cards, filters (type/status/region), utilization line chart, maintenance bar chart, recent activity feed. Finance role sees ROI KPI instead of fuel.
- Vehicle Registry: search, type/status filters, register modal, row-click detail drawer with trip + maintenance history, retire action
- Driver Management: search, license-expiring flags (amber ≤30d, red expired), safety-score bar, Safety-Officer-only Score/Suspend/Reinstate actions
- Trip Kanban (Draft / Dispatched / Completed / Cancelled): create with available-only vehicle/driver dropdowns, inline cargo overweight validation, dispatch/complete/cancel actions, complete requires final odometer + fuel
- Maintenance: open (marks vehicle In Shop, except Retired) / close (returns to Available)
- Fuel & Expenses: fuel log + expense tables, per-vehicle cost summary
- Reports & Analytics: fuel efficiency bar, utilization donut, cost trend line, ROI leaderboard, date-range filter, CSV export
- Role-specific default landing route (manager→dashboard, driver→trips, safety→drivers, finance→dashboard)
- Toast notifications (sonner), empty states, mobile hamburger nav, localStorage persistence

## Backlog / P1
- Wire Spring Boot REST endpoints (replace mock store with axios calls)
- Password reset flow (currently stub-toast)
- Loading skeleton components (list/table shimmer)
- Server-driven role/permission changes
- Driver dispatch view (map + assigned trip focus)
- Push notifications on trip status change
- Bulk CSV import for vehicles/drivers
- Real ROI calculation (per-trip billed revenue instead of km * 3.2 estimator)

## Backlog / P2
- Dark/Light theme toggle
- i18n scaffolding
- Trip drag-and-drop between columns
- Vehicle photo/document uploads (object storage)

## Test Credentials
See `/app/memory/test_credentials.md`
