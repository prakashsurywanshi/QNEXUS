<?php

namespace Tests\Feature\Crud;

use App\Models\Budget;
use Inertia\Testing\AssertableInertia as Assert;

class BudgetsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('budgets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('budgets/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('budgets.create'))->assertOk();
    }

    public function test_store_validates_required_fields()
    {
        $this->post(route('budgets.store'), [
            'fiscal_year' => '2026-27',
        ])->assertSessionHasErrors('account_id');
    }

    public function test_can_create_budget()
    {
        $account = $this->createChartOfAccount();

        $this->post(route('budgets.store'), [
            'fiscal_year' => '2026-27',
            'account_id' => $account->id,
            'budgeted_amount' => 5000000,
            'actual_amount' => 3000000,
        ])->assertRedirect(route('budgets.index'));

        $this->assertDatabaseHas('budgets', [
            'fiscal_year' => '2026-27',
            'account_id' => $account->id,
            'budgeted_amount' => 5000000,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_budget()
    {
        $account = $this->createChartOfAccount();

        $budget = Budget::create([
            'society_id' => $this->society->id,
            'fiscal_year' => '2025-26',
            'account_id' => $account->id,
            'budgeted_amount' => 1000000,
        ]);

        $this->put(route('budgets.update', $budget), [
            'fiscal_year' => '2026-27',
            'account_id' => $account->id,
            'budgeted_amount' => 6000000,
            'actual_amount' => 4000000,
        ])->assertRedirect(route('budgets.index'));

        $this->assertDatabaseHas('budgets', [
            'id' => $budget->id,
            'fiscal_year' => '2026-27',
            'budgeted_amount' => 6000000,
        ]);
    }

    public function test_can_delete_budget()
    {
        $account = $this->createChartOfAccount();

        $budget = Budget::create([
            'society_id' => $this->society->id,
            'fiscal_year' => '2025-26',
            'account_id' => $account->id,
            'budgeted_amount' => 1000000,
        ]);

        $this->delete(route('budgets.destroy', $budget))
            ->assertRedirect(route('budgets.index'));

        $this->assertDatabaseMissing('budgets', ['id' => $budget->id]);
    }
}