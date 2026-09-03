<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Models\Ticket;
use App\Models\User;
use Database\Seeders\ModuleSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewModulesTest extends TestCase
{
    use RefreshDatabase;

    public function test_tickets_index_renders_for_admin(): void
    {
        $user = $this->setUpSocietyUser('Admin');

        $response = $this->actingAs($user)->get(route('tickets.index'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('tickets/index'));
    }

    public function test_ticket_store_redirects(): void
    {
        $user = $this->setUpSocietyUser('Admin');

        $response = $this->actingAs($user)->post(route('tickets.store'), [
            'subject' => 'Broken lift',
            'type_id' => null,
        ]);
        $ticket = Ticket::first();
        $response->assertRedirect(route('tickets.show', $ticket->id));
    }

    public function test_amenity_bookings_index_renders_for_admin(): void
    {
        $user = $this->setUpSocietyUser('Admin');

        $response = $this->actingAs($user)->get(route('amenity-bookings.index'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('amenity-bookings/index'));
    }

    public function test_sos_alerts_index_renders_for_admin(): void
    {
        $user = $this->setUpSocietyUser('Admin');

        $response = $this->actingAs($user)->get(route('sos-alerts.index'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('sos-alerts/index'));
    }

    public function test_parking_index_renders_for_admin(): void
    {
        $user = $this->setUpSocietyUser('Admin');

        $response = $this->actingAs($user)->get(route('parking.index'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('parking/index'));
    }

    public function test_attendance_index_renders_for_admin(): void
    {
        $user = $this->setUpSocietyUser('Admin');

        $response = $this->actingAs($user)->get(route('attendance.index'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('attendance/index'));
    }

    public function test_daily_help_index_renders_for_admin(): void
    {
        $user = $this->setUpSocietyUser('Admin');

        $response = $this->actingAs($user)->get(route('daily-help.index'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('daily-help/index'));
    }

    private function setUpSocietyUser(string $roleName): User
    {
        $this->seed(ModuleSeeder::class);
        $this->seed(PermissionSeeder::class);

        $society = Society::create(['name' => 'New Modules Demo']);
        (new RoleSeeder())->run($society);

        $role = Role::where('society_id', $society->id)
            ->where('display_name', $roleName)
            ->first();

        $user = User::create([
            'name' => "$roleName User",
            'email' => strtolower($roleName) . '@modules.test',
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