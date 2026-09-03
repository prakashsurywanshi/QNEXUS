<?php

namespace Tests\Feature\Crud;

use App\Models\VendorPayment;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class VendorPaymentsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('vendor-payments.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/vendor-payments/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('vendor-payments.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/vendor-payments/create'));
    }

    public function test_can_create_payment()
    {
        $vendor = $this->createVendor();

        $this->post(route('vendor-payments.store'), [
            'vendor_id' => $vendor->id,
            'amount' => 5000,
            'payment_date' => now()->format('Y-m-d'),
            'payment_method' => 'bank_transfer',
            'net_amount' => 5000,
            'status' => 'completed',
        ])->assertRedirect(route('vendor-payments.index'));

        $this->assertDatabaseHas('vendor_payments', [
            'vendor_id' => $vendor->id,
            'amount' => 5000,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_payment()
    {
        $vendor = $this->createVendor();
        $payment = Model::unguarded(fn () => VendorPayment::create([
            'society_id' => $this->society->id,
            'vendor_id' => $vendor->id,
            'amount' => 1000,
            'payment_date' => now()->format('Y-m-d'),
            'payment_method' => 'cash',
            'net_amount' => 1000,
            'status' => 'pending',
        ]));

        $this->put(route('vendor-payments.update', $payment), [
            'vendor_id' => $vendor->id,
            'amount' => 2500,
            'payment_date' => now()->format('Y-m-d'),
            'payment_method' => 'upi',
            'net_amount' => 2500,
            'status' => 'completed',
        ])->assertRedirect(route('vendor-payments.index'));

        $this->assertDatabaseHas('vendor_payments', [
            'id' => $payment->id,
            'amount' => 2500,
            'status' => 'completed',
        ]);
    }

    public function test_edit_page_renders()
    {
        $vendor = $this->createVendor();
        $payment = Model::unguarded(fn () => VendorPayment::create([
            'society_id' => $this->society->id,
            'vendor_id' => $vendor->id,
            'amount' => 1000,
            'payment_date' => now()->format('Y-m-d'),
            'payment_method' => 'cash',
            'net_amount' => 1000,
            'status' => 'pending',
        ]));

        $this->get(route('vendor-payments.edit', $payment))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/vendor-payments/edit'));
    }

    public function test_can_delete_payment()
    {
        $vendor = $this->createVendor();
        $payment = Model::unguarded(fn () => VendorPayment::create([
            'society_id' => $this->society->id,
            'vendor_id' => $vendor->id,
            'amount' => 1000,
            'payment_date' => now()->format('Y-m-d'),
            'payment_method' => 'cash',
            'net_amount' => 1000,
            'status' => 'pending',
        ]));

        $this->delete(route('vendor-payments.destroy', $payment))
            ->assertRedirect(route('vendor-payments.index'));

        $this->assertDatabaseMissing('vendor_payments', ['id' => $payment->id]);
    }
}
