<?php

namespace Tests\Feature\Crud;

use App\Models\AssetManagement;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class WorkOrdersCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('work-orders.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('work-orders/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('work-orders.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('work-orders/create'));
    }

    public function test_can_create_work_order()
    {
        $this->post(route('work-orders.store'), [
            'title' => 'Replace CCTV battery',
            'priority' => 'high',
            'status' => 'open',
        ])->assertRedirect(route('work-orders.index'));

        $this->assertDatabaseHas('work_orders', [
            'title' => 'Replace CCTV battery',
            'priority' => 'high',
            'status' => 'open',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_work_order()
    {
        $workOrder = Model::unguarded(fn () => \App\Models\WorkOrder::create([
            'society_id' => $this->society->id,
            'title' => 'Fix generator',
            'priority' => 'medium',
            'status' => 'open',
            'created_by' => $this->user->id,
        ]));

        $this->put(route('work-orders.update', $workOrder), [
            'title' => 'Fix generator - updated',
            'description' => 'Battery replaced',
            'priority' => 'medium',
            'status' => 'in_progress',
            'resolution_notes' => 'Awaiting parts',
        ])->assertRedirect(route('work-orders.index'));

        $this->assertDatabaseHas('work_orders', [
            'id' => $workOrder->id,
            'title' => 'Fix generator - updated',
            'status' => 'in_progress',
        ]);
    }

    public function test_edit_page_renders()
    {
        $workOrder = Model::unguarded(fn () => \App\Models\WorkOrder::create([
            'society_id' => $this->society->id,
            'title' => 'Test work order',
            'priority' => 'low',
            'status' => 'open',
            'created_by' => $this->user->id,
        ]));

        $this->get(route('work-orders.edit', $workOrder))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('work-orders/edit'));
    }

    public function test_can_delete_work_order()
    {
        $workOrder = Model::unguarded(fn () => \App\Models\WorkOrder::create([
            'society_id' => $this->society->id,
            'title' => 'To delete',
            'priority' => 'low',
            'status' => 'open',
            'created_by' => $this->user->id,
        ]));

        $this->delete(route('work-orders.destroy', $workOrder))
            ->assertRedirect(route('work-orders.index'));

        $this->assertDatabaseMissing('work_orders', ['id' => $workOrder->id]);
    }
}