<?php

namespace Tests\Feature\Crud;

use App\Models\GeneralLedger;
use Inertia\Testing\AssertableInertia as Assert;

class LedgerCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('ledger.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('ledger/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('ledger.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('ledger.store'), [
            'date' => '2026-09-01',
        ])->assertSessionHasErrors(['account_id', 'description']);
    }

    public function test_can_create_ledger_entry()
    {
        $account = $this->createChartOfAccount();

        $this->post(route('ledger.store'), [
            'account_id' => $account->id,
            'date' => '2026-09-01',
            'description' => 'Maintenance collection',
            'debit' => 15000,
            'credit' => 0,
        ])->assertRedirect(route('ledger.index'));

        $this->assertDatabaseHas('general_ledger', [
            'account_id' => $account->id,
            'description' => 'Maintenance collection',
            'debit' => 15000,
            'credit' => 0,
            'society_id' => $this->society->id,
            'created_by' => $this->user->id,
        ]);
    }

    public function test_can_update_ledger_entry()
    {
        $account = $this->createChartOfAccount();

        $entry = GeneralLedger::create([
            'society_id' => $this->society->id,
            'account_id' => $account->id,
            'date' => '2026-09-01',
            'description' => 'Original entry',
            'debit' => 100,
            'credit' => 0,
            'created_by' => $this->user->id,
        ]);

        $this->put(route('ledger.update', $entry), [
            'account_id' => $account->id,
            'date' => '2026-09-02',
            'description' => 'Revised entry',
            'debit' => 200,
            'credit' => 50,
        ])->assertRedirect(route('ledger.index'));

        $this->assertDatabaseHas('general_ledger', [
            'id' => $entry->id,
            'description' => 'Revised entry',
            'debit' => 200,
            'credit' => 50,
        ]);
    }

    public function test_can_delete_ledger_entry()
    {
        $account = $this->createChartOfAccount();

        $entry = GeneralLedger::create([
            'society_id' => $this->society->id,
            'account_id' => $account->id,
            'date' => '2026-09-01',
            'description' => 'Disposable entry',
            'debit' => 100,
            'credit' => 0,
            'created_by' => $this->user->id,
        ]);

        $this->delete(route('ledger.destroy', $entry))
            ->assertRedirect(route('ledger.index'));

        $this->assertDatabaseMissing('general_ledger', ['id' => $entry->id]);
    }
}