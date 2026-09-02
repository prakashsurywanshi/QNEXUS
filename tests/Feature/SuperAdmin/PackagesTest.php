<?php

namespace Tests\Feature\SuperAdmin;

use App\Models\GlobalCurrency;
use App\Models\Module;
use App\Models\Package;
use Database\Seeders\ModuleSeeder;
use Inertia\Testing\AssertableInertia as Assert;

class PackagesTest extends SuperAdminTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(ModuleSeeder::class);
    }

    public function test_packages_index_renders(): void
    {
        $this->get(route('superadmin.packages.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('superadmin/packages/index'));
    }

    public function test_create_page_renders_with_modules(): void
    {
        $this->get(route('superadmin.packages.create'))
            ->assertOk()
            ->assertInertia(
                fn (Assert $page) => $page
                    ->component('superadmin/packages/create')
                    ->has('currencies')
                    ->has('modules')
            );
    }

    public function test_can_create_package_with_modules(): void
    {
        $currency = GlobalCurrency::firstOrFail();

        $this->post(route('superadmin.packages.store'), [
            'package_name' => 'Enterprise',
            'description' => 'Full platform',
            'currency_id' => $currency->id,
            'monthly_price' => 999,
            'annual_price' => 9990,
            'package_type' => 'standard',
            'is_recommended' => true,
            'module_ids' => Module::orderBy('id')->limit(3)->pluck('id')->all(),
        ])->assertRedirect(route('superadmin.packages.index'));

        $package = Package::where('package_name', 'Enterprise')->firstOrFail();

        $this->assertDatabaseHas('packages', [
            'id' => $package->id,
            'monthly_price' => 999,
            'package_type' => 'standard',
        ]);

        $this->assertSame(3, $package->modules()->count());
    }

    public function test_package_requires_name_and_currency(): void
    {
        $this->post(route('superadmin.packages.store'), [
            'package_name' => '',
        ])->assertSessionHasErrors(['package_name', 'currency_id']);
    }

    public function test_can_update_package(): void
    {
        $currency = GlobalCurrency::firstOrFail();
        $package = Package::firstOrFail();

        $this->put(route('superadmin.packages.update', $package), [
            'package_name' => 'Renamed Package',
            'description' => 'Updated',
            'currency_id' => $currency->id,
            'package_type' => 'lifetime',
            'monthly_price' => 199,
            'annual_price' => 1990,
            'module_ids' => [],
        ])->assertRedirect(route('superadmin.packages.index'));

        $this->assertDatabaseHas('packages', [
            'id' => $package->id,
            'package_name' => 'Renamed Package',
            'package_type' => 'lifetime',
        ]);
    }

    public function test_can_delete_package(): void
    {
        $currency = GlobalCurrency::firstOrFail();
        $package = Package::create([
            'package_name' => 'Temp Package',
            'currency_id' => $currency->id,
            'package_type' => 'standard',
        ]);

        $this->delete(route('superadmin.packages.destroy', $package))
            ->assertRedirect(route('superadmin.packages.index'));

        $this->assertDatabaseMissing('packages', ['id' => $package->id]);
    }
}
