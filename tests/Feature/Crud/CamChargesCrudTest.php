<?php

namespace Tests\Feature\Crud;

use App\Models\CamCharge;
use Inertia\Testing\AssertableInertia as Assert;

class CamChargesCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('cam-charges.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('cam-charges/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('cam-charges.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('cam-charges.store'), [])
            ->assertSessionHasErrors(['fiscal_year', 'status']);
    }

    public function test_can_create_cam_charge()
    {
        $this->post(route('cam-charges.store'), [
            'fiscal_year' => '2026-2027',
            'total_budget' => 500000,
            'total_area' => 12000,
            'rate_per_sqft' => 41.6667,
            'status' => 'active',
            'notes' => 'Annual maintenance budget',
        ])->assertRedirect(route('cam-charges.index'));

        $this->assertDatabaseHas('cam_charges', [
            'fiscal_year' => '2026-2027',
            'total_budget' => 500000,
            'rate_per_sqft' => 41.6667,
            'status' => 'active',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_cam_charge()
    {
        $camCharge = CamCharge::create([
            'society_id' => $this->society->id,
            'fiscal_year' => '2025-2026',
            'status' => 'draft',
        ]);

        $this->put(route('cam-charges.update', $camCharge), [
            'fiscal_year' => '2026-2027',
            'total_budget' => 600000,
            'total_area' => 12000,
            'rate_per_sqft' => 50,
            'status' => 'active',
        ])->assertRedirect(route('cam-charges.index'));

        $this->assertDatabaseHas('cam_charges', [
            'id' => $camCharge->id,
            'fiscal_year' => '2026-2027',
            'total_budget' => 600000,
            'rate_per_sqft' => 50,
            'status' => 'active',
        ]);
    }

    public function test_can_delete_cam_charge()
    {
        $camCharge = CamCharge::create([
            'society_id' => $this->society->id,
            'fiscal_year' => '2024-2025',
            'status' => 'closed',
        ]);

        $this->delete(route('cam-charges.destroy', $camCharge))
            ->assertRedirect(route('cam-charges.index'));

        $this->assertDatabaseMissing('cam_charges', ['id' => $camCharge->id]);
    }
}