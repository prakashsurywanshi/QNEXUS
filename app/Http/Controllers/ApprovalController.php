<?php

namespace App\Http\Controllers;

use App\Models\Approval;
use App\Models\ApprovalStep;
use App\Models\AuditLog;
use App\Services\Notifier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ApprovalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('approvals/index', [
            'approvals' => Approval::with(['requester', 'approver', 'steps.assignee', 'steps.decidedBy'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('approvals/create', [
            'types' => ['expense', 'vendor', 'refund', 'amenity', 'access', 'purchase', 'maintenance'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['expense', 'vendor', 'refund', 'amenity', 'access', 'purchase', 'maintenance'])],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'steps.*.title' => ['required', 'string', 'max:255'],
            'steps.*.description' => ['nullable', 'string'],
            'steps.*.assigned_to' => ['nullable', 'integer'],
        ]);

        $approval = Approval::create([
            'society_id' => active_society_id(),
            'requested_by' => auth()->id(),
            'type' => $data['type'],
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => 'pending',
        ]);

        foreach ($data['steps'] ?? [] as $stepAttributes) {
            $approval->addStep($stepAttributes);
        }

        AuditLog::record('Created approval: '.$approval->title, $approval);

        Notifier::notifyUsersWithPermission(
            (string) active_society_id(),
            'Show Approvals',
            Notifier::CATEGORY_APPROVALS,
            [
                'title' => 'New approval request',
                'body' => ucfirst((string) $approval->type).' · '.$approval->title,
                'link' => route('approvals.index'),
            ],
        );

        return redirect()->route('approvals.index');
    }

    public function decideStep(Request $request, Approval $approval, ApprovalStep $step): RedirectResponse
    {
        abort_unless($approval->steps()->whereKey($step->id)->exists(), 404);

        $data = $request->validate([
            'decision' => ['required', Rule::in(['approved', 'rejected'])],
            'notes' => ['nullable', 'string'],
        ]);

        $approval->decideStep(
            $step,
            $data['decision'],
            (int) auth()->id(),
            $data['notes'] ?? null
        );

        AuditLog::record("Approval step {$step->step_number} {$data['decision']}: {$approval->title}", $approval);

        if ($approval->status === 'rejected' && $approval->requested_by !== null) {
            Notifier::notify((int) $approval->requested_by, Notifier::CATEGORY_APPROVALS, [
                'title' => 'Approval rejected',
                'body' => "Your request '{$approval->title}' was rejected at step {$step->step_number}",
                'link' => route('approvals.index'),
            ]);
        } elseif ($approval->status === 'approved') {
            Notifier::notify((int) $approval->requested_by, Notifier::CATEGORY_APPROVALS, [
                'title' => 'Approval finalised',
                'body' => "Your request '{$approval->title}' was approved",
                'link' => route('approvals.index'),
            ]);
        } else {
            $next = $approval->currentStep();
            if ($next && $next->assigned_to !== null) {
                Notifier::notify((int) $next->assigned_to, Notifier::CATEGORY_APPROVALS, [
                    'title' => 'Approval step ready',
                    'body' => "'{$approval->title}' now awaits your approval at step {$next->step_number}",
                    'link' => route('approvals.index'),
                ]);
            }
        }

        return redirect()->route('approvals.index');
    }

    public function decide(Request $request, Approval $approval): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['approved', 'rejected'])],
            'decision_notes' => ['nullable', 'string'],
        ]);

        $approval->update([
            'status' => $data['status'],
            'approved_by' => auth()->id(),
            'decision_notes' => $data['decision_notes'] ?? null,
            'decided_at' => now(),
        ]);

        AuditLog::record("Approval {$approval->status}: {$approval->title}", $approval);

        $requesterId = $approval->requested_by;
        if ($requesterId !== null) {
            Notifier::notify((int) $requesterId, Notifier::CATEGORY_APPROVALS, [
                'title' => 'Approval '.$approval->status,
                'body' => "Your request '{$approval->title}' was {$approval->status}",
                'link' => route('approvals.index'),
            ]);
        }

        return redirect()->route('approvals.index');
    }

    public function destroy(Approval $approval): RedirectResponse
    {
        $approval->delete();

        return redirect()->route('approvals.index');
    }
}
