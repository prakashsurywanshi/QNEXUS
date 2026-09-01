<?php

namespace Tests\Feature\Crud;

use App\Models\Role;
use App\Models\SocietyUser;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class MembersCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('members.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('members/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('members.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('members.store'), [
            'role_id' => $this->admin->id,
        ])->assertSessionHasErrors('name');
    }

    public function test_can_create_member()
    {
        $response = $this->post(route('members.store'), [
            'name' => 'Neha Patel',
            'email' => 'neha@example.com',
            'phone_number' => '9876511111',
            'password' => 'secret-password',
            'role_id' => $this->admin->id,
        ]);

        $response->assertRedirect(route('members.index'));

        $user = User::where('email', 'neha@example.com')->firstOrFail();

        $this->assertSame('Neha Patel', $user->name);
        $this->assertSame($this->society->id, $user->society_id);
        $this->assertSame('9876511111', $user->phone_number);

        $this->assertDatabaseHas('society_user', [
            'user_id' => $user->id,
            'society_id' => $this->society->id,
            'role_id' => $this->admin->id,
        ]);
    }

    public function test_can_update_member()
    {
        $member = User::factory()->create(['society_id' => $this->society->id]);

        Model::unguarded(fn () => SocietyUser::create([
            'user_id' => $member->id,
            'society_id' => $this->society->id,
            'role_id' => $this->admin->id,
        ]));

        $otherRole = \App\Models\Role::withoutGlobalScope(\App\Scopes\SocietyScope::class)
            ->where('society_id', $this->society->id)
            ->where('display_name', 'Manager')
            ->firstOrFail();

        $this->put(route('members.update', $member), [
            'name' => 'Updated Member',
            'email' => 'updated@example.com',
            'phone_number' => '9876522222',
            'password' => '',
            'role_id' => $otherRole->id,
        ])->assertRedirect(route('members.index'));

        $member->refresh();

        $this->assertSame('Updated Member', $member->name);
        $this->assertSame('9876522222', $member->phone_number);

        $this->assertDatabaseHas('society_user', [
            'user_id' => $member->id,
            'society_id' => $this->society->id,
            'role_id' => $otherRole->id,
        ]);
    }

    public function test_can_remove_member_from_society()
    {
        $member = User::factory()->create(['society_id' => $this->society->id]);

        Model::unguarded(fn () => SocietyUser::create([
            'user_id' => $member->id,
            'society_id' => $this->society->id,
            'role_id' => $this->admin->id,
        ]));

        $this->delete(route('members.destroy', $member))
            ->assertRedirect(route('members.index'));

        $this->assertDatabaseMissing('society_user', [
            'user_id' => $member->id,
            'society_id' => $this->society->id,
        ]);

        $this->assertDatabaseHas('users', ['id' => $member->id]);
    }

    public function test_member_index_is_scoped_to_active_society()
    {
        $otherSociety = \App\Models\Society::create(['name' => 'Other Society']);
        $outsider = User::factory()->create(['society_id' => $otherSociety->id]);

        $this->get(route('members.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('members/index')
                ->has('members', 1)
                ->whereNot('members.0.id', $outsider->id)
            );

        $this->assertDatabaseHas('users', ['id' => $outsider->id]);
    }
}