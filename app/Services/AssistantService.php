<?php

namespace App\Services;

use App\Models\AmcManagement;
use App\Models\ApartmentManagement;
use App\Models\MaintenanceApartment;
use App\Models\Payment;
use App\Models\Staff;
use App\Models\Tenant;
use App\Models\Ticket;
use App\Models\Vehicle;
use App\Models\WorkOrder;

class AssistantService
{
    /**
     * @return array{answer: string, intent: string, data?: array<string, mixed>}
     */
    public function answer(string $question, ?int $societyId): array
    {
        $q = strtolower(trim($question));

        if (empty($q)) {
            return ['answer' => 'Ask me about occupancy, tickets, work orders, finance, AMC, members, vehicles or staff.', 'intent' => 'empty'];
        }

        $handlers = [
            'spend_security' => fn () => $this->spendSecurity($societyId),
            'amc_expiry' => fn () => $this->amcExpiry($societyId),
            'maintenance_owed' => fn () => $this->maintenanceOwed($societyId),
            'open_tickets' => fn () => $this->openTickets($societyId),
            'open_work_orders' => fn () => $this->openWorkOrders($societyId),
            'occupancy' => fn () => $this->occupancy($societyId),
            'members' => fn () => $this->members($societyId),
            'vehicles' => fn () => $this->vehicles($societyId),
            'staff' => fn () => $this->staff($societyId),
            'payments' => fn () => $this->payments($societyId),
        ];

        foreach ($handlers as $intent => $handler) {
            if ($this->matchesIntent($intent, $q)) {
                return $handler();
            }
        }

        return [
            'answer' => 'I couldn\'t match that question to a known topic. Try asking about: spend on security, AMC expiries, maintenance owed, open tickets or work orders, occupancy, members, vehicles, staff, or payments collected.',
            'intent' => 'fallback',
            'data' => ['question' => $question],
        ];
    }

    /**
     * @return array{answer: string, intent: string, data?: array<string, mixed>}
     */
    protected function spendSecurity(?int $societyId): array
    {
        $collected = (float) Payment::where('society_id', $societyId)->sum('amount');
        $count = Payment::where('society_id', $societyId)->count();
        $securityStaff = Staff::where('society_id', $societyId)->where('designation', 'like', '%security%')->count();

        return [
            'answer' => '₹'.number_format($collected, 2)." collected across {$count} payment{$this->pluralNoun($count)}. Security staff on roster: {$securityStaff}.",
            'intent' => 'spend_security',
            'data' => ['collected' => $collected, 'count' => $count, 'security_staff' => $securityStaff],
        ];
    }

    /**
     * @return array{answer: string, intent: string, data?: array<string, mixed>}
     */
    protected function amcExpiry(?int $societyId): array
    {
        $next = AmcManagement::with('asset', 'vendor')->where('society_id', $societyId)
            ->whereBetween('end_date', [now()->startOfMonth(), now()->addMonths(2)->endOfMonth()])
            ->orderBy('end_date')->get();

        if ($next->isEmpty()) {
            return ['answer' => 'No AMCs expire within the next two months.', 'intent' => 'amc_expiry', 'data' => ['count' => 0]];
        }

        $lines = $next->map(function (AmcManagement $amc) {
            $label = optional($amc->asset)->name ?? "AMC #{$amc->id}";
            $date = $amc->end_date ? $amc->end_date->format('d M Y') : 'unknown';

            return '• '.$label.' — '.$date.(optional($amc->vendor)->name ? ' ('.optional($amc->vendor)->name.')' : '');
        })->implode("\n");

        return [
            'answer' => "AMCs expiring soon ({$next->count()}):\n{$lines}",
            'intent' => 'amc_expiry',
            'data' => ['count' => $next->count()],
        ];
    }

    /**
     * @return array{answer: string, intent: string, data?: array<string, mixed>}
     */
    protected function maintenanceOwed(?int $societyId): array
    {
        $apartmentIds = ApartmentManagement::where('society_id', $societyId)->pluck('id');
        $base = MaintenanceApartment::whereIn('apartment_management_id', $apartmentIds)
            ->where('paid_status', 'unpaid');

        $owed = (float) $base->sum('cost') + (float) $base->sum('arrears_amount');
        $count = $base->count();

        return [
            'answer' => "Outstanding maintenance across {$count} unpaid entr{$this->plural('y', $count)}: ₹".number_format($owed, 2).'.',
            'intent' => 'maintenance_owed',
            'data' => ['owed' => $owed, 'entries' => $count],
        ];
    }

    /**
     * @return array{answer: string, intent: string, data?: array<string, mixed>}
     */
    protected function openTickets(?int $societyId): array
    {
        $open = Ticket::where('society_id', $societyId)
            ->whereIn('status', ['open', 'pending'])->count();
        $total = Ticket::where('society_id', $societyId)->count();

        return [
            'answer' => "There {$this->plural('is', $open)} {$open} open ticket{$this->pluralNoun($open)} out of {$total} total.",
            'intent' => 'open_tickets',
            'data' => ['open' => $open, 'total' => $total],
        ];
    }

    /**
     * @return array{answer: string, intent: string, data?: array<string, mixed>}
     */
    protected function openWorkOrders(?int $societyId): array
    {
        $open = WorkOrder::where('society_id', $societyId)
            ->whereIn('status', ['open', 'assigned', 'in_progress'])->count();
        $high = WorkOrder::where('society_id', $societyId)
            ->whereIn('status', ['open', 'assigned', 'in_progress'])
            ->where('priority', 'urgent')->count();

        return [
            'answer' => "{$open} open work order{$this->pluralNoun($open)}".($high > 0 ? ", {$high} urgent." : '.'),
            'intent' => 'open_work_orders',
            'data' => ['open' => $open, 'urgent' => $high],
        ];
    }

    /**
     * @return array{answer: string, intent: string, data?: array<string, mixed>}
     */
    protected function occupancy(?int $societyId): array
    {
        $total = ApartmentManagement::where('society_id', $societyId)->count();
        $byStatus = ApartmentManagement::where('society_id', $societyId)
            ->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status')->toArray();
        $occupied = ($byStatus['occupied'] ?? 0) + ($byStatus['rented'] ?? 0);
        $tenants = Tenant::where('society_id', $societyId)->count();
        $rate = $total > 0 ? round(($occupied / $total) * 100) : 0;

        return [
            'answer' => "Occupancy is {$rate}% — {$occupied} of {$total} units occupied. {$tenants} tenant{$this->pluralNoun($tenants)} on record.",
            'intent' => 'occupancy',
            'data' => ['total' => $total, 'occupied' => $occupied, 'rate' => $rate],
        ];
    }

    /**
     * @return array{answer: string, intent: string, data?: array<string, mixed>}
     */
    protected function members(?int $societyId): array
    {
        $apartments = ApartmentManagement::where('society_id', $societyId)->where('status', 'occupied')->count();

        return [
            'answer' => "There are {$apartments} occupied apartment{$this->pluralNoun($apartments)}.",
            'intent' => 'members',
            'data' => ['occupied' => $apartments],
        ];
    }

    /**
     * @return array{answer: string, intent: string, data?: array<string, mixed>}
     */
    protected function vehicles(?int $societyId): array
    {
        $total = Vehicle::where('society_id', $societyId)->count();
        $four = Vehicle::where('society_id', $societyId)->where('vehicle_type', 'four_wheeler')->count();

        return [
            'answer' => "There are {$total} registered vehicle{$this->pluralNoun($total)}, including {$four} four-wheeler{$this->pluralNoun($four)}.",
            'intent' => 'vehicles',
            'data' => ['total' => $total],
        ];
    }

    /**
     * @return array{answer: string, intent: string, data?: array<string, mixed>}
     */
    protected function staff(?int $societyId): array
    {
        $total = Staff::where('society_id', $societyId)->count();
        $active = Staff::where('society_id', $societyId)->where('is_active', true)->count();

        return [
            'answer' => "{$total} staff on record; {$active} active.",
            'intent' => 'staff',
            'data' => ['total' => $total, 'active' => $active],
        ];
    }

    /**
     * @return array{answer: string, intent: string, data?: array<string, mixed>}
     */
    protected function payments(?int $societyId): array
    {
        $collected = (float) Payment::where('society_id', $societyId)->sum('amount');
        $apartmentIds = ApartmentManagement::where('society_id', $societyId)->pluck('id');
        $billed = (float) MaintenanceApartment::whereIn('apartment_management_id', $apartmentIds)->sum('cost');
        $rate = $billed > 0 ? round(($collected / $billed) * 100) : 0;

        return [
            'answer' => 'Collected ₹'.number_format($collected, 2).' against ₹'.number_format($billed, 2)." billed ({$rate}% collection rate).",
            'intent' => 'payments',
            'data' => ['collected' => $collected, 'billed' => $billed, 'rate' => $rate],
        ];
    }

    private function matchesIntent(string $intent, string $q): bool
    {
        $keywords = [
            'spend_security' => ['security', 'spend', 'spent', 'expense', 'expenditure'],
            'amc_expiry' => ['amc', 'expire', 'expiry', 'renew'],
            'maintenance_owed' => ['maintenance', 'owe', 'owed', 'outstanding', 'dues', 'due'],
            'open_tickets' => ['ticket', 'complaint', 'complaints', 'open'],
            'open_work_orders' => ['work order', 'workorder', 'work-orders'],
            'occupancy' => ['occupancy', 'occupied', 'vacant', 'occupation', 'leased', 'rented'],
            'members' => ['member', 'members', 'family', 'resident', 'residents'],
            'vehicles' => ['vehicle', 'vehicles', 'car', 'parking'],
            'staff' => ['staff', 'worker', 'workers', 'employee', 'guard'],
            'payments' => ['payment', 'payments', 'collected', 'collection', 'income', 'revenue'],
        ];

        foreach ($keywords[$intent] as $word) {
            if (str_contains($q, $word)) {
                return true;
            }
        }

        return false;
    }

    private function plural(string $word, int $count): string
    {
        return $count === 1 ? $word : ($word === 'is' ? 'are' : $word);
    }

    private function pluralNoun(int $count): string
    {
        return $count === 1 ? '' : 's';
    }
}
