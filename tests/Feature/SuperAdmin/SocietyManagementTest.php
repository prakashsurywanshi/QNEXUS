<?php

namespace Tests\Feature\SuperAdmin;

use App\Models\Package;
use App\Models\Society;
use App\Models\User;
use App\Scopes\SocietyScope;

class SocietyManagementTest extends SuperAdminTestCase
{
    public function test_create_page_renders(): void
    {
        $this->get(route('superadmin.societies.create'))->assertOk();
    }

    public function test_superadmin_can_provision_society_as_inactive(): void
    {
        $this->post(route('superadmin.societies.store'), [
            'name' => 'New Provisioned Society',
            'email' => 'new@society.test',
            'property_type' => 'mixed',
        ])->assertRedirect(route('superadmin.societies.index'));

        $society = Society::withoutGlobalScope(SocietyScope::class)
            ->where('name', 'New Provisioned Society')
            ->firstOrFail();

        $this->assertFalse((bool) $society->is_active, 'New societies must start inactive.');
        $this->assertDatabaseHas('global_subscriptions', ['society_id' => $society->id]);
    }

    public function test_superadmin_can_activate_and_deactivate_society(): void
    {
        $society = Society::create(['name' => 'Toggle Society', 'property_type' => 'residential', 'is_active' => false]);

        $this->post(route('superadmin.societies.activate', $society))
            ->assertRedirect(route('superadmin.societies.index'));

        $this->assertTrue((bool) $society->fresh()->is_active);

        $this->post(route('superadmin.societies.deactivate', $society))
            ->assertRedirect(route('superadmin.societies.index'));

        $this->assertFalse((bool) $society->fresh()->is_active);
    }

    public function test_superadmin_can_update_society(): void
    {
        $society = Society::create(['name' => 'Before', 'property_type' => 'residential']);

        $this->put(route('superadmin.societies.update', $society), [
            'name' => 'After',
            'property_type' => 'commercial',
        ])->assertRedirect(route('superadmin.societies.index'));

        $this->assertDatabaseHas('societies', ['id' => $society->id, 'name' => 'After', 'property_type' => 'commercial']);
    }

    public function test_superadmin_can_assign_package_to_society(): void
    {
        $society = Society::create(['name' => 'Subscribed Society', 'property_type' => 'residential']);
        $package = Package::firstOrFail();

        $this->post(route('superadmin.societies.assign-package', $society), [
            'package_id' => $package->id,
        ])->assertRedirect(route('superadmin.societies.index'));

        $this->assertDatabaseHas('societies', ['id' => $society->id, 'package_id' => $package->id]);
        $this->assertDatabaseHas('global_subscriptions', [
            'society_id' => $society->id,
            'package_id' => $package->id,
        ]);
    }

    public function test_member_of_inactive_society_cannot_login(): void
    {
        $society = Society::create(['name' => 'Locked Society', 'property_type' => 'residential', 'is_active' => false]);

        $user = User::factory()->create(['society_id' => $society->id, 'email' => 'locked@member.test']);

        $this->actingAs($user)
            ->get(route('dashboard', absolute: false))
            ->assertForbidden();
    }

    public function test_superadmin_can_impersonate_a_society_member(): void
    {
        $society = Society::create(['name' => 'Impersonated Society', 'property_type' => 'residential']);
        $member = User::factory()->create(['society_id' => $society->id, 'email' => 'member@impersonate.test']);

        $this->post(route('superadmin.societies.impersonate', ['society' => $society, 'user' => $member]))
            ->assertRedirect(route('dashboard', absolute: false));

        $this->assertSame($member->id, auth()->id());
    }

    public function test_superadmin_cannot_impersonate_user_from_another_society(): void
    {
        $society = Society::create(['name' => 'Target Society', 'property_type' => 'residential']);
        $otherSociety = Society::create(['name' => 'Other Society', 'property_type' => 'residential']);
        $member = User::factory()->create(['society_id' => $otherSociety->id, 'email' => 'foreign@member.test']);

        $this->post(route('superadmin.societies.impersonate', ['society' => $society, 'user' => $member]))
            ->assertForbidden();
    }

    public function test_superadmin_can_stop_impersonation(): void
    {
        $society = Society::create(['name' => 'Stop Society', 'property_type' => 'residential']);
        $member = User::factory()->create(['society_id' => $society->id, 'email' => 'stop@member.test']);

        $this->post(route('superadmin.societies.impersonate', ['society' => $society, 'user' => $member]));
        $this->assertSame($member->id, auth()->id());

        $this->post(route('superadmin.stop-impersonate'))
            ->assertRedirect(route('superadmin.dashboard'));

        $this->assertSame($this->superadmin->id, auth()->id());
    }
}
