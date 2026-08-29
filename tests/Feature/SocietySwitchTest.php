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

class SocietySwitchTest extends TestCase
{
    use RefreshDatabase;

    private function provisionedUser(): array
    {
        $this->seed(ModuleSeeder::class);
        $this->seed(PermissionSeeder::class);

        $first = Society::create(['name' => 'Switch Demo A']);
        $second = Society::create(['name' => 'Switch Demo B']);

        (new RoleSeeder())->run($first);
        (new RoleSeeder())->run($second);

        $user = User::factory()->create([
            'name' => 'Switch User',
            'email' => 'switch@user.test',
        ]);

        $adminA = Role::where('society_id', $first->id)->where('display_name', 'Admin')->first();
        $guardB = Role::where('society_id', $second->id)->where('display_name', 'Guard')->first();

        SocietyUser::create([
            'user_id' => $user->id,
            'society_id' => $first->id,
            'role_id' => $adminA->id,
        ]);
        SocietyUser::create([
            'user_id' => $user->id,
            'society_id' => $second->id,
            'role_id' => $guardB->id,
        ]);

        $user->update(['society_id' => $first->id, 'role_id' => $adminA->id]);

        return [$user, $first, $second];
    }

    public function test_user_can_switch_active_society_and_role()
    {
        [$user, $first, $second] = $this->provisionedUser();

        $this->actingAs($user)->post(route('society.switch', $second));

        $this->assertTrue(session('active_society_id') === $second->id);

        $expectedRole = Role::where('society_id', $second->id)->where('display_name', 'Guard')->first();
        $this->assertTrue(session('active_role_id') === $expectedRole->id);
        $this->assertEquals('Guard', \isRole());
    }

    public function test_user_cannot_switch_to_a_society_they_do_not_belong_to()
    {
        [$user, $first, $second] = $this->provisionedUser();

        $outsider = Society::create(['name' => 'Switch Outsider']);

        $response = $this->actingAs($user)->post(route('society.switch', $outsider));

        $response->assertSessionHasErrors('society');
    }

    public function test_guests_cannot_switch_society()
    {
        $society = Society::create(['name' => 'Guest Society']);

        $response = $this->post(route('society.switch', $society->id));

        $response->assertRedirect();
        $this->assertGuest();
    }
}
