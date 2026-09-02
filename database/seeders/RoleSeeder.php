<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Society;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Provision (idempotently) the five per-society roles and their permissions.
     * Idempotent so it can be called on an already-provisioned society (e.g.
     * when the SocietyObserver already auto-provisioned roles on creation).
     */
    public function run(Society $society): void
    {
        $roleNames = config('modules.role_types'); // Admin, Manager, Owner, Tenant, Guard

        $roles = [];
        foreach ($roleNames as $displayName) {
            $roles[$displayName] = Role::firstOrCreate(
                ['name' => $displayName.'_'.$society->id],
                [
                    'display_name' => $displayName,
                    'guard_name' => 'web',
                    'society_id' => $society->id,
                ]
            );
        }

        $allPermissions = Permission::pluck('name')->all();

        $roles['Admin']->syncPermissions($allPermissions);
        $roles['Manager']->syncPermissions($allPermissions);

        $rolePermissions = config('modules.role_permissions');

        foreach (['Owner', 'Tenant', 'Guard'] as $role) {
            $roles[$role]->syncPermissions(
                Permission::whereIn('name', $rolePermissions[$role] ?? [])->get()
            );
        }
    }
}
