<?php

namespace Tests\Feature\Crud;

use App\Models\VisitorManagement;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class VisitorsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('visitors.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('visitors/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('visitors.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('visitors.store'), [
            'status' => 'pending',
        ])->assertSessionHasErrors('visitor_name');
    }

    public function test_can_create_visitor()
    {
        $this->post(route('visitors.store'), [
            'visitor_name' => 'Amit Sharma',
            'phone_number' => '9123456780',
            'address' => 'Mumbai',
            'purpose_of_visit' => 'Meeting with owner',
            'date_of_visit' => '2026-09-05',
            'date_of_exit' => '2026-09-05',
            'in_time' => '10:00',
            'out_time' => '12:00',
            'status' => 'allowed',
        ])->assertRedirect(route('visitors.index'));

        $this->assertDatabaseHas('visitors_management', [
            'visitor_name' => 'Amit Sharma',
            'phone_number' => '9123456780',
            'status' => 'allowed',
            'society_id' => $this->society->id,
            'added_by' => $this->user->id,
        ]);
    }

    public function test_can_update_visitor()
    {
        $visitor = Model::unguarded(fn () => VisitorManagement::create([
            'society_id' => $this->society->id,
            'visitor_name' => 'Old Visitor',
            'status' => 'pending',
            'added_by' => $this->user->id,
        ]));

        $this->put(route('visitors.update', $visitor), [
            'visitor_name' => 'New Visitor',
            'status' => 'not_allowed',
        ])->assertRedirect(route('visitors.index'));

        $this->assertDatabaseHas('visitors_management', [
            'id' => $visitor->id,
            'visitor_name' => 'New Visitor',
            'status' => 'not_allowed',
        ]);
    }

    public function test_can_delete_visitor()
    {
        $visitor = Model::unguarded(fn () => VisitorManagement::create([
            'society_id' => $this->society->id,
            'visitor_name' => 'Disposable Visitor',
            'status' => 'pending',
            'added_by' => $this->user->id,
        ]));

        $this->delete(route('visitors.destroy', $visitor))
            ->assertRedirect(route('visitors.index'));

        $this->assertDatabaseMissing('visitors_management', ['id' => $visitor->id]);
    }
}