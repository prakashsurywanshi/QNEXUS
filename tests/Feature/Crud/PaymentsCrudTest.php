<?php

namespace Tests\Feature\Crud;

use App\Models\Payment;
use Inertia\Testing\AssertableInertia as Assert;

class PaymentsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('payments.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('payments/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('payments.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('payments.store'), [
            'payment_method' => 'cash',
        ])->assertSessionHasErrors('maintenance_apartment_id');
    }

    public function test_can_create_payment()
    {
        $maintenanceApartment = $this->createMaintenanceApartment();

        $this->post(route('payments.store'), [
            'maintenance_apartment_id' => $maintenanceApartment->id,
            'payment_method' => 'upi',
            'amount' => 1500,
            'balance' => 0,
            'transaction_id' => 'TXN-20260901',
        ])->assertRedirect(route('payments.index'));

        $this->assertDatabaseHas('payments', [
            'maintenance_apartment_id' => $maintenanceApartment->id,
            'payment_method' => 'upi',
            'amount' => 1500,
            'transaction_id' => 'TXN-20260901',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_payment()
    {
        $maintenanceApartment = $this->createMaintenanceApartment();

        $payment = Payment::create([
            'society_id' => $this->society->id,
            'maintenance_apartment_id' => $maintenanceApartment->id,
            'payment_method' => 'cash',
            'amount' => 500,
        ]);

        $this->put(route('payments.update', $payment), [
            'maintenance_apartment_id' => $maintenanceApartment->id,
            'payment_method' => 'card',
            'amount' => 2000,
            'balance' => 500,
            'transaction_id' => 'TXN-UPD-1',
        ])->assertRedirect(route('payments.index'));

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'payment_method' => 'card',
            'amount' => 2000,
        ]);
    }

    public function test_can_delete_payment()
    {
        $maintenanceApartment = $this->createMaintenanceApartment();

        $payment = Payment::create([
            'society_id' => $this->society->id,
            'maintenance_apartment_id' => $maintenanceApartment->id,
            'payment_method' => 'cash',
            'amount' => 100,
        ]);

        $this->delete(route('payments.destroy', $payment))
            ->assertRedirect(route('payments.index'));

        $this->assertDatabaseMissing('payments', ['id' => $payment->id]);
    }
}