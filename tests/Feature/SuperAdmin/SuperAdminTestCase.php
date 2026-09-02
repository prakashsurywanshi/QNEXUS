<?php

namespace Tests\Feature\SuperAdmin;

use App\Models\GlobalSetting;
use App\Models\User;
use Database\Seeders\CmsContentSeeder;
use Database\Seeders\GlobalCurrencySeeder;
use Database\Seeders\GlobalSettingsSeeder;
use Database\Seeders\PackageSeeder;
use Database\Seeders\SuperadminSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

abstract class SuperAdminTestCase extends TestCase
{
    use RefreshDatabase;

    protected User $superadmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(GlobalSettingsSeeder::class);
        $this->seed(GlobalCurrencySeeder::class);
        $this->seed(SuperadminSeeder::class);
        $this->seed(PackageSeeder::class);
        $this->seed(CmsContentSeeder::class);

        GlobalSetting::query()->update(['disable_landing_site' => false]);

        forget_global_settings_cache();

        $this->superadmin = User::where('email', 'superadmin@qnexus.test')->firstOrFail();

        $this->actingAs($this->superadmin);
    }
}
