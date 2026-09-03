<?php

namespace Tests\Feature\Crud;

use App\Models\Module;
use App\Models\Package;
use App\Models\Society;
use Database\Seeders\ModuleSeeder;

class ModuleEntitlementCrudTest extends CrudTestCase
{
    /**
     * A society without a restrictive package (or with a free package that
     * grants no modules) falls back to all modules being enabled, so module
     * routes remain accessible.
     */
    public function test_module_routes_accessible_when_no_restrictive_package(): void
    {
        $this->get(route('energy.index'))
            ->assertOk();

        $this->get(route('service-requests.index'))
            ->assertOk();
    }

    /**
     * When the active society's package only entitles specific modules, a
     * module outside the package is blocked with 403.
     */
    public function test_disabled_module_route_blocked_by_package(): void
    {
        $this->seed(ModuleSeeder::class);

        $energyModule = Module::where('name', 'Energy')->firstOrFail();
        $towerModule = Module::where('name', 'Tower')->firstOrFail();

        $package = Package::create([
            'package_name' => 'Restricted',
            'is_free' => 0,
            'monthly_price' => 0,
            'annual_price' => 0,
        ]);
        $package->modules()->sync([$towerModule->id]);

        $this->society->update(['package_id' => $package->id]);

        session()->forget('enabled_module_names');

        $this->get(route('energy.index'))
            ->assertForbidden();

        $this->get(route('towers.index'))
            ->assertOk();
    }

    /**
     * The enabled module list reflects the package's entitled modules.
     */
    public function test_enabled_module_names_reflects_package(): void
    {
        $this->seed(ModuleSeeder::class);

        $energyModule = Module::where('name', 'Energy')->firstOrFail();

        $package = Package::create([
            'package_name' => 'Energy Only',
            'is_free' => 0,
            'monthly_price' => 0,
            'annual_price' => 0,
        ]);
        $package->modules()->sync([$energyModule->id]);

        $this->society->update(['package_id' => $package->id]);
        session()->forget('enabled_module_names');

        $this->assertTrue(\module_enabled('Energy'));
        $this->assertFalse(\module_enabled('Tower'));
    }
}
