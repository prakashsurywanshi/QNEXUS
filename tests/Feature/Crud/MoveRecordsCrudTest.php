<?php

namespace Tests\Feature\Crud;

use App\Models\MoveRecord;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class MoveRecordsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('move-records.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('move-records/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('move-records.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('move-records/create'));
    }

    public function test_can_create_move_record()
    {
        $this->post(route('move-records.store'), [
            'user_id' => $this->user->id,
            'move_type' => 'in',
            'move_date' => now()->format('Y-m-d'),
            'deposit_status' => 'pending',
            'noc_status' => 'pending',
        ])->assertRedirect(route('move-records.index'));

        $this->assertDatabaseHas('move_records', [
            'user_id' => $this->user->id,
            'move_type' => 'in',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_move_record()
    {
        $record = Model::unguarded(fn () => MoveRecord::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'move_type' => 'in',
            'move_date' => now()->format('Y-m-d'),
            'deposit_status' => 'pending',
            'noc_status' => 'pending',
        ]));

        $this->put(route('move-records.update', $record), [
            'user_id' => $this->user->id,
            'move_type' => 'out',
            'move_date' => now()->format('Y-m-d'),
            'deposit_status' => 'refunded',
            'noc_status' => 'approved',
        ])->assertRedirect(route('move-records.index'));

        $this->assertDatabaseHas('move_records', [
            'id' => $record->id,
            'move_type' => 'out',
            'noc_status' => 'approved',
        ]);
    }

    public function test_edit_page_renders()
    {
        $record = Model::unguarded(fn () => MoveRecord::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'move_type' => 'in',
            'move_date' => now()->format('Y-m-d'),
            'deposit_status' => 'pending',
            'noc_status' => 'pending',
        ]));

        $this->get(route('move-records.edit', $record))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('move-records/edit'));
    }

    public function test_can_delete_move_record()
    {
        $record = Model::unguarded(fn () => MoveRecord::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'move_type' => 'in',
            'move_date' => now()->format('Y-m-d'),
            'deposit_status' => 'pending',
            'noc_status' => 'pending',
        ]));

        $this->delete(route('move-records.destroy', $record))
            ->assertRedirect(route('move-records.index'));

        $this->assertDatabaseMissing('move_records', ['id' => $record->id]);
    }
}
