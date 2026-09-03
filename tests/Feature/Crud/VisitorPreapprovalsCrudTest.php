<?php

namespace Tests\Feature\Crud;

use App\Models\VisitorPreapproval;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class VisitorPreapprovalsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('visitor-preapprovals.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('visitor-preapprovals/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('visitor-preapprovals.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('visitor-preapprovals/create'));
    }

    public function test_can_create_preapproval()
    {
        $this->post(route('visitor-preapprovals.store'), [
            'visitor_name' => 'John Doe',
            'visitor_phone' => '9876543210',
            'status' => 'pending',
            'entry_type' => 'visitor',
            'purpose' => 'Meeting resident',
        ])->assertRedirect(route('visitor-preapprovals.index'));

        $this->assertDatabaseHas('visitor_preapprovals', [
            'visitor_name' => 'John Doe',
            'visitor_phone' => '9876543210',
            'status' => 'pending',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_preapproval()
    {
        $preapproval = Model::unguarded(fn () => VisitorPreapproval::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'visitor_name' => 'Old Visitor',
            'visitor_phone' => '1111111111',
            'status' => 'pending',
        ]));

        $this->put(route('visitor-preapprovals.update', $preapproval), [
            'visitor_name' => 'New Visitor',
            'visitor_phone' => '2222222222',
            'status' => 'approved',
        ])->assertRedirect(route('visitor-preapprovals.index'));

        $this->assertDatabaseHas('visitor_preapprovals', [
            'id' => $preapproval->id,
            'visitor_name' => 'New Visitor',
            'status' => 'approved',
        ]);
    }

    public function test_edit_page_renders()
    {
        $preapproval = Model::unguarded(fn () => VisitorPreapproval::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'visitor_name' => 'Test Visitor',
            'visitor_phone' => '3333333333',
            'status' => 'pending',
        ]));

        $this->get(route('visitor-preapprovals.edit', $preapproval))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('visitor-preapprovals/edit'));
    }

    public function test_can_delete_preapproval()
    {
        $preapproval = Model::unguarded(fn () => VisitorPreapproval::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'visitor_name' => 'To delete',
            'visitor_phone' => '4444444444',
            'status' => 'pending',
        ]));

        $this->delete(route('visitor-preapprovals.destroy', $preapproval))
            ->assertRedirect(route('visitor-preapprovals.index'));

        $this->assertDatabaseMissing('visitor_preapprovals', ['id' => $preapproval->id]);
    }
}
