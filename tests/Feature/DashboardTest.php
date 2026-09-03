<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Models\User;
use Database\Seeders\ModuleSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_society_user_can_visit_the_dashboard()
    {
        $user = $this->setUpSocietyUser('Admin');

        $response = $this->actingAs($user)->get(route('dashboard'));
        $response->assertOk();
    }

    public function test_admin_dashboard_includes_society_metrics()
    {
        $user = $this->setUpSocietyUser('Admin');

        $response = $this->actingAs($user)->get(route('dashboard'));
        $response->assertOk();

        $response->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('stats.towers')
            ->has('stats.apartments')
            ->has('stats.tenants')
            ->has('stats.open_tickets')
            ->has('lists.rents_due')
            ->has('lists.open_tickets')
            ->has('charts.tickets_by_status')
            ->has('stats.pending_approvals')
            ->has('stats.open_work_orders')
            ->has('stats.active_automations')
            ->has('lists.pending_approvals')
            ->has('lists.work_orders')
            ->has('lists.amc_expiring'));
    }

    public function test_owner_dashboard_is_resident_scoped()
    {
        $user = $this->setUpSocietyUser('Owner');

        $response = $this->actingAs($user)->get(route('dashboard'));
        $response->assertOk();

        $response->assertInertia(fn ($page) => $page
            ->component('home/resident')
            ->has('stats.my_tickets')
            ->has('stats.my_bookings')
            ->has('stats.notices')
            ->has('quick_actions', 3)
            ->where('quick_actions.0.label', 'Book an Amenity')
            ->missing('stats.towers')
            ->missing('lists.rents_due'));
    }

    public function test_guard_dashboard_is_security_scoped()
    {
        $user = $this->setUpSocietyUser('Guard');

        $response = $this->actingAs($user)->get(route('dashboard'));
        $response->assertOk();

        $response->assertInertia(fn ($page) => $page
            ->component('home/guard')
            ->has('stats.checkins_today')
            ->has('stats.open_tickets')
            ->has('stats.active_visitors')
            ->has('quick_actions', 3)
            ->where('quick_actions.0.label', 'Register Visitor')
            ->missing('stats.towers')
            ->missing('stats.apartments'));
    }

    public function test_settings_hub_renders_for_authenticated_user()
    {
        $user = $this->setUpSocietyUser('Admin');

        $response = $this->actingAs($user)->get('/settings');
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('settings/index'));
    }

    private function setUpSocietyUser(string $roleName): User
    {
        $this->seed(ModuleSeeder::class);
        $this->seed(PermissionSeeder::class);

        $society = Society::create(['name' => 'Dashboard Demo']);
        (new RoleSeeder)->run($society);

        $role = Role::where('society_id', $society->id)
            ->where('display_name', $roleName)
            ->first();

        $user = User::create([
            'name' => "$roleName User",
            'email' => strtolower($roleName).'@dashboard.test',
            'password' => '123456',
            'society_id' => $society->id,
            'role_id' => $role->id,
        ]);

        SocietyUser::create([
            'user_id' => $user->id,
            'society_id' => $society->id,
            'role_id' => $role->id,
        ]);

        \refresh_context_for_user();

        return $user;
    }
}
