<?php

namespace Tests\Feature\Crud;

use App\Models\Gatepass;
use Inertia\Testing\AssertableInertia as Assert;

class GatepassesCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('gatepasses.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('gatepasses/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('gatepasses.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('gatepasses.store'), [
            'gatepass_type' => 'in',
            'status' => 'pending',
        ])->assertSessionHasErrors('item_description');
    }

    public function test_can_create_gatepass()
    {
        $this->post(route('gatepasses.store'), [
            'item_description' => 'Furniture delivery',
            'quantity' => 2,
            'gatepass_type' => 'in',
            'vehicle_number' => 'MH01AB1234',
            'driver_name' => 'Santosh',
            'driver_phone' => '9000000000',
            'status' => 'approved',
        ])->assertRedirect(route('gatepasses.index'));

        $this->assertDatabaseHas('gatepasses', [
            'item_description' => 'Furniture delivery',
            'gatepass_type' => 'in',
            'status' => 'approved',
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_can_update_gatepass()
    {
        $gatepass = Gatepass::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'item_description' => 'Groceries',
            'gatepass_type' => 'in',
            'status' => 'pending',
        ]);

        $this->put(route('gatepasses.update', $gatepass), [
            'item_description' => 'Groceries (revised)',
            'gatepass_type' => 'in',
            'status' => 'completed',
        ])->assertRedirect(route('gatepasses.index'));

        $this->assertDatabaseHas('gatepasses', [
            'id' => $gatepass->id,
            'item_description' => 'Groceries (revised)',
            'status' => 'completed',
        ]);
    }

    public function test_can_delete_gatepass()
    {
        $gatepass = Gatepass::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'item_description' => 'Disposable',
            'gatepass_type' => 'out',
            'status' => 'pending',
        ]);

        $this->delete(route('gatepasses.destroy', $gatepass))
            ->assertRedirect(route('gatepasses.index'));

        $this->assertDatabaseMissing('gatepasses', ['id' => $gatepass->id]);
    }
}