<?php

namespace Tests\Feature\Crud;

use App\Models\RentInvoice;
use Inertia\Testing\AssertableInertia as Assert;

class InvoicesCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('invoices.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('invoices/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('invoices.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('invoices.store'), [
            'invoice_number' => 'INV-001',
        ])->assertSessionHasErrors(['lease_agreement_id', 'billing_period', 'due_date']);
    }

    public function test_can_create_invoice_with_computed_total()
    {
        $lease = $this->createLeaseAgreement();

        $this->post(route('invoices.store'), [
            'lease_agreement_id' => $lease->id,
            'invoice_number' => 'INV-2026-001',
            'billing_period' => 'September 2026',
            'rent_amount' => 25000,
            'cam_charges' => 2000,
            'other_charges' => 500,
            'tax_amount' => 2750,
            'paid_amount' => 10000,
            'status' => 'partial',
            'due_date' => '2026-09-10',
        ])->assertRedirect(route('invoices.index'));

        $this->assertDatabaseHas('rent_invoices', [
            'invoice_number' => 'INV-2026-001',
            'lease_agreement_id' => $lease->id,
            'status' => 'partial',
            'total_amount' => 30250,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_invoice()
    {
        $lease = $this->createLeaseAgreement();

        $invoice = RentInvoice::create([
            'society_id' => $this->society->id,
            'lease_agreement_id' => $lease->id,
            'invoice_number' => 'INV-2026-001',
            'billing_period' => 'September 2026',
            'rent_amount' => 25000,
            'status' => 'pending',
            'due_date' => '2026-09-10',
        ]);

        $this->put(route('invoices.update', $invoice), [
            'lease_agreement_id' => $lease->id,
            'invoice_number' => 'INV-2026-001',
            'billing_period' => 'September 2026',
            'rent_amount' => 28000,
            'cam_charges' => 3000,
            'other_charges' => 0,
            'tax_amount' => 3100,
            'paid_amount' => 28000,
            'status' => 'paid',
            'due_date' => '2026-09-10',
        ])->assertRedirect(route('invoices.index'));

        $this->assertDatabaseHas('rent_invoices', [
            'id' => $invoice->id,
            'status' => 'paid',
            'total_amount' => 34100,
            'paid_amount' => 28000,
        ]);
    }

    public function test_can_delete_invoice()
    {
        $lease = $this->createLeaseAgreement();

        $invoice = RentInvoice::create([
            'society_id' => $this->society->id,
            'lease_agreement_id' => $lease->id,
            'invoice_number' => 'INV-X',
            'billing_period' => 'August 2026',
            'rent_amount' => 10000,
            'status' => 'pending',
            'due_date' => '2026-08-10',
        ]);

        $this->delete(route('invoices.destroy', $invoice))
            ->assertRedirect(route('invoices.index'));

        $this->assertDatabaseMissing('rent_invoices', ['id' => $invoice->id]);
    }
}