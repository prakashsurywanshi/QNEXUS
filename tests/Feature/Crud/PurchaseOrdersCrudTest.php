<?php

namespace Tests\Feature\Crud;

use App\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class PurchaseOrdersCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('purchase-orders.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/purchase-orders/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('purchase-orders.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/purchase-orders/create'));
    }

    public function test_can_create_purchase_order()
    {
        $this->post(route('purchase-orders.store'), [
            'po_number' => 'PO-0001',
            'po_date' => now()->format('Y-m-d'),
            'total_amount' => 1000,
            'tax_amount' => 180,
            'grand_total' => 1180,
            'status' => 'draft',
            'items' => [
                ['item_name' => 'Cement', 'quantity' => 10, 'unit' => 'bags', 'unit_price' => 100],
            ],
        ])->assertRedirect(route('purchase-orders.index'));

        $this->assertDatabaseHas('purchase_orders', [
            'po_number' => 'PO-0001',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_purchase_order()
    {
        $po = Model::unguarded(fn () => PurchaseOrder::create([
            'society_id' => $this->society->id,
            'po_number' => 'PO-0001',
            'po_date' => now()->format('Y-m-d'),
            'total_amount' => 100,
            'grand_total' => 118,
            'status' => 'draft',
            'created_by' => $this->user->id,
        ]));

        $this->put(route('purchase-orders.update', $po), [
            'po_number' => 'PO-0002',
            'po_date' => now()->format('Y-m-d'),
            'total_amount' => 500,
            'grand_total' => 590,
            'status' => 'approved',
            'items' => [
                ['item_name' => 'Paint', 'quantity' => 5, 'unit' => 'cans', 'unit_price' => 100],
            ],
        ])->assertRedirect(route('purchase-orders.index'));

        $this->assertDatabaseHas('purchase_orders', [
            'id' => $po->id,
            'po_number' => 'PO-0002',
            'status' => 'approved',
        ]);
    }

    public function test_edit_page_renders()
    {
        $po = Model::unguarded(fn () => PurchaseOrder::create([
            'society_id' => $this->society->id,
            'po_number' => 'PO-0001',
            'po_date' => now()->format('Y-m-d'),
            'total_amount' => 100,
            'grand_total' => 118,
            'status' => 'draft',
            'created_by' => $this->user->id,
        ]));

        $this->get(route('purchase-orders.edit', $po))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/purchase-orders/edit'));
    }

    public function test_can_delete_purchase_order()
    {
        $po = Model::unguarded(fn () => PurchaseOrder::create([
            'society_id' => $this->society->id,
            'po_number' => 'PO-0001',
            'po_date' => now()->format('Y-m-d'),
            'total_amount' => 100,
            'grand_total' => 118,
            'status' => 'draft',
            'created_by' => $this->user->id,
        ]));

        $this->delete(route('purchase-orders.destroy', $po))
            ->assertRedirect(route('purchase-orders.index'));

        $this->assertDatabaseMissing('purchase_orders', ['id' => $po->id]);
    }
}
