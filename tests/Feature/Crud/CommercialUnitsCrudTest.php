<?php

namespace Tests\Feature\Crud;

use App\Models\CommercialTenant;
use App\Models\CommercialUnit;
use Inertia\Testing\AssertableInertia as Assert;

class CommercialUnitsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('commercial-units.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('commercial-units/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('commercial-units.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('commercial-units.store'), [])
            ->assertSessionHasErrors(['unit_number', 'unit_type', 'status']);
    }

    public function test_can_create_unit()
    {
        $tenant = CommercialTenant::create([
            'society_id' => $this->society->id,
            'unit_number' => 'C-101',
            'status' => 'occupied',
        ]);

        $this->post(route('commercial-units.store'), [
            'commercial_tenant_id' => $tenant->id,
            'unit_number' => 'CU-101',
            'floor' => '1',
            'area_sqft' => 1200,
            'unit_type' => 'office',
            'status' => 'occupied',
            'monthly_rent' => 45000,
            'notes' => 'Corner office',
        ])->assertRedirect(route('commercial-units.index'));

        $this->assertDatabaseHas('commercial_units', [
            'unit_number' => 'CU-101',
            'commercial_tenant_id' => $tenant->id,
            'unit_type' => 'office',
            'status' => 'occupied',
            'monthly_rent' => 45000,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_unit()
    {
        $unit = CommercialUnit::create([
            'society_id' => $this->society->id,
            'unit_number' => 'CU-OLD',
            'unit_type' => 'office',
            'status' => 'vacant',
        ]);

        $this->put(route('commercial-units.update', $unit), [
            'unit_number' => 'CU-NEW',
            'unit_type' => 'retail',
            'status' => 'under_maintenance',
            'monthly_rent' => 50000,
        ])->assertRedirect(route('commercial-units.index'));

        $this->assertDatabaseHas('commercial_units', [
            'id' => $unit->id,
            'unit_number' => 'CU-NEW',
            'unit_type' => 'retail',
            'status' => 'under_maintenance',
            'monthly_rent' => 50000,
        ]);
    }

    public function test_can_delete_unit()
    {
        $unit = CommercialUnit::create([
            'society_id' => $this->society->id,
            'unit_number' => 'CU-X',
            'unit_type' => 'warehouse',
            'status' => 'vacant',
        ]);

        $this->delete(route('commercial-units.destroy', $unit))
            ->assertRedirect(route('commercial-units.index'));

        $this->assertDatabaseMissing('commercial_units', ['id' => $unit->id]);
    }
}