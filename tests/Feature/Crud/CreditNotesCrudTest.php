<?php

namespace Tests\Feature\Crud;

use App\Models\CreditNote;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class CreditNotesCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('credit-notes.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/credit-notes/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('credit-notes.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/credit-notes/create'));
    }

    public function test_can_create_credit_note()
    {
        $this->post(route('credit-notes.store'), [
            'credit_number' => 'CN-0001',
            'amount' => 500,
            'reason' => 'Maintenance overcharge refund',
            'status' => 'pending',
        ])->assertRedirect(route('credit-notes.index'));

        $this->assertDatabaseHas('credit_notes', [
            'credit_number' => 'CN-0001',
            'amount' => 500,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_credit_note()
    {
        $note = Model::unguarded(fn () => CreditNote::create([
            'society_id' => $this->society->id,
            'credit_number' => 'CN-0001',
            'amount' => 500,
            'reason' => 'Old reason',
            'status' => 'pending',
            'created_by' => $this->user->id,
        ]));

        $this->put(route('credit-notes.update', $note), [
            'credit_number' => 'CN-0002',
            'amount' => 750,
            'reason' => 'Updated reason',
            'status' => 'applied',
        ])->assertRedirect(route('credit-notes.index'));

        $this->assertDatabaseHas('credit_notes', [
            'id' => $note->id,
            'credit_number' => 'CN-0002',
            'status' => 'applied',
        ]);
    }

    public function test_edit_page_renders()
    {
        $note = Model::unguarded(fn () => CreditNote::create([
            'society_id' => $this->society->id,
            'credit_number' => 'CN-0001',
            'amount' => 500,
            'reason' => 'Reason',
            'status' => 'pending',
            'created_by' => $this->user->id,
        ]));

        $this->get(route('credit-notes.edit', $note))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('accounting/credit-notes/edit'));
    }

    public function test_can_delete_credit_note()
    {
        $note = Model::unguarded(fn () => CreditNote::create([
            'society_id' => $this->society->id,
            'credit_number' => 'CN-0001',
            'amount' => 500,
            'reason' => 'Reason',
            'status' => 'pending',
            'created_by' => $this->user->id,
        ]));

        $this->delete(route('credit-notes.destroy', $note))
            ->assertRedirect(route('credit-notes.index'));

        $this->assertDatabaseMissing('credit_notes', ['id' => $note->id]);
    }
}
