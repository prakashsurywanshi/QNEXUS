<?php

namespace Tests\Feature\Crud;

use App\Models\PurchaseInvoice;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class PurchaseInvoicesCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('purchase-invoices.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/purchase-invoices/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('purchase-invoices.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/purchase-invoices/create'));
    }

    public function test_can_create_invoice()
    {
        $this->post(route('purchase-invoices.store'), [
            'invoice_number' => 'PINV-0001',
            'invoice_date' => now()->format('Y-m-d'),
            'subtotal' => 1000,
            'tax_amount' => 180,
            'total_amount' => 1180,
            'status' => 'pending',
        ])->assertRedirect(route('purchase-invoices.index'));

        $this->assertDatabaseHas('purchase_invoices', [
            'invoice_number' => 'PINV-0001',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_invoice()
    {
        $invoice = Model::unguarded(fn () => PurchaseInvoice::create([
            'society_id' => $this->society->id,
            'invoice_number' => 'PINV-0001',
            'invoice_date' => now()->format('Y-m-d'),
            'subtotal' => 100,
            'total_amount' => 118,
            'status' => 'pending',
            'created_by' => $this->user->id,
        ]));

        $this->put(route('purchase-invoices.update', $invoice), [
            'invoice_number' => 'PINV-0002',
            'invoice_date' => now()->format('Y-m-d'),
            'subtotal' => 200,
            'total_amount' => 236,
            'status' => 'paid',
        ])->assertRedirect(route('purchase-invoices.index'));

        $this->assertDatabaseHas('purchase_invoices', [
            'id' => $invoice->id,
            'invoice_number' => 'PINV-0002',
            'status' => 'paid',
        ]);
    }

    public function test_edit_page_renders()
    {
        $invoice = Model::unguarded(fn () => PurchaseInvoice::create([
            'society_id' => $this->society->id,
            'invoice_number' => 'PINV-0001',
            'invoice_date' => now()->format('Y-m-d'),
            'subtotal' => 100,
            'total_amount' => 118,
            'status' => 'pending',
            'created_by' => $this->user->id,
        ]));

        $this->get(route('purchase-invoices.edit', $invoice))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/purchase-invoices/edit'));
    }

    public function test_can_delete_invoice()
    {
        $invoice = Model::unguarded(fn () => PurchaseInvoice::create([
            'society_id' => $this->society->id,
            'invoice_number' => 'PINV-0001',
            'invoice_date' => now()->format('Y-m-d'),
            'subtotal' => 100,
            'total_amount' => 118,
            'status' => 'pending',
            'created_by' => $this->user->id,
        ]));

        $this->delete(route('purchase-invoices.destroy', $invoice))
            ->assertRedirect(route('purchase-invoices.index'));

        $this->assertDatabaseMissing('purchase_invoices', ['id' => $invoice->id]);
    }
}
