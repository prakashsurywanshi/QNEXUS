<?php

namespace Tests\Feature\Crud;

use App\Models\AdvanceAccount;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class AdvanceAccountsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('advance-accounts.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/advance-accounts/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('advance-accounts.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/advance-accounts/create'));
    }

    public function test_can_create_account()
    {
        $this->post(route('advance-accounts.store'), [
            'balance' => 2500,
        ])->assertRedirect(route('advance-accounts.index'));

        $this->assertDatabaseHas('advance_accounts', [
            'balance' => 2500,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_account()
    {
        $account = Model::unguarded(fn () => AdvanceAccount::create([
            'society_id' => $this->society->id,
            'balance' => 1000,
        ]));

        $this->put(route('advance-accounts.update', $account), [
            'balance' => 3000,
        ])->assertRedirect(route('advance-accounts.index'));

        $this->assertDatabaseHas('advance_accounts', [
            'id' => $account->id,
            'balance' => 3000,
        ]);
    }

    public function test_edit_page_renders()
    {
        $account = Model::unguarded(fn () => AdvanceAccount::create([
            'society_id' => $this->society->id,
            'balance' => 1000,
        ]));

        $this->get(route('advance-accounts.edit', $account))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/advance-accounts/edit'));
    }

    public function test_can_delete_account()
    {
        $account = Model::unguarded(fn () => AdvanceAccount::create([
            'society_id' => $this->society->id,
            'balance' => 1000,
        ]));

        $this->delete(route('advance-accounts.destroy', $account))
            ->assertRedirect(route('advance-accounts.index'));

        $this->assertDatabaseMissing('advance_accounts', ['id' => $account->id]);
    }
}
