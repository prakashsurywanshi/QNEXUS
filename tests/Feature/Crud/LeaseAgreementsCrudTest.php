<?php

namespace Tests\Feature\Crud;

use App\Models\CommercialTenant;
use App\Models\LeaseAgreement;
use Inertia\Testing\AssertableInertia as Assert;

class LeaseAgreementsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('lease-agreements.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('lease-agreements/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('lease-agreements.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('lease-agreements.store'), [
            'lease_number' => 'LS-001',
        ])->assertSessionHasErrors(['commercial_tenant_id', 'start_date', 'end_date', 'monthly_rent']);
    }

    public function test_can_create_lease()
    {
        $tenant = CommercialTenant::create([
            'society_id' => $this->society->id,
            'unit_number' => 'C-301',
            'status' => 'occupied',
        ]);

        $this->post(route('lease-agreements.store'), [
            'commercial_tenant_id' => $tenant->id,
            'user_id' => $this->user->id,
            'lease_number' => 'LS-2026-001',
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'monthly_rent' => 42000,
            'security_deposit' => 84000,
            'cam_charges' => 3000,
            'rent_escalation_type' => 'percentage',
            'escalation_value' => 10,
            'escalation_frequency_months' => 12,
            'status' => 'active',
            'notes' => 'Two-year renewal',
        ])->assertRedirect(route('lease-agreements.index'));

        $this->assertDatabaseHas('lease_agreements', [
            'lease_number' => 'LS-2026-001',
            'commercial_tenant_id' => $tenant->id,
            'user_id' => $this->user->id,
            'monthly_rent' => 42000,
            'rent_escalation_type' => 'percentage',
            'status' => 'active',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_lease()
    {
        $lease = $this->createLeaseAgreement();

        $this->put(route('lease-agreements.update', $lease), [
            'commercial_tenant_id' => $lease->commercial_tenant_id,
            'lease_number' => 'LS-2026-002',
            'start_date' => '2026-01-01',
            'end_date' => '2027-01-01',
            'monthly_rent' => 46000,
            'security_deposit' => 92000,
            'cam_charges' => 3500,
            'rent_escalation_type' => 'fixed',
            'escalation_value' => 500,
            'escalation_frequency_months' => 12,
            'status' => 'expired',
        ])->assertRedirect(route('lease-agreements.index'));

        $this->assertDatabaseHas('lease_agreements', [
            'id' => $lease->id,
            'lease_number' => 'LS-2026-002',
            'monthly_rent' => 46000,
            'rent_escalation_type' => 'fixed',
            'status' => 'expired',
        ]);
    }

    public function test_can_delete_lease()
    {
        $lease = $this->createLeaseAgreement();

        $this->delete(route('lease-agreements.destroy', $lease))
            ->assertRedirect(route('lease-agreements.index'));

        $this->assertDatabaseMissing('lease_agreements', ['id' => $lease->id]);
    }
}