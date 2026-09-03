<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Approval extends Model
{
    use HasSociety;

    protected $guarded = ['id'];

    protected $casts = [
        'decided_at' => 'datetime',
    ];

    /** @return BelongsTo<User, $this> */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /** @return BelongsTo<User, $this> */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /** @return HasMany<ApprovalStep, $this> */
    public function steps(): HasMany
    {
        return $this->hasMany(ApprovalStep::class)->orderBy('step_number');
    }

    /** @return HasMany<ApprovalStepDecision, $this> */
    public function stepDecisions(): HasMany
    {
        return $this->hasMany(ApprovalStepDecision::class);
    }

    /**
     * The currently active step, if any.
     */
    public function currentStep(): ?ApprovalStep
    {
        return $this->steps()->where('status', 'in_progress')->first()
            ?? $this->steps()->where('status', 'pending')->orderBy('step_number')->first();
    }

    public function hasSteps(): bool
    {
        return $this->steps()->exists();
    }

    /**
     * Add an ordered step to this approval's chain. When the first step is
     * added the approval is marked pending and the first step becomes active.
     *
     * @param  array{title: string, description?: string|null, assigned_to?: int|null}  $attributes
     */
    public function addStep(array $attributes): ApprovalStep
    {
        $nextNumber = (int) $this->steps()->max('step_number') + 1;

        $step = $this->steps()->create([
            'step_number' => $nextNumber,
            'title' => $attributes['title'],
            'description' => $attributes['description'] ?? null,
            'assigned_to' => $attributes['assigned_to'] ?? null,
            'status' => $nextNumber === 1 ? 'in_progress' : 'pending',
        ]);

        if ($this->status === 'approved') {
            $this->update(['status' => 'pending']);
        }

        return $step;
    }

    /**
     * Record a decision against the given step and roll the chain forward.
     * Rejecting any step rejects the whole approval.
     */
    public function decideStep(ApprovalStep $step, string $decision, ?int $decidedBy, ?string $notes = null): void
    {
        if (in_array($step->status, ['approved', 'rejected'], true)) {
            return;
        }

        $step->update([
            'status' => $decision,
            'decided_by' => $decidedBy,
            'decision_notes' => $notes,
            'decided_at' => now(),
        ]);

        $this->stepDecisions()->create([
            'approval_id' => $this->id,
            'approval_step_id' => $step->id,
            'decided_by' => $decidedBy,
            'decision' => $decision,
            'notes' => $notes,
            'decided_at' => now(),
        ]);

        if ($decision === 'rejected') {
            $this->update([
                'status' => 'rejected',
                'approved_by' => $decidedBy,
                'decision_notes' => $notes,
                'decided_at' => now(),
            ]);

            return;
        }

        $next = $this->steps()
            ->where('step_number', '>', $step->step_number)
            ->orderBy('step_number')
            ->first();

        if ($next) {
            $next->update(['status' => 'in_progress']);

            return;
        }

        $this->update([
            'status' => 'approved',
            'approved_by' => $decidedBy,
            'decided_at' => now(),
        ]);
    }
}
