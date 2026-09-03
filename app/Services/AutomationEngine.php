<?php

namespace App\Services;

use App\Models\AmcManagement;
use App\Models\ApartmentManagement;
use App\Models\Automation;
use App\Models\AutomationRun;
use App\Models\Gatepass;
use App\Models\LeaseAgreement;
use App\Models\MaintenanceApartment;
use App\Models\Ticket;
use Illuminate\Support\Collection;

class AutomationEngine
{
    /**
     * Run every active automation for a society. Returns the number of actions fired.
     */
    public function runForSociety(int $societyId): int
    {
        $fired = 0;

        $autos = Automation::where('society_id', $societyId)->where('is_active', true)
            ->orderBy('id')->get();

        $autos->each(function (Automation $automation) use (&$fired) {
            $fired += $this->runAutomation($automation);
        });

        return $fired;
    }

    public function runAutomation(Automation $automation): int
    {
        $subjects = $this->detectSubjects($automation->trigger_event, (int) $automation->society_id);

        if ($subjects->isEmpty()) {
            return 0;
        }

        $fired = 0;

        foreach ($subjects as [$type, $id]) {
            if ($this->alreadyFired($automation, $type, $id)) {
                continue;
            }

            $this->execute($automation, $type, $id);
            $this->recordRun($automation, $type, $id);
            $fired++;
        }

        return $fired;
    }

    /**
     * Detect subjects that currently satisfy a trigger event.
     *
     * @return Collection<int, array{0: string, 1: int}>
     */
    protected function detectSubjects(string $event, int $societyId): Collection
    {
        return match ($event) {
            'visitor_qr_expires' => $this->visitorQrExpiring($societyId),
            'complaint_sla' => $this->complaintOverSla($societyId),
            'maintenance_overdue' => $this->maintenanceOverdue($societyId),
            'amc_expiring' => $this->amcExpiring($societyId),
            'lease_expiring' => $this->leaseExpiring($societyId),
            default => collect(),
        };
    }

    /**
     * @return Collection<int, array{0: string, 1: int}>
     */
    protected function visitorQrExpiring(int $societyId): Collection
    {
        return Gatepass::where('society_id', $societyId)
            ->whereIn('status', ['approved', 'pending'])
            ->where('created_at', '<', now()->subHours(6))
            ->get()
            ->map(fn (Gatepass $g) => $this->pair(Gatepass::class, (int) $g->id));
    }

    /**
     * @return Collection<int, array{0: string, 1: int}>
     */
    protected function complaintOverSla(int $societyId): Collection
    {
        return Ticket::where('society_id', $societyId)
            ->whereIn('status', ['open', 'pending'])
            ->where('created_at', '<', now()->subHours(48))
            ->get()
            ->map(fn (Ticket $t) => $this->pair(Ticket::class, (int) $t->id));
    }

    /**
     * @return Collection<int, array{0: string, 1: int}>
     */
    protected function maintenanceOverdue(int $societyId): Collection
    {
        $apartmentIds = ApartmentManagement::where('society_id', $societyId)->pluck('id');

        return MaintenanceApartment::whereIn('apartment_management_id', $apartmentIds)
            ->where('paid_status', 'unpaid')
            ->whereHas('maintenanceManagement', fn ($q) => $q->where('payment_due_date', '<', now()))
            ->get()
            ->map(fn (MaintenanceApartment $m) => $this->pair(MaintenanceApartment::class, (int) $m->id));
    }

    /**
     * @return Collection<int, array{0: string, 1: int}>
     */
    protected function amcExpiring(int $societyId): Collection
    {
        return AmcManagement::where('society_id', $societyId)
            ->whereNotNull('end_date')
            ->where('end_date', '<=', now()->addDays(30))
            ->where('end_date', '>=', now())
            ->get()
            ->map(fn (AmcManagement $a) => $this->pair(AmcManagement::class, (int) $a->id));
    }

    /**
     * @return Collection<int, array{0: string, 1: int}>
     */
    protected function leaseExpiring(int $societyId): Collection
    {
        return LeaseAgreement::where('society_id', $societyId)
            ->whereNotNull('end_date')
            ->where('end_date', '<=', now()->addDays(45))
            ->where('end_date', '>=', now())
            ->get()
            ->map(fn (LeaseAgreement $l) => $this->pair(LeaseAgreement::class, (int) $l->id));
    }

    /**
     * @return array{string, int}
     */
    private function pair(string $subjectType, int $id): array
    {
        return [$subjectType, $id];
    }

    protected function alreadyFired(Automation $automation, string $type, int $id): bool
    {
        return AutomationRun::where('automation_id', $automation->id)
            ->where('subject_type', $type)
            ->where('subject_id', $id)
            ->exists();
    }

    protected function recordRun(Automation $automation, string $type, int $id): void
    {
        AutomationRun::create([
            'automation_id' => $automation->id,
            'society_id' => $automation->society_id,
            'subject_type' => $type,
            'subject_id' => $id,
            'action' => $automation->action,
            'fired_at' => now(),
        ]);
    }

    protected function execute(Automation $automation, string $type, int $id): void
    {
        $societyId = (string) $automation->society_id;
        $label = $this->labelFor($type, $id);
        $link = $this->linkFor($type, $id);

        $title = "Automation: {$automation->name}";
        $data = ['title' => $title, 'body' => $label, 'link' => $link];

        match ($automation->action) {
            'notify_facility_manager' => Notifier::notifyUsersWithPermission(
                $societyId,
                'Show Maintenance',
                Notifier::CATEGORY_WORK_ORDERS,
                $data,
            ),
            'notify_accounts' => Notifier::notifyUsersWithPermission(
                $societyId,
                'Show Finance',
                Notifier::CATEGORY_NOTICES,
                $data,
            ),
            'escalate_manager' => Notifier::notifyUsersWithPermission(
                $societyId,
                'Show Maintenance',
                Notifier::CATEGORY_APPROVALS,
                $data,
            ),
            'send_reminder' => Notifier::notifyUsersWithPermission(
                $societyId,
                'Show Maintenance',
                Notifier::CATEGORY_WORK_ORDERS,
                ['title' => "Reminder: {$automation->name}", 'body' => $label, 'link' => $link],
            ),
            default => $this->deactivateAccess($type, $id),
        };
    }

    protected function deactivateAccess(string $type, int $id): void
    {
        if ($type === Gatepass::class) {
            Gatepass::whereKey($id)->update(['status' => 'completed']);
        }
    }

    protected function labelFor(string $type, int $id): string
    {
        return match ($type) {
            Gatepass::class => "Gatepass #{$id} QR has expired and needs attention.",
            Ticket::class => "Complaint/ticket #{$id} is past its SLA.",
            MaintenanceApartment::class => "Maintenance entry #{$id} is overdue.",
            AmcManagement::class => "AMC #{$id} is expiring soon.",
            LeaseAgreement::class => "Lease agreement #{$id} is expiring soon.",
            default => "Auction fired for record #{$id}.",
        };
    }

    protected function linkFor(string $type, int $id): ?string
    {
        return match ($type) {
            Gatepass::class => '/gatepasses',
            Ticket::class => '/tickets',
            MaintenanceApartment::class => '/payments',
            AmcManagement::class => '/amc',
            LeaseAgreement::class => '/lease-agreements',
            default => null,
        };
    }

    /**
     * Public helper for tests/commands to invoke for a single society.
     */
    public function runNow(?int $societyId = null): int
    {
        $societyId = $societyId ?? (int) active_society_id();

        return $this->runForSociety($societyId);
    }
}
