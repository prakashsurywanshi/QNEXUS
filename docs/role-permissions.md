# QNEXUS — Role & Permission Reference

Single source of truth for the role-based access control (RBAC) model in QNEXUS.
This document is derived from `config/modules.php`, which is the canonical
registry that every seeder and society-provisioning flow reads from.

If you add a feature, register it once in `config/modules.php` (module name +
its permissions), then provisioning picks it up consistently for every society.

---

## 1. The five roles

Each society gets the same five roles, created by `RoleSeeder`:

| Role      | Permissions granted                                   | Typical user                     |
|-----------|-------------------------------------------------------|----------------------------------|
| **Admin** | Every permission (256)                                | Society administrator / admin    |
| **Manager** | Every permission (256)                              | Property/facility manager        |
| **Owner** | 8 permissions (see below)                             | Apartment owner / resident       |
| **Tenant** | 8 permissions (see below)                            | Renting resident                 |
| **Guard** | 11 permissions (see below)                            | Security / gate staff            |

- `Admin` and `Manager` are **granted every permission** (`syncPermissions($allPermissions)`).
- `Owner`, `Tenant`, and `Guard` receive a fixed, curated subset defined in
  `config('modules.role_permissions')`.

> A user's "active" permissions come from the **active role** for the current
> society/context, not from the Spatie global permission set alone. Use
> `role_permissions()` / `user_can()` and never override the `Role.users()`
> relation.

---

## 2. Per-role permission grants

### Owner (8)
- Create Book Amenity
- Create Tickets
- Show Notices
- Show Amenities
- Show Documents
- Show Tickets
- Create Visitor Preapproval
- Show Visitor Preapproval

### Tenant (8)
- Create Book Amenity
- Create Tickets
- Show Notices
- Show Amenities
- Show Documents
- Show Tickets
- Create Visitor Preapproval
- Show Visitor Preapproval

### Guard (11)
- Create Visitors
- Show Visitors
- Update Visitors
- Create Tickets
- Show Tickets
- Show Parking
- Show Apartment
- Show Gatepasses
- Show SOS Alerts
- Create Visitor Preapproval
- Show Visitor Preapproval

### Admin / Manager (256 = all)
Every permission defined in the `modules` registry.

---

## 3. How enforcement works

Permissions are enforced at several layers:

1. **Server-side checks (PHP)**
   - `user_can('Show Tickets')` → boolean helper backed by `role_permissions()`.
   - `authorizePermission('...')` in API controllers (returns JSON 403).
   - `authorizeRole(['Admin', 'Manager', 'Guard'])` in API controllers.

2. **Route gating**
   - Web routes are grouped under `module.enabled:<Module>` middleware, which
     blocks access when the society's package does not entitle that module
     (package entitlement), independent of role.

3. **Tenancy/context**
   - `SetActiveSociety` shares the active role's `permissions` array to the
     frontend and caches it; `role_permissions()` memoizes via session.

4. **Frontend (React/Inertia)**
   - `useCan('Show Tickets')` reads the shared `permissions` prop to hide
     buttons/navigation the active role cannot perform. UI gating is a
     convenience — real authority is always enforced server-side.

---

## 4. Module → permissions registry (69 modules, 256 permissions)

CRUD modules follow the pattern `Create X / Show X / Update X / Delete X`.
Group modules expose a single gate (`Show Finance`, `Show Commercial`, etc.).

| Module | Permissions |
|--------|-------------|
| Tower | Create Tower, Show Tower, Update Tower, Delete Tower |
| Floor | Create Floor, Show Floor, Update Floor, Delete Floor |
| Apartment | Create Apartment, Show Apartment, Update Apartment, Delete Apartment |
| User | Create User, Show User, Update User, Delete User |
| Owner | Create Owner, Show Owner, Update Owner, Delete Owner |
| Tenant | Create Tenant, Show Tenant, Update Tenant, Delete Tenant |
| Rent | Create Rent, Show Rent, Update Rent, Delete Rent |
| Utility Bills | Create Utility Bills, Show Utility Bills, Update Utility Bills, Delete Utility Bills |
| Common Area Bills | Create Common Area Bills, Show Common Area Bills, Update Common Area Bills, Delete Common Area Bills |
| Maintenance | Create Maintenance, Show Maintenance, Update Maintenance, Delete Maintenance |
| Amenities | Create Amenities, Show Amenities, Update Amenities, Delete Amenities |
| Book Amenity | Create Book Amenity, Show Book Amenity, Update Book Amenity, Delete Book Amenity |
| Visitors | Create Visitors, Show Visitors, Update Visitors, Delete Visitors |
| Notice Board | Create Notice Board, Show Notice Board, Update Notice Board, Delete Notice Board |
| Tickets | Create Tickets, Show Tickets, Update Tickets, Delete Tickets |
| Service Requests | Create Service Requests, Show Service Requests, Update Service Requests, Delete Service Requests |
| Parking | Create Parking, Show Parking, Update Parking, Delete Parking |
| Service Provider | Create Service Provider, Show Service Provider, Update Service Provider, Delete Service Provider |
| Service Time Logging | Create Service Time Logging, Show Service Time Logging, Update Service Time Logging, Delete Service Time Logging |
| Assets | Create Assets, Show Assets, Update Assets, Delete Assets |
| Work Orders | Create Work Order, Show Work Orders, Update Work Order, Delete Work Order |
| AMC | Create AMC, Show AMC, Update AMC, Delete AMC |
| Documents | Create Documents, Show Documents, Update Documents, Delete Documents |
| Emergency Contacts | Create Emergency Contact, Show Emergency Contacts, Update Emergency Contact, Delete Emergency Contact |
| Approvals | Create Approval, Show Approvals, Approve Requests, Delete Approval |
| Automations | Create Automation, Show Automations, Update Automation, Delete Automation |
| Analytics | Show Analytics |
| AI Assistant | Show AI Assistant |
| Audit Logs | Show Audit Logs |
| Settings | Manage Settings |
| Compliance | Create Compliance, Show Compliance, Update Compliance, Delete Compliance |
| SOS Alerts | Create SOS Alert, Show SOS Alert, Update SOS Alert, Delete SOS Alert |
| Emergency Broadcast | Create Emergency Broadcast, Show Emergency Broadcast, Update Emergency Broadcast, Delete Emergency Broadcast |
| Pets | Create Pet, Show Pet, Update Pet, Delete Pet |
| Family Members | Create Family Member, Show Family Members, Update Family Member, Delete Family Member |
| Move Records | Create Move Record, Show Move Record, Update Move Record, Delete Move Record |
| Daily Help | Create Daily Help, Show Daily Help, Update Daily Help, Delete Daily Help |
| Vendors | Create Vendor, Show Vendor, Update Vendor, Delete Vendor |
| Vendor Contracts | Create Vendor Contract, Show Vendor Contract, Update Vendor Contract, Delete Vendor Contract |
| Vendor Payments | Create Vendor Payment, Show Vendor Payment, Update Vendor Payment, Delete Vendor Payment |
| Purchase Orders | Create Purchase Order, Show Purchase Order, Update Purchase Order, Delete Purchase Order |
| Purchase Invoices | Create Purchase Invoice, Show Purchase Invoice, Update Purchase Invoice, Delete Purchase Invoice |
| Credit Notes | Create Credit Note, Show Credit Note, Update Credit Note, Delete Credit Note |
| Advance Accounts | Create Advance Account, Show Advance Account, Update Advance Account, Delete Advance Account |
| Prepaid Meters | Create Prepaid Meter, Show Prepaid Meter, Update Prepaid Meter, Delete Prepaid Meter |
| Energy | Show Energy, Top Up Meter |
| Patrol | Create Patrol, Show Patrol, Update Patrol, Delete Patrol |
| Visitor Preapprovals | Create Visitor Preapproval, Show Visitor Preapproval, Update Visitor Preapproval, Delete Visitor Preapproval |
| Worker Checkins | Create Worker Checkin, Show Worker Checkin, Update Worker Checkin, Delete Worker Checkin |
| Staff Management | Create Staff, Show Staff, Update Staff, Delete Staff |
| Gatepasses | Create Gatepass, Show Gatepass, Update Gatepass, Delete Gatepass |
| Boom Barriers | Create Boom Barrier, Show Boom Barrier, Update Boom Barrier, Delete Boom Barrier |
| Smart Building | Create Smart Device, Show Smart Devices, Update Smart Device, Delete Smart Device |
| Vehicles | Create Vehicle, Show Vehicles, Update Vehicle, Delete Vehicle |
| Events | Create Event, Show Event, Update Event, Delete Event |
| Polls | Create Poll, Show Poll, Update Poll, Delete Poll |
| Meetings | Create Meeting, Show Meeting, Update Meeting, Delete Meeting |
| Finance | Show Finance |
| Chart of Accounts | Create Chart of Account, Show Chart of Account, Update Chart of Account, Delete Chart of Account |
| General Ledger | Create General Ledger, Show General Ledger, Update General Ledger, Delete General Ledger |
| Journal Vouchers | Create Journal Voucher, Show Journal Voucher, Update Journal Voucher, Delete Journal Voucher |
| Budgets | Create Budget, Show Budget, Update Budget, Delete Budget |
| Fixed Deposits | Create Fixed Deposit, Show Fixed Deposit, Update Fixed Deposit, Delete Fixed Deposit |
| Commercial | Show Commercial |
| Commercial Units | Create Commercial Unit, Show Commercial Unit, Update Commercial Unit, Delete Commercial Unit |
| Commercial Tenants | Create Commercial Tenant, Show Commercial Tenant, Update Commercial Tenant, Delete Commercial Tenant |
| Lease Agreements | Create Lease Agreement, Show Lease Agreement, Update Lease Agreement, Delete Lease Agreement |
| CAM Charges | Create CAM Charge, Show CAM Charge, Update CAM Charge, Delete CAM Charge |
| Commercial Rent Invoices | Create Commercial Rent Invoice, Show Commercial Rent Invoice, Update Commercial Rent Invoice, Delete Commercial Rent Invoice |

---

## 5. Property-type buckets (`module_types`)

Modules are tagged for which society type they apply to:

- `residential` — Tower, Floor, Apartment, Parking, Amenities, Book Amenity, Tenant, Rent, Utility Bills, Maintenance, Service Requests, Commercial
- `commercial` — Commercial, Commercial Units, Commercial Tenants, Lease Agreements, CAM Charges, Commercial Rent Invoices
- `both` — Common Area Bills, Service Provider, Service Time Logging

`moduleAppliesToType($module, $propertyType)` returns true for `both`, a
matching type, or any `mixed` society.

---

## 6. Note on quirks / gotchas

- `Work Orders` — the show permission is `Show Work Orders` (plural) while
  create/update/delete use singular `Create Work Order` / `Update Work Order`.
- `Notifier::notifyUsersWithPermission` excludes `auth()->id()`, so the actor
  does not receive their own notification.
- Permission names used in code must match the registry exactly (e.g.
  `Update Service Requests` is plural).
- `Settings` is a system module — it is intentionally excluded from
  `settings_modules` and is not per-role toggleable.
- `Finance` and `Commercial` are group gates included in `settings_modules` so
  their page groups can be toggled per role.
