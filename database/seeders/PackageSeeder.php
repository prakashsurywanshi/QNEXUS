<?php

namespace Database\Seeders;

use App\Enums\PackageType;
use App\Models\GlobalCurrency;
use App\Models\Module;
use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $currency = GlobalCurrency::where('status', 'enable')->orderBy('id')->first();

        $data = [
            'package_name' => 'Default',
            'description' => 'Default free package assigned to newly provisioned societies.',
            'currency_id' => $currency?->id,
            'package_type' => PackageType::FREE->value,
            'is_free' => 1,
            'monthly_price' => 0,
            'annual_price' => 0,
            'is_recommended' => 1,
        ];

        Package::updateOrCreate(
            ['package_name' => 'Default'],
            $data
        );

        // Demo provisioning goal: every package entitles all configured modules
        // so a demo society can explore every feature regardless of its package.
        // Idempotent - syncs the exact set each run.
        $moduleIds = Module::whereIn('name', array_keys(config('modules.modules')))->pluck('id');
        foreach (Package::all() as $pkg) {
            $pkg->modules()->sync($moduleIds);
        }
    }
}
