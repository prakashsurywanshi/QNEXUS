<?php

namespace Tests\Feature\Crud;

use App\Models\AmcManagement;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class AmcCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('amc.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('amc/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('amc.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('amc/create'));
    }

    public function test_can_create_amc()
    {
        $this->post(route('amc.store'), [
            'service_name' => 'Lift Maintenance',
            'reference_no' => 'AMC-2026-001',
            'frequency' => 'yearly',
            'status' => 'active',
            'cost' => 25000,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
        ])->assertRedirect(route('amc.index'));

        $this->assertDatabaseHas('amc_managements', [
            'service_name' => 'Lift Maintenance',
            'frequency' => 'yearly',
            'status' => 'active',
            'cost' => 25000,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_amc()
    {
        $amc = Model::unguarded(fn () => AmcManagement::create([
            'society_id' => $this->society->id,
            'service_name' => 'Old Service',
            'frequency' => 'yearly',
            'status' => 'active',
        ]));

        $this->put(route('amc.update', $amc), [
            'service_name' => 'New Service',
            'frequency' => 'quarterly',
            'status' => 'expired',
            'cost' => 5000,
        ])->assertRedirect(route('amc.index'));

        $this->assertDatabaseHas('amc_managements', [
            'id' => $amc->id,
            'service_name' => 'New Service',
            'frequency' => 'quarterly',
            'status' => 'expired',
        ]);
    }

    public function test_edit_page_renders()
    {
        $amc = Model::unguarded(fn () => AmcManagement::create([
            'society_id' => $this->society->id,
            'service_name' => 'Test AMC',
            'frequency' => 'yearly',
            'status' => 'active',
        ]));

        $this->get(route('amc.edit', $amc))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('amc/edit'));
    }

    public function test_can_delete_amc()
    {
        $amc = Model::unguarded(fn () => AmcManagement::create([
            'society_id' => $this->society->id,
            'service_name' => 'To delete',
            'frequency' => 'yearly',
            'status' => 'active',
        ]));

        $this->delete(route('amc.destroy', $amc))
            ->assertRedirect(route('amc.index'));

        $this->assertDatabaseMissing('amc_managements', ['id' => $amc->id]);
    }
}