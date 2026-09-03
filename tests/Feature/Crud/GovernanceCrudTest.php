<?php

namespace Tests\Feature\Crud;

use App\Models\Approval;
use App\Models\AuditLog;
use App\Models\Automation;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

class GovernanceCrudTest extends CrudTestCase
{
    // ----- Approvals -----

    public function test_approvals_index_renders()
    {
        $this->get(route('approvals.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('approvals/index'));
    }

    public function test_can_create_approval()
    {
        $this->post(route('approvals.store'), [
            'type' => 'expense',
            'title' => 'Lift maintenance',
            'description' => 'Annual service',
        ])->assertRedirect(route('approvals.index'));

        $this->assertDatabaseHas('approvals', [
            'title' => 'Lift maintenance',
            'type' => 'expense',
            'status' => 'pending',
            'society_id' => $this->society->id,
            'requested_by' => $this->user->id,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'Created approval: Lift maintenance',
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_decide_approval()
    {
        $approval = Model::unguarded(fn () => Approval::create([
            'society_id' => $this->society->id,
            'type' => 'vendor',
            'title' => 'New vendor onboarding',
            'status' => 'pending',
            'requested_by' => $this->user->id,
        ]));

        $this->patch(route('approvals.decide', $approval), [
            'status' => 'approved',
            'decision_notes' => 'Approved by committee',
        ])->assertRedirect(route('approvals.index'));

        $this->assertDatabaseHas('approvals', [
            'id' => $approval->id,
            'status' => 'approved',
            'approved_by' => $this->user->id,
        ]);
    }

    public function test_approval_create_page_renders()
    {
        $this->get(route('approvals.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('approvals/create'));
    }

    // ----- Automations -----

    public function test_automations_index_renders()
    {
        $this->get(route('automations.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('automations/index'));
    }

    public function test_can_create_automation()
    {
        $this->post(route('automations.store'), [
            'name' => 'AMC expiring',
            'trigger_event' => 'amc_expiring',
            'action' => 'notify_facility_manager',
            'is_active' => true,
        ])->assertRedirect(route('automations.index'));

        $this->assertDatabaseHas('automations', [
            'name' => 'AMC expiring',
            'trigger_event' => 'amc_expiring',
            'action' => 'notify_facility_manager',
            'is_active' => true,
            'society_id' => $this->society->id,
        ]);
    }

    public function test_can_toggle_automation()
    {
        $automation = Model::unguarded(fn () => Automation::create([
            'society_id' => $this->society->id,
            'name' => 'Rule',
            'trigger_event' => 'complaint_sla',
            'action' => 'escalate_manager',
            'is_active' => true,
        ]));

        $this->patch(route('automations.toggle', $automation))
            ->assertRedirect(route('automations.index'));

        $this->assertDatabaseHas('automations', [
            'id' => $automation->id,
            'is_active' => false,
        ]);
    }

    public function test_can_delete_automation()
    {
        $automation = Model::unguarded(fn () => Automation::create([
            'society_id' => $this->society->id,
            'name' => 'To delete',
            'trigger_event' => 'maintenance_overdue',
            'action' => 'send_reminder',
            'is_active' => true,
        ]));

        $this->delete(route('automations.destroy', $automation))
            ->assertRedirect(route('automations.index'));

        $this->assertDatabaseMissing('automations', ['id' => $automation->id]);
    }

    // ----- Audit Logs -----

    public function test_audit_logs_index_renders()
    {
        $this->get(route('audit-logs.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('audit-logs/index'));
    }

    public function test_audit_logs_index_shows_entries()
    {
        AuditLog::create([
            'society_id' => $this->society->id,
            'user_id' => $this->user->id,
            'action' => 'Updated ticket QNX-1',
            'ip_address' => '127.0.0.1',
        ]);

        $this->get(route('audit-logs.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('audit-logs/index')
                ->has('logs', 1)
                ->where('logs.0.action', 'Updated ticket QNX-1'));
    }
}