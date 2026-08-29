<?php

namespace Database\Seeders;

use App\Models\ModuleSetting;
use Illuminate\Database\Seeder;

class ModuleSettingSeeder extends Seeder
{
    public function run($society): void
    {
        $modules = config('modules.settings_modules');
        $types = config('modules.role_types');

        $data = [];
        foreach ($types as $type) {
            foreach ($modules as $module) {
                if (!moduleAppliesToType($module, $society->property_type)) {
                    continue;
                }

                $data[] = [
                    'society_id' => $society->id,
                    'module_name' => $module,
                    'status' => 'active',
                    'type' => $type,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        ModuleSetting::insert($data);
    }
}
