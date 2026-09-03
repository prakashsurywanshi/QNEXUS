<?php

namespace Tests\Feature\Crud;

use App\Models\BoomBarrierLog;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class BoomBarrierLogsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('boom-barrier-logs.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('boom-barrier-logs/index'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('boom-barrier-logs.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('boom-barrier-logs/create'));
    }

    public function test_can_create_log()
    {
        $this->post(route('boom-barrier-logs.store'), [
            'gate_name' => 'Main Gate',
            'vehicle_number' => 'MH12AB1234',
            'direction' => 'in',
            'barrier_type' => 'vehicle',
            'trigger_method' => 'manual',
            'opened_at' => now()->format('Y-m-d H:i:s'),
        ])->assertRedirect(route('boom-barrier-logs.index'));

        $this->assertDatabaseHas('boom_barrier_logs', [
            'gate_name' => 'Main Gate',
            'vehicle_number' => 'MH12AB1234',
            'direction' => 'in',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_update_log()
    {
        $log = Model::unguarded(fn () => BoomBarrierLog::create([
            'society_id' => $this->society->id,
            'gate_name' => 'Main Gate',
            'direction' => 'in',
            'barrier_type' => 'vehicle',
            'trigger_method' => 'manual',
            'opened_at' => now(),
        ]));

        $this->put(route('boom-barrier-logs.update', $log), [
            'gate_name' => 'Side Gate',
            'direction' => 'out',
            'barrier_type' => 'vehicle',
            'trigger_method' => 'remote',
            'opened_at' => now()->format('Y-m-d H:i:s'),
        ])->assertRedirect(route('boom-barrier-logs.index'));

        $this->assertDatabaseHas('boom_barrier_logs', [
            'id' => $log->id,
            'gate_name' => 'Side Gate',
            'direction' => 'out',
        ]);
    }

    public function test_edit_page_renders()
    {
        $log = Model::unguarded(fn () => BoomBarrierLog::create([
            'society_id' => $this->society->id,
            'gate_name' => 'Main Gate',
            'direction' => 'in',
            'barrier_type' => 'vehicle',
            'trigger_method' => 'manual',
            'opened_at' => now(),
        ]));

        $this->get(route('boom-barrier-logs.edit', $log))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('boom-barrier-logs/edit'));
    }

    public function test_can_delete_log()
    {
        $log = Model::unguarded(fn () => BoomBarrierLog::create([
            'society_id' => $this->society->id,
            'gate_name' => 'Main Gate',
            'direction' => 'in',
            'barrier_type' => 'vehicle',
            'trigger_method' => 'manual',
            'opened_at' => now(),
        ]));

        $this->delete(route('boom-barrier-logs.destroy', $log))
            ->assertRedirect(route('boom-barrier-logs.index'));

        $this->assertDatabaseMissing('boom_barrier_logs', ['id' => $log->id]);
    }
}
