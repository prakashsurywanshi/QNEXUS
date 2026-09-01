<?php

namespace Tests\Feature\Crud;

use App\Models\PatrolCheckpoint;
use Inertia\Testing\AssertableInertia as Assert;

class PatrolCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('patrol.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('patrol/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('patrol.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('patrol.store'), [
            'is_active' => true,
        ])->assertSessionHasErrors('name');
    }

    public function test_can_create_checkpoint()
    {
        $this->post(route('patrol.store'), [
            'name' => 'Main Gate Checkpoint',
            'location_description' => 'Near the entrance gate',
            'latitude' => 19.0760,
            'longitude' => 72.8777,
            'sort_order' => 1,
            'is_active' => true,
        ])->assertRedirect(route('patrol.index'));

        $this->assertDatabaseHas('patrol_checkpoints', [
            'name' => 'Main Gate Checkpoint',
            'location_description' => 'Near the entrance gate',
            'latitude' => 19.076,
            'longitude' => 72.8777,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_checkpoint()
    {
        $checkpoint = PatrolCheckpoint::create([
            'society_id' => $this->society->id,
            'name' => 'Old Checkpoint',
            'is_active' => true,
        ]);

        $this->put(route('patrol.update', $checkpoint), [
            'name' => 'New Checkpoint',
            'location_description' => 'All-weather shelter',
            'sort_order' => 3,
            'is_active' => false,
        ])->assertRedirect(route('patrol.index'));

        $this->assertDatabaseHas('patrol_checkpoints', [
            'id' => $checkpoint->id,
            'name' => 'New Checkpoint',
            'is_active' => 0,
            'sort_order' => 3,
        ]);
    }

    public function test_can_delete_checkpoint()
    {
        $checkpoint = PatrolCheckpoint::create([
            'society_id' => $this->society->id,
            'name' => 'Disposable Checkpoint',
            'is_active' => true,
        ]);

        $this->delete(route('patrol.destroy', $checkpoint))
            ->assertRedirect(route('patrol.index'));

        $this->assertDatabaseMissing('patrol_checkpoints', ['id' => $checkpoint->id]);
    }
}