<?php

namespace Tests\Feature\Crud;

use App\Models\JournalVoucher;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class JournalVouchersCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('journal-vouchers.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/journal-vouchers/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('journal-vouchers.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/journal-vouchers/create'));
    }

    public function test_can_create_voucher()
    {
        $account = $this->createChartOfAccount();

        $this->post(route('journal-vouchers.store'), [
            'voucher_number' => 'JV-0001',
            'date' => now()->format('Y-m-d'),
            'description' => 'Rent adjustment',
            'total_debit' => 1000,
            'total_credit' => 1000,
            'status' => 'approved',
            'lines' => [
                ['account_id' => $account->id, 'debit' => 1000, 'credit' => 0, 'description' => 'line'],
            ],
        ])->assertRedirect(route('journal-vouchers.index'));

        $this->assertDatabaseHas('journal_vouchers', [
            'voucher_number' => 'JV-0001',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_voucher()
    {
        $account = $this->createChartOfAccount();
        $voucher = Model::unguarded(fn () => JournalVoucher::create([
            'society_id' => $this->society->id,
            'voucher_number' => 'JV-0001',
            'date' => now()->format('Y-m-d'),
            'description' => 'Old desc',
            'total_debit' => 100,
            'total_credit' => 100,
            'status' => 'draft',
            'created_by' => $this->user->id,
        ]));

        $this->put(route('journal-vouchers.update', $voucher), [
            'voucher_number' => 'JV-0002',
            'date' => now()->format('Y-m-d'),
            'description' => 'Updated desc',
            'total_debit' => 200,
            'total_credit' => 200,
            'status' => 'approved',
            'lines' => [
                ['account_id' => $account->id, 'debit' => 200, 'credit' => 0, 'description' => 'new line'],
            ],
        ])->assertRedirect(route('journal-vouchers.index'));

        $this->assertDatabaseHas('journal_vouchers', [
            'id' => $voucher->id,
            'voucher_number' => 'JV-0002',
            'description' => 'Updated desc',
        ]);
    }

    public function test_edit_page_renders()
    {
        $voucher = Model::unguarded(fn () => JournalVoucher::create([
            'society_id' => $this->society->id,
            'voucher_number' => 'JV-0001',
            'date' => now()->format('Y-m-d'),
            'description' => 'Test',
            'total_debit' => 100,
            'total_credit' => 100,
            'status' => 'draft',
            'created_by' => $this->user->id,
        ]));

        $this->get(route('journal-vouchers.edit', $voucher))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/journal-vouchers/edit'));
    }

    public function test_can_delete_voucher()
    {
        $voucher = Model::unguarded(fn () => JournalVoucher::create([
            'society_id' => $this->society->id,
            'voucher_number' => 'JV-0001',
            'date' => now()->format('Y-m-d'),
            'description' => 'Test',
            'total_debit' => 100,
            'total_credit' => 100,
            'status' => 'draft',
            'created_by' => $this->user->id,
        ]));

        $this->delete(route('journal-vouchers.destroy', $voucher))
            ->assertRedirect(route('journal-vouchers.index'));

        $this->assertDatabaseMissing('journal_vouchers', ['id' => $voucher->id]);
    }
}
