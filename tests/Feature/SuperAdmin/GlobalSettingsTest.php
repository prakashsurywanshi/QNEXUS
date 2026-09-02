<?php

namespace Tests\Feature\SuperAdmin;

use App\Models\GlobalCurrency;
use App\Models\GlobalSetting;
use Inertia\Testing\AssertableInertia as Assert;

class GlobalSettingsTest extends SuperAdminTestCase
{
    public function test_settings_page_renders(): void
    {
        $this->get(route('superadmin.settings.edit'))
            ->assertOk()
            ->assertInertia(
                fn (Assert $page) => $page
                    ->component('superadmin/settings')
                    ->has('settings')
                    ->has('currencies')
            );
    }

    public function test_can_update_global_settings(): void
    {
        $this->put(route('superadmin.settings.update'), [
            'name' => 'QNEXUS Platform',
            'email' => 'hello@qnexus.test',
            'locale' => 'en',
            'timezone' => 'Asia/Kolkata',
            'default_currency_id' => GlobalCurrency::first()->id,
            'disable_landing_site' => false,
            'landing_site_type' => 'theme',
            'landing_site_url' => null,
            'show_logo_text' => true,
            'meta_keyword' => 'society, management',
            'meta_description' => 'QNEXUS platform',
        ])->assertRedirect();

        $this->assertDatabaseHas('global_settings', [
            'name' => 'QNEXUS Platform',
            'email' => 'hello@qnexus.test',
        ]);
    }

    public function test_update_requires_name(): void
    {
        $this->put(route('superadmin.settings.update'), [
            'name' => '',
        ])->assertSessionHasErrors('name');
    }

    public function test_disable_landing_redirects_visitors_to_login(): void
    {
        GlobalSetting::query()->update(['disable_landing_site' => true]);

        auth()->logout();

        $this->get(route('home'))->assertRedirect(route('login'));
    }
}
