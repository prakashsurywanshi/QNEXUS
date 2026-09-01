# QNEXUS — Port Plan (from Society reference app)

## Objective
Port the full original `Society` app into the sibling QNEXUS project. Commit once per completed phase.

## Stack
Laravel 13.29 (PHP 8.4.24) + React 19 + Inertia v3 + Tailwind v4 + shadcn/ui + Fortify + Sanctum + Pest 5. MariaDB (society = reference, qnexus = target, qnexus_testing = tests).

## Conventions
- Helpers: `user()`, `active_society_id()`, `active_role_id()` — Sanctum-safe.
- `HasSociety` trait auto-scopes list queries by `active_society_id()` (no manual where clause).
- 5 roles per society via `RoleSeeder`.
- API: `/api/v1/*` (role-aware auth, Sanctum).
- Web: Inertia React pages under `resources/js/pages/<domain>/index.tsx`, read-only index controllers `Inertia::render('domain/index', [...])`, routes in `routes/web.php` inside `['auth','verified']`.

## Phase Status
| Phase | Scope | Status |
|---|---|---|
| 1 | Scaffold | Done |
| 2 | Tenancy core | Done |
| 3 | Schema parity (134 tables) + auth/roles | Done |
| 4 | Models parity | Done |
| 5 | Mobile API `/api/v1` fixes | Done — Pest 17/17 |
| 6 | Society switching (web) | Done — Pest 3/3 |
| 7 | Estate: Towers, Floors, Apartments | Done |
| 8.1 | Amenities | Done |
| 8.2 | Assets | Done |
| 8.3 | Services + Service Types + Service Log | Done |
| 9 | Security & Visitors (Visitors, Gatepasses, Patrol) | Done |
| 10 | Finance & Billing (Maintenance, Payments, Budgets) | Done |
| 11 | Comms & Governance (Notices, Events, Polls) | Done |
| 12 | Admin/Superadmin (Societies, Members) | Done |
| 13 | Reports & Payments (Ledger, Vendors, Invoices) | Done |
| 14 | Full CRUD for all 17 web domains | Done |

## CRUD Coverage (Phase 14)
Every web resource now has `index / create / store / {id} / edit / update / destroy` via
resource-style `Route::controller(...)->prefix('x')->name('x.')->group([...])` routes in `routes/web.php`:
Amenities, Visitors, Notices, Services, Assets, Gatepasses, Patrol, Maintenance, Payments, Budgets,
Events, Polls, Societies, Members, Ledger, Vendors, Invoices — with create/edit Inertia pages and
Add/Edit/Delete actions on each index page.

Notable corrections made while porting:
- `payments` table lacked `society_id` (HasSociety-scoped) → `add_society_id_to_payments_table` migration
  backfills via `maintenance_apartment` → `maintenance_management.society_id`.
- `users` table lacked `phone_number` (declared in `User::$fillable`) → `add_phone_number_to_users_table`
  migration; member create/edit forms and `MemberController` store/update now persist it.
- Patrol index read a nonexistent `location` column → now `location_description`.
- RentInvoice index read nonexistent `rent_id`/`amount` → now `lease_agreement_id`/`total_amount`
  (total computed server-side as rent + CAM + other + tax).
- Polls pages use `router.post/put` (not `useForm`) because submit options reject extra keys — controller
  `syncOptions()` replaces `PollOption` rows.
- Member CRUD keys off the `SocietyUser` pivot for the active society (create user + pivot row; delete pivot only).

## Current Test Status
`php artisan test --compact` → **64/64 passed** (213 assertions).
All CRUD controllers lint-clean; `npx tsc --noEmit` → 0 errors; `npx vp build` → OK; clean `git status`.

## Known Env Quirks
- opencode snapshot feature caused file-drop/revert flakiness; disabled via global config `~/.config/opencode/opencode.json` (`"snapshot": false`) — takes effect on opencode restart.
- Retry-loop pattern for writes when persistence is flaky.

## Next
- Nav/sidebar wiring for the new CRUD pages (index pages currently reachable by URL only).
- Optional: Pest coverage for the new CRUD controllers (current 64 tests cover phases 5–6).
