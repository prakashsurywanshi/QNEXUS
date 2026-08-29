<?php

namespace App\Observers;

use App\Models\ModuleSetting;
use App\Models\Society;

class SocietyObserver
{
    public function saving(Society $society): void
    {
        if ($society->isDirty('name')) {
            $society->slug = $this->createUniqueSlug($society);
        }
    }

    public function created(Society $society): void
    {
        $this->addModuleSettings($society);
    }

    /**
     * Provision the correct module_settings rows for a society's property type.
     */
    private function addModuleSettings(Society $society): void
    {
        $modules = config('modules.settings_modules');
        $types = config('modules.role_types');

        $modules = array_filter($modules, function ($module) use ($society) {
            return moduleAppliesToType($module, $society->property_type);
        });

        $data = [];
        foreach ($types as $type) {
            foreach ($modules as $module) {
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

    /**
     * Re-sync module settings when a society's property type changes.
     * Additive / non-destructive: inserts missing rows only.
     */
    public function syncSocietyModuleSettings(Society $society): void
    {
        $modules = config('modules.settings_modules');
        $types = config('modules.role_types');

        foreach ($types as $type) {
            foreach ($modules as $module) {
                if (!moduleAppliesToType($module, $society->property_type)) {
                    continue;
                }

                ModuleSetting::where('society_id', $society->id)
                    ->where('module_name', $module)
                    ->where('type', $type)
                    ->firstOrCreate([
                        'society_id' => $society->id,
                        'module_name' => $module,
                        'type' => $type,
                    ], [
                        'status' => 'active',
                    ]);
            }
        }

        if (function_exists('clearSocietyModulesCache')) {
            clearSocietyModulesCache($society->id);
        }
    }

    private function createUniqueSlug(Society $society): string
    {
        $slug = str($society->name)->slug();
        $original = $slug;
        $count = 0;

        while (Society::where('slug', $slug)
            ->where('id', '<>', $society->id)
            ->exists()
        ) {
            $count++;
            $slug = "{$original}-{$count}";
        }

        return $slug;
    }
}
