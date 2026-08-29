<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Provision the five per-society roles and their permissions.
     */
    public function run($society): void
    {
        $roleNames = config('modules.role_types'); // Admin, Manager, Owner, Tenant, Guard

        $roles = [];
        foreach ($roleNames as $displayName) {
            $roles[$displayName] = Role::create([
                'name' => $displayName . '_' . $society->id,
                'display_name' => $displayName,
                'guard_name' => 'web',
                'society_id' => $society->id,
            ]);
        }

        $allPermissions = \App\Models\Permission::pluck('name')->all();

        $roles['Admin']->syncPermissions($allPermissions);
        $roles['Manager']->syncPermissions($allPermissions);

        $rolePermissions = config('modules.role_permissions');

        foreach (['Owner', 'Tenant', 'Guard'] as $role) {
            $roles[$role]->syncPermissions(
                \App\Models\Permission::whereIn('name', $rolePermissions[$role] ?? [])->get()
            );
        }
    }
}
