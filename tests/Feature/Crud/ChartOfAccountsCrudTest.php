<?php

namespace Tests\Feature\Crud;

use Inertia\Testing\AssertableInertia as Assert;

class ChartOfAccountsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('chart-of-accounts.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/chart-of-accounts/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('chart-of-accounts.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/chart-of-accounts/create'));
    }

    public function test_can_create_account()
    {
        $this->post(route('chart-of-accounts.store'), [
            'account_code' => 'AC-1001',
            'account_name' => 'Electricity Expenses',
            'account_type' => 'expense',
            'is_active' => true,
        ])->assertRedirect(route('chart-of-accounts.index'));

        $this->assertDatabaseHas('chart_of_accounts', [
            'account_code' => 'AC-1001',
            'account_name' => 'Electricity Expenses',
            'account_type' => 'expense',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_account()
    {
        $account = $this->createChartOfAccount();

        $this->put(route('chart-of-accounts.update', $account), [
            'account_code' => 'AC-2002',
            'account_name' => 'Updated Account',
            'account_type' => 'income',
            'is_active' => true,
        ])->assertRedirect(route('chart-of-accounts.index'));

        $this->assertDatabaseHas('chart_of_accounts', [
            'id' => $account->id,
            'account_name' => 'Updated Account',
            'account_type' => 'income',
        ]);
    }

    public function test_edit_page_renders()
    {
        $account = $this->createChartOfAccount();

        $this->get(route('chart-of-accounts.edit', $account))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/chart-of-accounts/edit'));
    }

    public function test_can_delete_account()
    {
        $account = $this->createChartOfAccount();

        $this->delete(route('chart-of-accounts.destroy', $account))
            ->assertRedirect(route('chart-of-accounts.index'));

        $this->assertDatabaseMissing('chart_of_accounts', ['id' => $account->id]);
    }
}
