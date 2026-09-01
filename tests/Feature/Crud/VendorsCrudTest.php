<?php

namespace Tests\Feature\Crud;

use App\Models\Vendor;
use Inertia\Testing\AssertableInertia as Assert;

class VendorsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('vendors.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('vendors/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('vendors.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('vendors.store'), [
            'status' => 'active',
        ])->assertSessionHasErrors('name');
    }

    public function test_can_create_vendor()
    {
        $this->post(route('vendors.store'), [
            'name' => 'ACME Supplies',
            'contact_person' => 'Ramesh',
            'phone' => '9880000000',
            'email' => 'acme@example.com',
            'category' => 'Furniture',
            'address' => 'Andheri East, Mumbai',
            'status' => 'active',
        ])->assertRedirect(route('vendors.index'));

        $this->assertDatabaseHas('vendors', [
            'name' => 'ACME Supplies',
            'category' => 'Furniture',
            'status' => 'active',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_vendor()
    {
        $vendor = Vendor::create([
            'society_id' => $this->society->id,
            'name' => 'Old Vendor',
            'status' => 'active',
        ]);

        $this->put(route('vendors.update', $vendor), [
            'name' => 'New Vendor',
            'contact_person' => 'Suresh',
            'email' => 'new@example.com',
            'status' => 'inactive',
        ])->assertRedirect(route('vendors.index'));

        $this->assertDatabaseHas('vendors', [
            'id' => $vendor->id,
            'name' => 'New Vendor',
            'status' => 'inactive',
        ]);
    }

    public function test_can_delete_vendor()
    {
        $vendor = Vendor::create([
            'society_id' => $this->society->id,
            'name' => 'Disposable Vendor',
            'status' => 'active',
        ]);

        $this->delete(route('vendors.destroy', $vendor))
            ->assertRedirect(route('vendors.index'));

        $this->assertDatabaseMissing('vendors', ['id' => $vendor->id]);
    }
}