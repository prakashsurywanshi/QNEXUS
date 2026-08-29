<?php

/*
|--------------------------------------------------------------------------
| Central Module Registry
|--------------------------------------------------------------------------
|
| Single source of truth for every feature/module in the application.
| Each entry maps a module name to its exact set of permissions.
|
| Seeders (ModuleSeeder, ModuleSettingSeeder, PermissionSeeder, RoleSeeder)
| and provisioning for a new society all derive from this registry, so any new
| feature can be registered once here and provisioned consistently for every
| society.
|
*/

return [

    // The role types that a module setting is provisioned for.
    'role_types' => ['Admin', 'Manager', 'Owner', 'Tenant', 'Guard'],

    /*
    |--------------------------------------------------------------------------
    | Module property-type buckets
    |--------------------------------------------------------------------------
    |
    | Tags each module with the society property type(s) it belongs to:
    |   - 'residential' : only relevant for residential (or mixed) societies
    |   - 'commercial'  : only relevant for commercial (or mixed) societies
    |   - 'both'        : neutral / admin modules available to every society
    |
    */
    'module_types' => [
        'Tower' => 'residential',
        'Floor' => 'residential',
        'Apartment' => 'residential',
        'Parking' => 'residential',
        'Amenities' => 'residential',
        'Book Amenity' => 'residential',
        'Tenant' => 'residential',
        'Rent' => 'residential',
        'Utility Bills' => 'residential',
        'Common Area Bills' => 'both',
        'Maintenance' => 'residential',
        'Service Provider' => 'both',
        'Service Time Logging' => 'both',
        'Commercial' => 'commercial',
        'Commercial Units' => 'commercial',
        'Commercial Tenants' => 'commercial',
        'Lease Agreements' => 'commercial',
        'CAM Charges' => 'commercial',
        'Commercial Rent Invoices' => 'commercial',
    ],

    /*
    |--------------------------------------------------------------------------
    | Modules => permissions
    |--------------------------------------------------------------------------
    |
    | 'Module Name' => [ 'permission', ... ]
    |
    */
    'modules' => [

        // ---- Core Society Setup ----
        'Tower' => ['Create Tower', 'Show Tower', 'Update Tower', 'Delete Tower'],
        'Floor' => ['Create Floor', 'Show Floor', 'Update Floor', 'Delete Floor'],
        'Apartment' => ['Create Apartment', 'Show Apartment', 'Update Apartment', 'Delete Apartment'],
        'User' => ['Create User', 'Show User', 'Update User', 'Delete User'],
        'Owner' => ['Create Owner', 'Show Owner', 'Update Owner', 'Delete Owner'],
        'Tenant' => ['Create Tenant', 'Show Tenant', 'Update Tenant', 'Delete Tenant'],

        // ---- Billing & Operations ----
        'Rent' => ['Create Rent', 'Show Rent', 'Update Rent', 'Delete Rent'],
        'Utility Bills' => ['Create Utility Bills', 'Show Utility Bills', 'Update Utility Bills', 'Delete Utility Bills'],
        'Common Area Bills' => ['Create Common Area Bills', 'Show Common Area Bills', 'Update Common Area Bills', 'Delete Common Area Bills'],
        'Maintenance' => ['Create Maintenance', 'Show Maintenance', 'Update Maintenance', 'Delete Maintenance'],
        'Amenities' => ['Create Amenities', 'Show Amenities', 'Update Amenities', 'Delete Amenities'],
        'Book Amenity' => ['Create Book Amenity', 'Show Book Amenity', 'Update Book Amenity', 'Delete Book Amenity'],
        'Visitors' => ['Create Visitors', 'Show Visitors', 'Update Visitors', 'Delete Visitors'],
        'Notice Board' => ['Create Notice Board', 'Show Notice Board', 'Update Notice Board', 'Delete Notice Board'],
        'Tickets' => ['Create Tickets', 'Show Tickets', 'Update Tickets', 'Delete Tickets'],
        'Parking' => ['Create Parking', 'Show Parking', 'Update Parking', 'Delete Parking'],
        'Service Provider' => ['Create Service Provider', 'Show Service Provider', 'Update Service Provider', 'Delete Service Provider'],
        'Service Time Logging' => ['Create Service Time Logging', 'Show Service Time Logging', 'Update Service Time Logging', 'Delete Service Time Logging'],
        'Assets' => ['Create Assets', 'Show Assets', 'Update Assets', 'Delete Assets'],
        'Settings' => ['Manage Settings'],

        // ---- Society & Compliance ----
        'Compliance' => ['Create Compliance', 'Show Compliance', 'Update Compliance', 'Delete Compliance'],
        'Emergency Contacts' => ['Create Emergency Contact', 'Show Emergency Contact', 'Update Emergency Contact', 'Delete Emergency Contact'],
        'SOS Alerts' => ['Create SOS Alert', 'Show SOS Alert', 'Update SOS Alert', 'Delete SOS Alert'],
        'Documents' => ['Create Document', 'Show Document', 'Update Document', 'Delete Document'],
        'Pets' => ['Create Pet', 'Show Pet', 'Update Pet', 'Delete Pet'],
        'Move Records' => ['Create Move Record', 'Show Move Record', 'Update Move Record', 'Delete Move Record'],
        'Daily Help' => ['Create Daily Help', 'Show Daily Help', 'Update Daily Help', 'Delete Daily Help'],

        // ---- Vendors & Procurement ----
        'Vendors' => ['Create Vendor', 'Show Vendor', 'Update Vendor', 'Delete Vendor'],
        'Vendor Contracts' => ['Create Vendor Contract', 'Show Vendor Contract', 'Update Vendor Contract', 'Delete Vendor Contract'],
        'Purchase Orders' => ['Create Purchase Order', 'Show Purchase Order', 'Update Purchase Order', 'Delete Purchase Order'],
        'Purchase Invoices' => ['Create Purchase Invoice', 'Show Purchase Invoice', 'Update Purchase Invoice', 'Delete Purchase Invoice'],
        'Credit Notes' => ['Create Credit Note', 'Show Credit Note', 'Update Credit Note', 'Delete Credit Note'],
        'Advance Accounts' => ['Create Advance Account', 'Show Advance Account', 'Update Advance Account', 'Delete Advance Account'],

        // ---- Utilities & Security ----
        'Prepaid Meters' => ['Create Prepaid Meter', 'Show Prepaid Meter', 'Update Prepaid Meter', 'Delete Prepaid Meter'],
        'Patrol' => ['Create Patrol', 'Show Patrol', 'Update Patrol', 'Delete Patrol'],
        'Visitor Preapprovals' => ['Create Visitor Preapproval', 'Show Visitor Preapproval', 'Update Visitor Preapproval', 'Delete Visitor Preapproval'],
        'Worker Checkins' => ['Create Worker Checkin', 'Show Worker Checkin', 'Update Worker Checkin', 'Delete Worker Checkin'],
        'Gatepasses' => ['Create Gatepass', 'Show Gatepass', 'Update Gatepass', 'Delete Gatepass'],
        'Boom Barriers' => ['Create Boom Barrier', 'Show Boom Barrier', 'Update Boom Barrier', 'Delete Boom Barrier'],

        // ---- Engagement & Events ----
        'Events' => ['Create Event', 'Show Event', 'Update Event', 'Delete Event'],
        'Polls' => ['Create Poll', 'Show Poll', 'Update Poll', 'Delete Poll'],
        'Meetings' => ['Create Meeting', 'Show Meeting', 'Update Meeting', 'Delete Meeting'],

        // ---- Finance & Accounting (group permission 'Show Finance') ----
        'Finance' => ['Show Finance'],
        'Chart of Accounts' => ['Create Chart of Account', 'Show Chart of Account', 'Update Chart of Account', 'Delete Chart of Account'],
        'General Ledger' => ['Create General Ledger', 'Show General Ledger', 'Update General Ledger', 'Delete General Ledger'],
        'Journal Vouchers' => ['Create Journal Voucher', 'Show Journal Voucher', 'Update Journal Voucher', 'Delete Journal Voucher'],
        'Budgets' => ['Create Budget', 'Show Budget', 'Update Budget', 'Delete Budget'],
        'Fixed Deposits' => ['Create Fixed Deposit', 'Show Fixed Deposit', 'Update Fixed Deposit', 'Delete Fixed Deposit'],

        // ---- Commercial (group permission 'Show Commercial') ----
        'Commercial' => ['Show Commercial'],
        'Commercial Units' => ['Create Commercial Unit', 'Show Commercial Unit', 'Update Commercial Unit', 'Delete Commercial Unit'],
        'Commercial Tenants' => ['Create Commercial Tenant', 'Show Commercial Tenant', 'Update Commercial Tenant', 'Delete Commercial Tenant'],
        'Lease Agreements' => ['Create Lease Agreement', 'Show Lease Agreement', 'Update Lease Agreement', 'Delete Lease Agreement'],
        'CAM Charges' => ['Create CAM Charge', 'Show CAM Charge', 'Update CAM Charge', 'Delete CAM Charge'],
        'Commercial Rent Invoices' => ['Create Commercial Rent Invoice', 'Show Commercial Rent Invoice', 'Update Commercial Rent Invoice', 'Delete Commercial Rent Invoice'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Modules toggled per role through module_settings
    |--------------------------------------------------------------------------
    |
    | Modules that should appear in the per-role module settings UI and be
    | provisioned to society_role_modules(). 'Settings' is intentionally
    | excluded (system module, not role-toggleable). The group 'Finance' and
    | 'Commercial' are included so their pages can be turned off per role.
    |
    */
    'settings_modules' => [
        'Tower', 'Floor', 'Apartment', 'User', 'Owner', 'Tenant', 'Rent',
        'Utility Bills', 'Common Area Bills', 'Maintenance', 'Amenities',
        'Book Amenity', 'Visitors', 'Notice Board', 'Tickets', 'Parking',
        'Service Provider', 'Service Time Logging', 'Assets',
        'Compliance', 'Emergency Contacts', 'SOS Alerts', 'Documents', 'Pets',
        'Move Records', 'Daily Help', 'Vendors', 'Vendor Contracts',
        'Purchase Orders', 'Purchase Invoices', 'Credit Notes', 'Advance Accounts',
        'Prepaid Meters', 'Patrol', 'Visitor Preapprovals', 'Worker Checkins',
        'Gatepasses', 'Boom Barriers', 'Events', 'Polls', 'Meetings',
        'Finance', 'Chart of Accounts', 'General Ledger', 'Journal Vouchers',
        'Budgets', 'Fixed Deposits', 'Commercial', 'Commercial Units',
        'Commercial Tenants', 'Lease Agreements', 'CAM Charges',
        'Commercial Rent Invoices',
    ],

    // Default permission names assigned to each role (beyond Admin/Manager,
    // who are granted every permission).
    'role_permissions' => [
        'Owner' => ['Create Book Amenity', 'Create Tickets'],
        'Tenant' => ['Create Book Amenity', 'Create Tickets'],
        'Guard' => [
            'Create Visitors',
            'Create Tickets',
            'Show Parking',
            'Show Apartment',
            'Update Visitors',
        ],
    ],
];
