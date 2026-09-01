<?php

namespace Tests\Feature\Crud;

use App\Models\CommercialTenant;
use Inertia\Testing\AssertableInertia as Assert;

class CommercialTenantsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('commercial-tenants.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('commercial-tenants/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('commercial-tenants.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('commercial-tenants.store'), [])
            ->assertSessionHasErrors(['unit_number', 'unit_type', 'status']);
    }

    public function test_can_create_tenant()
    {
        $this->post(route('commercial-tenants.store'), [
            'company_name' => 'Acme Retail',
            'contact_name' => 'Rahul Sharma',
            'email' => 'rahul@acme.example',
            'phone' => '9876500000',
            'user_id' => $this->user->id,
            'unit_number' => 'CT-201',
            'unit_area' => 900,
            'rent_amount' => 35000,
            'security_deposit' => 70000,
            'unit_type' => 'retail',
            'status' => 'occupied',
        ])->assertRedirect(route('commercial-tenants.index'));

        $this->assertDatabaseHas('commercial_tenants', [
            'company_name' => 'Acme Retail',
            'unit_number' => 'CT-201',
            'user_id' => $this->user->id,
            'unit_type' => 'retail',
            'status' => 'occupied',
            'rent_amount' => 35000,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_tenant()
    {
        $tenant = CommercialTenant::create([
            'society_id' => $this->society->id,
            'unit_number' => 'CT-OLD',
            'unit_type' => 'office',
            'status' => 'vacant',
        ]);

        $this->put(route('commercial-tenants.update', $tenant), [
            'company_name' => 'Beta Logistics',
            'contact_name' => 'Sana Khan',
            'email' => 'sana@beta.example',
            'phone' => '9876511111',
            'unit_number' => 'CT-202',
            'unit_area' => 1500,
            'rent_amount' => 60000,
            'security_deposit' => 120000,
            'unit_type' => 'warehouse',
            'status' => 'occupied',
        ])->assertRedirect(route('commercial-tenants.index'));

        $this->assertDatabaseHas('commercial_tenants', [
            'id' => $tenant->id,
            'company_name' => 'Beta Logistics',
            'unit_type' => 'warehouse',
            'status' => 'occupied',
            'rent_amount' => 60000,
        ]);
    }

    public function test_can_delete_tenant()
    {
        $tenant = CommercialTenant::create([
            'society_id' => $this->society->id,
            'unit_number' => 'CT-X',
            'unit_type' => 'other',
            'status' => 'vacant',
        ]);

        $this->delete(route('commercial-tenants.destroy', $tenant))
            ->assertRedirect(route('commercial-tenants.index'));

        $this->assertDatabaseMissing('commercial_tenants', ['id' => $tenant->id]);
    }
}