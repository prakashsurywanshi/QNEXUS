<?php

namespace Tests\Feature\Crud;

use App\Models\EmergencyContact;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class EmergencyContactsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('emergency-contacts.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('emergency-contacts/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('emergency-contacts.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('emergency-contacts/create'));
    }

    public function test_can_create_contact()
    {
        $this->post(route('emergency-contacts.store'), [
            'name' => 'City Police',
            'phone' => '100',
            'category' => 'police',
            'is_active' => true,
        ])->assertRedirect(route('emergency-contacts.index'));

        $this->assertDatabaseHas('emergency_contacts', [
            'name' => 'City Police',
            'phone' => '100',
            'category' => 'police',
            'society_id' => $this->society->id,
            'is_active' => true,
        ]);
    }

    public function test_can_update_contact()
    {
        $contact = Model::unguarded(fn () => EmergencyContact::create([
            'society_id' => $this->society->id,
            'name' => 'Old Hospital',
            'phone' => '101',
            'category' => 'hospital',
        ]));

        $this->put(route('emergency-contacts.update', $contact), [
            'name' => 'New Hospital',
            'phone' => '108',
            'category' => 'ambulance',
            'is_active' => false,
        ])->assertRedirect(route('emergency-contacts.index'));

        $this->assertDatabaseHas('emergency_contacts', [
            'id' => $contact->id,
            'name' => 'New Hospital',
            'phone' => '108',
            'category' => 'ambulance',
            'is_active' => false,
        ]);
    }

    public function test_edit_page_renders()
    {
        $contact = Model::unguarded(fn () => EmergencyContact::create([
            'society_id' => $this->society->id,
            'name' => 'Test Contact',
            'phone' => '999',
            'category' => 'fire',
        ]));

        $this->get(route('emergency-contacts.edit', $contact))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('emergency-contacts/edit'));
    }

    public function test_can_delete_contact()
    {
        $contact = Model::unguarded(fn () => EmergencyContact::create([
            'society_id' => $this->society->id,
            'name' => 'To delete',
            'phone' => '000',
            'category' => 'other',
        ]));

        $this->delete(route('emergency-contacts.destroy', $contact))
            ->assertRedirect(route('emergency-contacts.index'));

        $this->assertDatabaseMissing('emergency_contacts', ['id' => $contact->id]);
    }
}