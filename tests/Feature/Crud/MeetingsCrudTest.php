<?php

namespace Tests\Feature\Crud;

use App\Models\Meeting;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class MeetingsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('meetings.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('meetings/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('meetings.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('meetings/create'));
    }

    public function test_can_create_meeting()
    {
        $this->post(route('meetings.store'), [
            'title' => 'Annual General Meeting',
            'description' => 'Yearly review',
            'meeting_date' => now()->format('Y-m-d'),
            'meeting_time' => '18:00',
            'location' => 'Community Hall',
            'status' => 'scheduled',
        ])->assertRedirect(route('meetings.index'));

        $this->assertDatabaseHas('meetings', [
            'title' => 'Annual General Meeting',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_meeting()
    {
        $meeting = Model::unguarded(fn () => Meeting::create([
            'society_id' => $this->society->id,
            'title' => 'Old title',
            'meeting_date' => now()->format('Y-m-d'),
            'meeting_time' => '18:00',
            'location' => 'Hall',
            'organized_by' => $this->user->id,
            'status' => 'scheduled',
        ]));

        $this->put(route('meetings.update', $meeting), [
            'title' => 'New title',
            'meeting_date' => now()->format('Y-m-d'),
            'meeting_time' => '19:00',
            'location' => 'New Hall',
            'status' => 'completed',
        ])->assertRedirect(route('meetings.index'));

        $this->assertDatabaseHas('meetings', [
            'id' => $meeting->id,
            'title' => 'New title',
            'status' => 'completed',
        ]);
    }

    public function test_edit_page_renders()
    {
        $meeting = Model::unguarded(fn () => Meeting::create([
            'society_id' => $this->society->id,
            'title' => 'Test meeting',
            'meeting_date' => now()->format('Y-m-d'),
            'meeting_time' => '18:00',
            'location' => 'Hall',
            'organized_by' => $this->user->id,
            'status' => 'scheduled',
        ]));

        $this->get(route('meetings.edit', $meeting))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('meetings/edit'));
    }

    public function test_can_delete_meeting()
    {
        $meeting = Model::unguarded(fn () => Meeting::create([
            'society_id' => $this->society->id,
            'title' => 'To delete',
            'meeting_date' => now()->format('Y-m-d'),
            'meeting_time' => '18:00',
            'location' => 'Hall',
            'organized_by' => $this->user->id,
            'status' => 'scheduled',
        ]));

        $this->delete(route('meetings.destroy', $meeting))
            ->assertRedirect(route('meetings.index'));

        $this->assertDatabaseMissing('meetings', ['id' => $meeting->id]);
    }
}
