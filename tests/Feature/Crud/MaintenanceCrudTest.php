<?php

namespace Tests\Feature\Crud;

use App\Models\Maintenance;
use Inertia\Testing\AssertableInertia as Assert;

class MaintenanceCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('maintenance.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('maintenance/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('maintenance.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('maintenance.store'), [
            'set_value' => 10,
        ])->assertSessionHasErrors('cost_type');
    }

    public function test_can_create_maintenance_rule()
    {
        $this->post(route('maintenance.store'), [
            'cost_type' => 'fixedValue',
            'unit_name' => 'Standard maintenance',
            'set_value' => 1500,
        ])->assertRedirect(route('maintenance.index'));

        $this->assertDatabaseHas('maintenances', [
            'cost_type' => 'fixedValue',
            'unit_name' => 'Standard maintenance',
            'set_value' => 1500,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_maintenance_rule()
    {
        $maintenance = Maintenance::create([
            'society_id' => $this->society->id,
            'cost_type' => 'fixedValue',
            'unit_name' => 'Old rule',
            'set_value' => 1000,
        ]);

        $this->put(route('maintenance.update', $maintenance), [
            'cost_type' => 'unitType',
            'unit_name' => 'Per sqft',
            'set_value' => 2.5,
        ])->assertRedirect(route('maintenance.index'));

        $this->assertDatabaseHas('maintenances', [
            'id' => $maintenance->id,
            'cost_type' => 'unitType',
            'set_value' => 2.5,
        ]);
    }

    public function test_can_delete_maintenance_rule()
    {
        $maintenance = Maintenance::create([
            'society_id' => $this->society->id,
            'cost_type' => 'fixedValue',
            'unit_name' => 'Disposable',
            'set_value' => 100,
        ]);

        $this->delete(route('maintenance.destroy', $maintenance))
            ->assertRedirect(route('maintenance.index'));

        $this->assertDatabaseMissing('maintenances', ['id' => $maintenance->id]);
    }
}