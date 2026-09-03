<?php

namespace Tests\Feature\SuperAdmin;

use App\Models\Role;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Models\User;
use App\Scopes\SocietyScope;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class DashboardTest extends SuperAdminTestCase
{
    public function test_superadmin_can_access_dashboard(): void
    {
        $this->get(route('superadmin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('superadmin/dashboard'));
    }

    public function test_non_superadmin_is_blocked(): void
    {
        $society = Society::create(['name' => 'Demo Villa', 'property_type' => 'residential']);

        $user = User::factory()->create([
            'email' => 'admin@demo.test',
            'society_id' => $society->id,
        ]);

        $adminRole = Role::withoutGlobalScope(SocietyScope::class)
            ->where('society_id', $society->id)
            ->where('display_name', 'Admin')
            ->firstOrFail();

        Model::unguarded(fn () => SocietyUser::create([
            'user_id' => $user->id,
            'society_id' => $society->id,
            'role_id' => $adminRole->id,
        ]));

        $this->actingAs($user)
            ->get(route('superadmin.dashboard'))
            ->assertForbidden();
    }

    public function test_guest_is_redirected(): void
    {
        auth()->logout();

        $this->get(route('superadmin.dashboard'))
            ->assertRedirect(route('login'));
    }

    public function test_dashboard_shows_society_stats(): void
    {
        $this->get(route('superadmin.dashboard'))
            ->assertInertia(
                fn (Assert $page) => $page
                    ->where('stats.societies', 0)
                    ->where('stats.packages', 1)
                    ->has('recentSocieties')
            );
    }

    public function test_superadmin_login_redirects_to_superadmin_dashboard(): void
    {
        auth()->logout();

        $this->post(route('login'), [
            'email' => $this->superadmin->email,
            'password' => 'password',
        ])->assertRedirect(route('superadmin.dashboard'));
    }

    public function test_superadmin_navigating_to_member_dashboard_is_redirected(): void
    {
        $this->get(route('dashboard', absolute: false))
            ->assertRedirect(route('superadmin.dashboard'));
    }

    public function test_member_of_inactive_society_is_blocked(): void
    {
        $society = Society::create([
            'name' => 'Decommissioned Estate',
            'property_type' => 'residential',
            'is_active' => false,
        ]);

        $user = User::factory()->create([
            'email' => 'member@inactive.test',
            'society_id' => $society->id,
        ]);

        $this->actingAs($user)
            ->get(route('dashboard', absolute: false))
            ->assertForbidden();
    }
}
