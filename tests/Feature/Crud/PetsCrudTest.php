<?php

namespace Tests\Feature\Crud;

use App\Models\Pet;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class PetsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('pets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('pets/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('pets.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('pets/create'));
    }

    public function test_can_create_pet()
    {
        $this->post(route('pets.store'), [
            'user_id' => $this->user->id,
            'name' => 'Bruno',
            'species' => 'Dog',
            'breed' => 'Labrador',
            'vaccination_status' => 'up_to_date',
        ])->assertRedirect(route('pets.index'));

        $this->assertDatabaseHas('pets', [
            'name' => 'Bruno',
            'species' => 'Dog',
            'user_id' => $this->user->id,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_pet()
    {
        $pet = Model::unguarded(fn () => Pet::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'name' => 'Old',
            'species' => 'Cat',
            'vaccination_status' => 'unknown',
        ]));

        $this->put(route('pets.update', $pet), [
            'user_id' => $this->user->id,
            'name' => 'Milo',
            'species' => 'Cat',
            'breed' => 'Persian',
            'vaccination_status' => 'overdue',
        ])->assertRedirect(route('pets.index'));

        $this->assertDatabaseHas('pets', [
            'id' => $pet->id,
            'name' => 'Milo',
            'vaccination_status' => 'overdue',
        ]);
    }

    public function test_edit_page_renders()
    {
        $pet = Model::unguarded(fn () => Pet::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'name' => 'Test',
            'species' => 'Dog',
            'vaccination_status' => 'unknown',
        ]));

        $this->get(route('pets.edit', $pet))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('pets/edit'));
    }

    public function test_can_delete_pet()
    {
        $pet = Model::unguarded(fn () => Pet::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'name' => 'To delete',
            'species' => 'Dog',
            'vaccination_status' => 'unknown',
        ]));

        $this->delete(route('pets.destroy', $pet))
            ->assertRedirect(route('pets.index'));

        $this->assertDatabaseMissing('pets', ['id' => $pet->id]);
    }
}
