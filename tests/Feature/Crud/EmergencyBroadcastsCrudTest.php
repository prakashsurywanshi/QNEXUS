<?php

namespace Tests\Feature\Crud;

use App\Models\EmergencyBroadcast;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class EmergencyBroadcastsCrudTest extends CrudTestCase
{
    public function test_index_renders_broadcasts()
    {
        $this->get(route('emergency-broadcasts.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('emergency-broadcasts/index')
                ->has('active')
                ->has('history')
                ->has('categories')
                ->has('audiences')
                ->has('severities'));
    }

    public function test_create_page_renders()
    {
        $this->get(route('emergency-broadcasts.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('emergency-broadcasts/create'));
    }

    public function test_can_issue_broadcast()
    {
        $this->post(route('emergency-broadcasts.store'), [
            'title' => 'Fire Drill',
            'category' => 'fire',
            'message' => 'Please evacuate Tower B immediately.',
            'audience' => 'all',
            'severity' => 'critical',
            'location' => 'Tower B',
        ])->assertRedirect(route('emergency-broadcasts.index'));

        $this->assertDatabaseHas('emergency_broadcasts', [
            'title' => 'Fire Drill',
            'category' => 'fire',
            'severity' => 'critical',
            'status' => 'active',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_resolve_broadcast()
    {
        $broadcast = Model::unguarded(fn () => EmergencyBroadcast::create([
            'society_id' => $this->society->id,
            'title' => 'Medical Emergency',
            'category' => 'medical',
            'message' => 'Paramedic on site.',
            'audience' => 'all',
            'severity' => 'warning',
            'status' => 'active',
            'sent_by' => $this->user->id,
            'sent_at' => now(),
        ]));

        $this->post(route('emergency-broadcasts.resolve', $broadcast))
            ->assertRedirect();

        $this->assertDatabaseHas('emergency_broadcasts', [
            'id' => $broadcast->id,
            'status' => 'resolved',
        ]);
    }

    public function test_can_delete_broadcast()
    {
        $broadcast = Model::unguarded(fn () => EmergencyBroadcast::create([
            'society_id' => $this->society->id,
            'title' => 'Gas Leak',
            'category' => 'gas',
            'message' => 'Venting in progress.',
            'audience' => 'all',
            'severity' => 'critical',
            'status' => 'resolved',
            'sent_by' => $this->user->id,
            'sent_at' => now(),
            'resolved_at' => now(),
        ]));

        $this->delete(route('emergency-broadcasts.destroy', $broadcast))
            ->assertRedirect(route('emergency-broadcasts.index'));

        $this->assertDatabaseMissing('emergency_broadcasts', ['id' => $broadcast->id]);
    }
}
