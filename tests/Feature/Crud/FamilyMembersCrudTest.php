<?php

namespace Tests\Feature\Crud;

use App\Models\FamilyMember;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class FamilyMembersCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('family-members.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('family-members/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('family-members.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('family-members/create'));
    }

    public function test_can_create_family_member()
    {
        $this->post(route('family-members.store'), [
            'user_id' => $this->user->id,
            'name' => 'Priya Sharma',
            'relationship' => 'Spouse',
            'phone' => '+91 9876543210',
            'document_type' => 'Aadhaar',
            'document' => '1234-5678-9012',
        ])->assertRedirect(route('family-members.index'));

        $this->assertDatabaseHas('family_members', [
            'name' => 'Priya Sharma',
            'relationship' => 'Spouse',
            'user_id' => $this->user->id,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_family_member()
    {
        $member = Model::unguarded(fn () => FamilyMember::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'name' => 'Old Name',
        ]));

        $this->put(route('family-members.update', $member), [
            'user_id' => $this->user->id,
            'name' => 'Rahul Verma',
            'relationship' => 'Parent',
            'phone' => '+91 9988776655',
        ])->assertRedirect(route('family-members.index'));

        $this->assertDatabaseHas('family_members', [
            'id' => $member->id,
            'name' => 'Rahul Verma',
            'relationship' => 'Parent',
        ]);
    }

    public function test_edit_page_renders()
    {
        $member = Model::unguarded(fn () => FamilyMember::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'name' => 'Priya Sharma',
        ]));

        $this->get(route('family-members.edit', $member))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('family-members/edit'));
    }

    public function test_can_delete_family_member()
    {
        $member = Model::unguarded(fn () => FamilyMember::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'name' => 'Priya Sharma',
        ]));

        $this->delete(route('family-members.destroy', $member))
            ->assertRedirect(route('family-members.index'));

        $this->assertDatabaseMissing('family_members', ['id' => $member->id]);
    }
}
