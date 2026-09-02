<?php

namespace Tests\Feature\SuperAdmin;

use App\Enums\PackageType;
use App\Models\GlobalInvoice;
use App\Models\GlobalSubscription;
use App\Models\Package;
use App\Models\Role;
use App\Models\Society;
use App\Scopes\SocietyScope;
use Database\Seeders\CmsContentSeeder;
use Database\Seeders\GlobalCurrencySeeder;
use Database\Seeders\GlobalSettingsSeeder;
use Database\Seeders\ModuleSeeder;
use Database\Seeders\PackageSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\SuperadminSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocietyOnboardingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(GlobalSettingsSeeder::class);
        $this->seed(GlobalCurrencySeeder::class);
        $this->seed(SuperadminSeeder::class);
        $this->seed(PackageSeeder::class);
        $this->seed(CmsContentSeeder::class);
        $this->seed(ModuleSeeder::class);
        $this->seed(PermissionSeeder::class);

        forget_global_settings_cache();
    }

    public function test_creating_a_society_provisions_roles_subscription_and_invoice(): void
    {
        $society = Society::create([
            'name' => 'Onboarding Towers',
            'property_type' => 'residential',
        ]);

        $this->assertSame(5, Role::withoutGlobalScope(SocietyScope::class)
            ->where('society_id', $society->id)
            ->count());

        $this->assertSame(1, GlobalSubscription::where('society_id', $society->id)->count());

        $this->assertSame(1, GlobalInvoice::where('society_id', $society->id)->count());
    }

    public function test_provisioned_admin_role_gets_all_permissions(): void
    {
        $society = Society::create(['name' => 'Perm Check', 'property_type' => 'residential']);

        $admin = Role::withoutGlobalScope(SocietyScope::class)
            ->where('society_id', $society->id)
            ->where('display_name', 'Admin')
            ->firstOrFail();

        $this->assertNotEmpty($admin->permissions()->pluck('name')->all());
    }

    public function test_new_society_starts_with_free_package_assigned(): void
    {
        $society = Society::create(['name' => 'Free Trial', 'property_type' => 'residential']);

        $package = Package::find($society->fresh()->package_id);

        $this->assertNotNull($package);
        $this->assertSame(PackageType::FREE, $package->package_type);
    }
}
