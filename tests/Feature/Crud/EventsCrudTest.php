<?php

namespace Tests\Feature\Crud;

use App\Models\Event;
use Inertia\Testing\AssertableInertia as Assert;

class EventsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('events.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('events/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('events.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('events.store'), [
            'start_date' => '2026-09-05',
        ])->assertSessionHasErrors('title');
    }

    public function test_can_create_event()
    {
        $this->post(route('events.store'), [
            'title' => 'Independence Day Celebration',
            'description' => 'Flag hoisting and cultural programme.',
            'location' => 'Community Hall',
            'start_date' => '2026-08-15',
            'end_date' => '2026-08-15',
            'start_time' => '09:00',
            'end_time' => '12:00',
            'is_recurring' => false,
            'status' => 'published',
        ])->assertRedirect(route('events.index'));

        $this->assertDatabaseHas('events', [
            'title' => 'Independence Day Celebration',
            'location' => 'Community Hall',
            'status' => 'published',
            'society_id' => $this->society->id,
            'created_by' => $this->user->id,
        ]);
    }

    public function test_can_update_event()
    {
        $event = Event::create([
            'society_id' => $this->society->id,
            'title' => 'Old Event',
            'description' => 'd',
            'location' => 'Hall A',
            'start_date' => '2026-08-15',
            'end_date' => '2026-08-15',
            'start_time' => '09:00',
            'end_time' => '10:00',
            'status' => 'draft',
            'created_by' => $this->user->id,
        ]);

        $this->put(route('events.update', $event), [
            'title' => 'New Event',
            'description' => 'Updated description',
            'location' => 'Hall B',
            'start_date' => '2026-09-01',
            'end_date' => '2026-09-02',
            'start_time' => '10:00',
            'end_time' => '13:00',
            'is_recurring' => false,
            'status' => 'cancelled',
        ])->assertRedirect(route('events.index'));

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'title' => 'New Event',
            'location' => 'Hall B',
            'status' => 'cancelled',
        ]);
    }

    public function test_can_delete_event()
    {
        $event = Event::create([
            'society_id' => $this->society->id,
            'title' => 'Disposable Event',
            'description' => 'd',
            'location' => 'Hall A',
            'start_date' => '2026-08-15',
            'end_date' => '2026-08-15',
            'start_time' => '09:00',
            'end_time' => '10:00',
            'status' => 'draft',
            'created_by' => $this->user->id,
        ]);

        $this->delete(route('events.destroy', $event))
            ->assertRedirect(route('events.index'));

        $this->assertDatabaseMissing('events', ['id' => $event->id]);
    }
}