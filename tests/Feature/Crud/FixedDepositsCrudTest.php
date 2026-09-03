<?php

namespace Tests\Feature\Crud;

use App\Models\FixedDeposit;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class FixedDepositsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('fixed-deposits.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('finance/fixed-deposits/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('fixed-deposits.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('finance/fixed-deposits/create'));
    }

    public function test_can_create_deposit()
    {
        $this->post(route('fixed-deposits.store'), [
            'bank_name' => 'HDFC Bank',
            'fd_number' => 'FD-0001',
            'amount' => 100000,
            'interest_rate' => 7.5,
            'start_date' => now()->format('Y-m-d'),
            'maturity_date' => now()->addYear()->format('Y-m-d'),
            'status' => 'active',
        ])->assertRedirect(route('fixed-deposits.index'));

        $this->assertDatabaseHas('fixed_deposits', [
            'fd_number' => 'FD-0001',
            'bank_name' => 'HDFC Bank',
            'amount' => 100000,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_deposit()
    {
        $deposit = Model::unguarded(fn () => FixedDeposit::create([
            'society_id' => $this->society->id,
            'bank_name' => 'ICICI',
            'fd_number' => 'FD-0001',
            'amount' => 50000,
            'interest_rate' => 6,
            'start_date' => now()->format('Y-m-d'),
            'maturity_date' => now()->addYear()->format('Y-m-d'),
            'status' => 'active',
        ]));

        $this->put(route('fixed-deposits.update', $deposit), [
            'bank_name' => 'HDFC',
            'fd_number' => 'FD-0002',
            'amount' => 75000,
            'interest_rate' => 7,
            'start_date' => now()->format('Y-m-d'),
            'maturity_date' => now()->addYear()->format('Y-m-d'),
            'status' => 'matured',
        ])->assertRedirect(route('fixed-deposits.index'));

        $this->assertDatabaseHas('fixed_deposits', [
            'id' => $deposit->id,
            'fd_number' => 'FD-0002',
            'status' => 'matured',
        ]);
    }

    public function test_edit_page_renders()
    {
        $deposit = Model::unguarded(fn () => FixedDeposit::create([
            'society_id' => $this->society->id,
            'bank_name' => 'ICICI',
            'fd_number' => 'FD-0001',
            'amount' => 50000,
            'interest_rate' => 6,
            'start_date' => now()->format('Y-m-d'),
            'maturity_date' => now()->addYear()->format('Y-m-d'),
            'status' => 'active',
        ]));

        $this->get(route('fixed-deposits.edit', $deposit))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('finance/fixed-deposits/edit'));
    }

    public function test_can_delete_deposit()
    {
        $deposit = Model::unguarded(fn () => FixedDeposit::create([
            'society_id' => $this->society->id,
            'bank_name' => 'ICICI',
            'fd_number' => 'FD-0001',
            'amount' => 50000,
            'interest_rate' => 6,
            'start_date' => now()->format('Y-m-d'),
            'maturity_date' => now()->addYear()->format('Y-m-d'),
            'status' => 'active',
        ]));

        $this->delete(route('fixed-deposits.destroy', $deposit))
            ->assertRedirect(route('fixed-deposits.index'));

        $this->assertDatabaseMissing('fixed_deposits', ['id' => $deposit->id]);
    }
}
