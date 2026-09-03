<?php

namespace Tests\Feature\Crud;

use App\Models\VendorContract;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class VendorContractsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('vendor-contracts.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/vendor-contracts/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('vendor-contracts.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/vendor-contracts/create'));
    }

    public function test_can_create_contract()
    {
        $vendor = $this->createVendor();

        $this->post(route('vendor-contracts.store'), [
            'vendor_id' => $vendor->id,
            'contract_number' => 'VC-0001',
            'title' => 'Security Services',
            'contract_value' => 50000,
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addYear()->format('Y-m-d'),
            'status' => 'active',
        ])->assertRedirect(route('vendor-contracts.index'));

        $this->assertDatabaseHas('vendor_contracts', [
            'contract_number' => 'VC-0001',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_contract()
    {
        $vendor = $this->createVendor();
        $contract = Model::unguarded(fn () => VendorContract::create([
            'society_id' => $this->society->id,
            'vendor_id' => $vendor->id,
            'contract_number' => 'VC-0001',
            'title' => 'Old title',
            'contract_value' => 10000,
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addYear()->format('Y-m-d'),
            'status' => 'draft',
        ]));

        $this->put(route('vendor-contracts.update', $contract), [
            'vendor_id' => $vendor->id,
            'contract_number' => 'VC-0002',
            'title' => 'Updated title',
            'contract_value' => 20000,
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addYear()->format('Y-m-d'),
            'status' => 'active',
        ])->assertRedirect(route('vendor-contracts.index'));

        $this->assertDatabaseHas('vendor_contracts', [
            'id' => $contract->id,
            'contract_number' => 'VC-0002',
            'status' => 'active',
        ]);
    }

    public function test_edit_page_renders()
    {
        $vendor = $this->createVendor();
        $contract = Model::unguarded(fn () => VendorContract::create([
            'society_id' => $this->society->id,
            'vendor_id' => $vendor->id,
            'contract_number' => 'VC-0001',
            'title' => 'Title',
            'contract_value' => 10000,
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addYear()->format('Y-m-d'),
            'status' => 'draft',
        ]));

        $this->get(route('vendor-contracts.edit', $contract))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/vendor-contracts/edit'));
    }

    public function test_can_delete_contract()
    {
        $vendor = $this->createVendor();
        $contract = Model::unguarded(fn () => VendorContract::create([
            'society_id' => $this->society->id,
            'vendor_id' => $vendor->id,
            'contract_number' => 'VC-0001',
            'title' => 'Title',
            'contract_value' => 10000,
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addYear()->format('Y-m-d'),
            'status' => 'draft',
        ]));

        $this->delete(route('vendor-contracts.destroy', $contract))
            ->assertRedirect(route('vendor-contracts.index'));

        $this->assertDatabaseMissing('vendor_contracts', ['id' => $contract->id]);
    }
}
