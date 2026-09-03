<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [];
        $existing = Permission::pluck('name')->flip();

        foreach (config('modules.modules') as $moduleName => $permissions) {
            $module = Module::where('name', $moduleName)->first();

            if (! $module) {
                continue;
            }

            foreach ($permissions as $permissionName) {
                if (isset($existing[$permissionName])) {
                    continue;
                }

                $rows[] = [
                    'guard_name' => 'web',
                    'name' => $permissionName,
                    'module_id' => $module->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if ($rows) {
            Permission::insert($rows);
        }
    }
}
