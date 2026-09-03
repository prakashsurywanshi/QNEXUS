<?php

namespace Tests\Feature;

use App\Models\NotificationPreference;
use App\Models\Role;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Models\User;
use App\Scopes\SocietyScope;
use Database\Seeders\ModuleSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationWiringTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_a_notice_broadcasts_to_other_members_but_not_creator(): void
    {
        [$society, $manager, $owner] = $this->provisionRoles();

        $this->actingAs($manager)->post('/notices', [
            'title' => 'Power outage tomorrow',
            'description' => 'Scheduled maintenance from 10am.',
        ])->assertRedirect('/notices');

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $owner->id,
        ]);
        $this->assertDatabaseMissing('notifications', [
            'notifiable_id' => $manager->id,
        ]);
    }

    public function test_creating_a_ticket_notifies_users_with_show_tickets_permission(): void
    {
        [$society, $manager, $owner] = $this->provisionRoles();

        $managerPerCount = $manager->notifications()->count();

        $this->actingAs($owner)->post('/tickets', [
            'subject' => 'Leak in bathroom',
        ])->assertRedirect();

        $this->assertSame($managerPerCount + 1, $manager->fresh()->notifications()->count());
    }

    public function test_a_muted_category_still_inserts_for_others_but_skips_muted_user(): void
    {
        [$society, $manager, $owner] = $this->provisionRoles();

        NotificationPreference::create([
            'user_id' => $owner->id,
            'category' => 'notices',
            'muted' => true,
        ]);

        $ownerCount = $owner->notifications()->count();

        $this->actingAs($manager)->post('/notices', [
            'title' => 'Muted broadcast',
        ])->assertRedirect('/notices');

        $this->assertSame($ownerCount, $owner->fresh()->notifications()->count());
    }

    private function provisionRoles(): array
    {
        $this->seed(ModuleSeeder::class);
        $this->seed(PermissionSeeder::class);

        $society = Society::create(['name' => 'Notification Demo']);
        (new RoleSeeder)->run($society);

        $managerRole = Role::withoutGlobalScope(SocietyScope::class)
            ->where('society_id', $society->id)
            ->where('display_name', 'Manager')
            ->firstOrFail();

        $ownerRole = Role::withoutGlobalScope(SocietyScope::class)
            ->where('society_id', $society->id)
            ->where('display_name', 'Owner')
            ->firstOrFail();

        $manager = $this->makeUser($society, $managerRole, 'manager@demo.test');
        $owner = $this->makeUser($society, $ownerRole, 'owner@demo.test');

        return [$society, $manager, $owner];
    }

    private function makeUser(Society $society, Role $role, string $email): User
    {
        $user = User::factory()->create([
            'name' => $email,
            'email' => $email,
            'society_id' => $society->id,
            'role_id' => $role->id,
        ]);

        SocietyUser::unguarded(fn () => SocietyUser::withoutGlobalScope(SocietyScope::class)->insert([
            'user_id' => $user->id,
            'society_id' => $society->id,
            'role_id' => $role->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]));

        return $user;
    }
}
