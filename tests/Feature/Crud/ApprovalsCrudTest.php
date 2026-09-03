<?php

namespace Tests\Feature\Crud;

use App\Models\Approval;
use App\Models\ApprovalStep;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

class ApprovalsCrudTest extends CrudTestCase
{
    public function test_index_renders_list()
    {
        $this->get(route('approvals.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('approvals/index'));
    }

    public function test_create_with_ordered_steps()
    {
        $response = $this->post(route('approvals.store'), [
            'type' => 'expense',
            'title' => 'Replace lift cables',
            'description' => 'Quoted by vendor',
            'steps' => [
                ['title' => 'Manager review', 'description' => 'Check budget'],
                ['title' => 'Treasurer sign-off'],
            ],
        ])->assertRedirect(route('approvals.index'));

        $approval = Approval::first();

        $this->assertSame('pending', $approval->status);
        $this->assertSame(2, $approval->steps()->count());

        $steps = $approval->steps()->orderBy('step_number')->get();

        $this->assertSame(1, $steps[0]->step_number);
        $this->assertSame('in_progress', $steps[0]->status);
        $this->assertSame(2, $steps[1]->step_number);
        $this->assertSame('pending', $steps[1]->status);
    }

    public function test_first_approval_advances_to_next_step_not_finalising()
    {
        $approval = $this->makeApprovalWithSteps(3);

        $this->patch(route('approvals.decideStep', ['approval' => $approval->id, 'step' => $approval->steps[0]->id]), [
            'decision' => 'approved',
        ])->assertRedirect(route('approvals.index'));

        $approval->refresh();

        $this->assertSame('pending', $approval->status);
        $this->assertSame('approved', $approval->steps[0]->status);
        $this->assertSame('in_progress', $approval->steps[1]->status);
        $this->assertSame('pending', $approval->steps[2]->status);

        $this->assertDatabaseHas('approval_step_decisions', [
            'approval_id' => $approval->id,
            'approval_step_id' => $approval->steps[0]->id,
            'decision' => 'approved',
            'decided_by' => $this->user->id,
        ]);
    }

    public function test_final_approval_finalises_as_approved()
    {
        [$approval, $step1, $step2] = $this->makeTwoStepApproval();

        $this->patch(route('approvals.decideStep', ['approval' => $approval->id, 'step' => $step1->id]), ['decision' => 'approved']);
        $this->patch(route('approvals.decideStep', ['approval' => $approval->id, 'step' => $step2->id]), ['decision' => 'approved']);

        $approval->refresh();

        $this->assertSame('approved', $approval->status);
        $this->assertSame('approved', $step2->refresh()->status);
        $this->assertNotNull($approval->decided_at);
    }

    public function test_rejection_at_any_step_rejects_the_whole_approval()
    {
        [$approval, $step1, $step2] = $this->makeTwoStepApproval();

        $this->patch(route('approvals.decideStep', ['approval' => $approval->id, 'step' => $step1->id]), [
            'decision' => 'rejected',
            'notes' => 'Over budget',
        ]);

        $approval->refresh();

        $this->assertSame('rejected', $approval->status);
        $this->assertSame('rejected', $step1->refresh()->status);
        $this->assertSame('pending', $step2->refresh()->status);
        $this->assertSame('Over budget', $approval->decision_notes);
    }

    public function test_deciding_a_non_belonging_step_returns_404()
    {
        [$approvalA] = $this->makeTwoStepApproval();
        $other = Approval::create([
            'society_id' => $this->society->id,
            'requested_by' => $this->user->id,
            'type' => 'vendor',
            'title' => 'Other approval',
            'status' => 'pending',
        ]);
        $otherStep = $other->addStep(['title' => 'Other step']);

        $this->patch(route('approvals.decideStep', ['approval' => $approvalA->id, 'step' => $otherStep->id]), [
            'decision' => 'approved',
        ])->assertNotFound();
    }

    public function test_index_exposes_steps_with_assignees()
    {
        $assigned = User::factory()->create(['society_id' => $this->society->id, 'name' => 'Reviewer One']);
        $approval = Approval::create([
            'society_id' => $this->society->id,
            'requested_by' => $this->user->id,
            'type' => 'purchase',
            'title' => 'New laptops',
            'status' => 'pending',
        ]);
        $approval->addStep(['title' => 'IT review', 'assigned_to' => $assigned->id]);
        $approval->addStep(['title' => 'Finance sign-off']);

        $this->get(route('approvals.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('approvals/index')
                ->has('approvals', 1)
                ->has('approvals.0.steps', 2)
                ->where('approvals.0.steps.0.title', 'IT review')
                ->where('approvals.0.steps.0.assignee.name', 'Reviewer One'));
    }

    private function makeApprovalWithSteps(int $count): Approval
    {
        $approval = Approval::create([
            'society_id' => $this->society->id,
            'requested_by' => $this->user->id,
            'type' => 'expense',
            'title' => 'Multi-step request',
            'description' => null,
            'status' => 'pending',
        ]);

        for ($i = 1; $i <= $count; $i++) {
            $approval->addStep(['title' => "Step $i"]);
        }

        return $approval;
    }

    /**
     * @return array{0: Approval, 1: ApprovalStep, 2: ApprovalStep}
     */
    private function makeTwoStepApproval(): array
    {
        $approval = $this->makeApprovalWithSteps(2);
        $steps = $approval->steps()->orderBy('step_number')->get();

        return [$approval, $steps[0], $steps[1]];
    }
}
