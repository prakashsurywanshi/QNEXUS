<?php

namespace App\Http\Controllers;

use App\Models\AmcManagement;
use App\Models\AmenityBooking;
use App\Models\ApartmentManagement;
use App\Models\Approval;
use App\Models\Automation;
use App\Models\CommercialTenant;
use App\Models\CommercialUnit;
use App\Models\LeaseAgreement;
use App\Models\Maintenance;
use App\Models\Notice;
use App\Models\ParkingManagementSetting;
use App\Models\Rent;
use App\Models\Role;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Models\SosAlert;
use App\Models\Tenant;
use App\Models\Ticket;
use App\Models\Tower;
use App\Models\VisitorManagement;
use App\Models\WorkOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        if (is_superadmin()) {
            return redirect()->route('superadmin.dashboard');
        }

        $society = society();
        $role = isRole();

        $stats = $this->stats(role: $role);
        $lists = $this->lists(role: $role);
        $charts = $this->charts();

        $props = [
            'greeting' => [
                'name' => auth()->user()->name,
                'society_name' => $society instanceof Society ? $society->name : null,
                'property_type' => $society instanceof Society ? $society->property_type : null,
                'date' => now()->translatedFormat('l, d F Y'),
            ],
            'stats' => $stats,
            'lists' => $lists,
            'charts' => $charts,
            'quick_actions' => $this->quickActions(role: $role),
        ];

        if (in_array($role, ['Owner', 'Tenant'], true)) {
            return Inertia::render('home/resident', $props);
        }

        if ($role === 'Guard') {
            return Inertia::render('home/guard', $props);
        }

        return Inertia::render('dashboard', $props);
    }

    /**
     * Role-appropriate primary actions surfaced on the home screen so a
     * resident, guard or manager lands on the tasks that matter to them.
     *
     * @return array<int, array{label: string, description: string, href: string, icon: string}>
     */
    private function quickActions(?string $role): array
    {
        if (in_array($role, ['Owner', 'Tenant'], true)) {
            return [
                ['label' => 'Book an Amenity', 'description' => 'Reserve clubhouse, gym, pool and more', 'href' => route('amenity-bookings.create'), 'icon' => 'calendar'],
                ['label' => 'Raise a Ticket', 'description' => 'Report an issue to management', 'href' => route('tickets.create'), 'icon' => 'lifebuoy'],
                ['label' => 'View Notices', 'description' => 'Latest community announcements', 'href' => route('notices.index'), 'icon' => 'megaphone'],
            ];
        }

        if ($role === 'Guard') {
            return [
                ['label' => 'Register Visitor', 'description' => 'Log a new gate entry', 'href' => route('visitors.index'), 'icon' => 'door'],
                ['label' => 'SOS Alerts', 'description' => 'Review and respond to alerts', 'href' => route('sos-alerts.index'), 'icon' => 'alert'],
                ['label' => 'Open Tickets', 'description' => 'Track community issues', 'href' => route('tickets.index'), 'icon' => 'lifebuoy'],
            ];
        }

        return [
            ['label' => 'New Work Order', 'description' => 'Dispatch maintenance work', 'href' => route('work-orders.create'), 'icon' => 'wrench'],
            ['label' => 'Pending Approvals', 'description' => 'Review requests awaiting decision', 'href' => route('approvals.index'), 'icon' => 'shield'],
            ['label' => 'Add Notice', 'description' => 'Broadcast to the community', 'href' => route('notices.create'), 'icon' => 'megaphone'],
            ['label' => 'New Member', 'description' => 'Onboard a resident or staff', 'href' => route('members.index'), 'icon' => 'users'],
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    private function stats(?string $role): array
    {
        $societyId = active_society_id();
        $base = ['society_id' => $societyId];

        switch ($role) {
            case 'Owner':
            case 'Tenant':
                return [
                    'my_tickets' => $this->stat(Ticket::where($base)->where('user_id', auth()->id())->where('status', '!=', 'closed')->count()),
                    'my_bookings' => $this->stat(AmenityBooking::where($base)->where('user_id', auth()->id())->count()),
                    'notices' => $this->stat(Notice::where($base)->count()),
                ];

            case 'Guard':
                return [
                    'checkins_today' => $this->stat(VisitorManagement::where($base)->whereDate('date_of_visit', now()->toDateString())->count()),
                    'open_tickets' => $this->stat(Ticket::where($base)->where('status', '!=', 'closed')->count()),
                    'active_visitors' => $this->stat(VisitorManagement::where($base)->where('status', 'allowed')->count()),
                    'notices' => $this->stat(Notice::where($base)->count()),
                ];

            default:
                $commercial = society_is_type(['commercial', 'mixed']);
                $stats = [
                    'towers' => $this->stat(Tower::where($base)->count()),
                    'apartments' => $this->stat(ApartmentManagement::where($base)->count()),
                    'owners' => $this->stat($this->roleMemberCount('Owner')),
                    'tenants' => $this->stat(Tenant::where($base)->count()),
                    'maintenance_dues' => $this->stat(Maintenance::where($base)->count()),
                    'parking' => $this->stat(ParkingManagementSetting::where($base)->count()),
                    'open_tickets' => $this->stat(Ticket::where($base)->where('status', '!=', 'closed')->count()),
                    'notices' => $this->stat(Notice::where($base)->count()),
                ];

                if ($commercial) {
                    $stats['commercial_units'] = $this->stat(CommercialUnit::where($base)->count());
                    $stats['commercial_tenants'] = $this->stat(CommercialTenant::where($base)->count());
                    $stats['active_leases'] = $this->stat(LeaseAgreement::where($base)->where('status', 'active')->count());
                }

                $stats['pending_approvals'] = $this->stat(Approval::where($base)->where('status', 'pending')->count());
                $stats['open_work_orders'] = $this->stat(WorkOrder::where($base)->whereIn('status', ['open', 'assigned', 'in_progress'])->count());
                $stats['active_automations'] = $this->stat(Automation::where($base)->where('is_active', true)->count());

                return $stats;
        }
    }

    private function roleMemberCount(string $displayName): int
    {
        $societyId = active_society_id();
        $roleId = Role::where('society_id', $societyId)
            ->where('display_name', $displayName)
            ->value('id');

        if (! $roleId) {
            return 0;
        }

        return SocietyUser::where('society_id', $societyId)
            ->where('role_id', $roleId)
            ->distinct('user_id')
            ->count('user_id');
    }

    /**
     * @param  int|float  $value
     * @return array{value: int|float, label: string}
     */
    private function stat($value): array
    {
        return [
            'value' => (int) $value,
            'label' => (string) $value,
        ];
    }

    /**
     * @return array<string, array<int, array<string, mixed>>>
     */
    private function lists(?string $role): array
    {
        $societyId = active_society_id();
        $base = ['society_id' => $societyId];

        if (in_array($role, ['Owner', 'Tenant'], true)) {
            return [
                'tickets' => $this->ticketRows(Ticket::where($base)->where('user_id', auth()->id())->where('status', '!=', 'closed')->latest()->limit(6)->get()),
                'notices' => $this->noticeRows(Notice::where($base)->latest()->limit(6)->get()),
                'bookings' => $this->bookingRows(AmenityBooking::where($base)->latest()->limit(6)->get()),
            ];
        }

        $lists = [
            'rents_due' => $this->rentRows(Rent::where($base)->where('status', 'unpaid')->latest()->limit(6)->get()),
            'open_tickets' => $this->ticketRows(Ticket::where($base)->where('status', '!=', 'closed')->latest()->limit(6)->get()),
            'visitors_today' => $this->visitorRows(VisitorManagement::where($base)->whereDate('date_of_visit', now()->toDateString())->latest()->limit(6)->get()),
            'notices' => $this->noticeRows(Notice::where($base)->latest()->limit(6)->get()),
            'bookings' => $this->bookingRows(AmenityBooking::where($base)->latest()->limit(6)->get()),
            'pending_approvals' => $this->approvalRows(Approval::where($base)->where('status', 'pending')->latest()->limit(6)->get()),
            'work_orders' => $this->workOrderRows(WorkOrder::where($base)->whereIn('status', ['open', 'assigned', 'in_progress'])->latest()->limit(6)->get()),
            'amc_expiring' => $this->amcRows(AmcManagement::where($base)->where('status', 'active')->whereBetween('end_date', [now(), now()->addDays(30)])->latest('end_date')->limit(6)->get()),
        ];

        if ($role === 'Guard') {
            $lists = [
                'open_tickets' => $lists['open_tickets'],
                'visitors_today' => $lists['visitors_today'],
                'notices' => $lists['notices'],
                'sos' => $this->sosRows(SosAlert::where($base)->latest()->limit(6)->get()),
            ];
        }

        return $lists;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    private function charts(): array
    {
        $societyId = active_society_id();
        $base = ['society_id' => $societyId];

        $ticketStatuses = Ticket::where($base)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->all();

        $visitorDays = collect(range(0, 6))->map(function ($i) use ($base) {
            $day = now()->subDays($i)->toDateString();

            return [
                'date' => now()->subDays($i)->format('D'),
                'visitors' => VisitorManagement::where($base)->whereDate('date_of_visit', $day)->count(),
            ];
        })->reverse()->values();

        return [
            'tickets_by_status' => [
                ['name' => 'Open', 'value' => $ticketStatuses['open'] ?? 0],
                ['name' => 'Pending', 'value' => $ticketStatuses['pending'] ?? 0],
                ['name' => 'Resolved', 'value' => $ticketStatuses['resolved'] ?? 0],
                ['name' => 'Closed', 'value' => $ticketStatuses['closed'] ?? 0],
            ],
            'visitors_last_7_days' => $visitorDays->all(),
        ];
    }

    /**
     * @param  Collection<int, Rent>  $rents
     * @return array<int, array<string, mixed>>
     */
    private function rentRows($rents): array
    {
        return $rents->map(function (Rent $rent) {
            return [
                'id' => $rent->id,
                'title' => 'Rent · #R'.$rent->id,
                'subtitle' => ($rent->rent_for_month ?? '').' '.($rent->rent_for_year ?? ''),
                'meta' => number_format((float) $rent->rent_amount, 2),
            ];
        })->values()->all();
    }

    /**
     * @param  Collection<int, Ticket>  $tickets
     * @return array<int, array<string, mixed>>
     */
    private function ticketRows($tickets): array
    {
        return $tickets->map(function (Ticket $ticket) {
            return [
                'id' => $ticket->id,
                'title' => $ticket->subject,
                'subtitle' => '#T'.$ticket->id,
                'meta' => ucfirst((string) $ticket->status),
            ];
        })->values()->all();
    }

    /**
     * @param  Collection<int, VisitorManagement>  $visitors
     * @return array<int, array<string, mixed>>
     */
    private function visitorRows($visitors): array
    {
        return $visitors->map(function (VisitorManagement $visitor) {
            return [
                'id' => $visitor->id,
                'title' => $visitor->visitor_name,
                'subtitle' => $visitor->purpose_of_visit,
                'meta' => ucfirst((string) $visitor->status),
            ];
        })->values()->all();
    }

    /**
     * @param  Collection<int, Notice>  $notices
     * @return array<int, array<string, mixed>>
     */
    private function noticeRows($notices): array
    {
        return $notices->map(function (Notice $notice) {
            return [
                'id' => $notice->id,
                'title' => $notice->title,
                'subtitle' => $notice->created_at->diffForHumans(),
                'meta' => '',
            ];
        })->values()->all();
    }

    /**
     * @param  Collection<int, AmenityBooking>  $bookings
     * @return array<int, array<string, mixed>>
     */
    private function bookingRows($bookings): array
    {
        return $bookings->map(function (AmenityBooking $booking) {
            return [
                'id' => $booking->id,
                'title' => 'Amenity booking · #B'.$booking->id,
                'subtitle' => $booking->booking_date->toDateString(),
                'meta' => ucfirst((string) ($booking->status ?? 'requested')),
            ];
        })->values()->all();
    }

    /**
     * @param  Collection<int, SosAlert>  $alerts
     * @return array<int, array<string, mixed>>
     */
    private function sosRows($alerts): array
    {
        return $alerts->map(function (SosAlert $alert) {
            return [
                'id' => $alert->id,
                'title' => 'SOS #A'.$alert->id,
                'subtitle' => $alert->user_id ? 'User #'.$alert->user_id : 'Anonymous',
                'meta' => ucfirst((string) $alert->status),
            ];
        })->values()->all();
    }

    /**
     * @param  Collection<int, Approval>  $approvals
     * @return array<int, array<string, mixed>>
     */
    private function approvalRows($approvals): array
    {
        return $approvals->map(function (Approval $approval) {
            return [
                'id' => $approval->id,
                'title' => $approval->title,
                'subtitle' => ucfirst((string) $approval->type),
                'meta' => ucfirst((string) $approval->status),
            ];
        })->values()->all();
    }

    /**
     * @param  Collection<int, WorkOrder>  $workOrders
     * @return array<int, array<string, mixed>>
     */
    private function workOrderRows($workOrders): array
    {
        return $workOrders->map(function (WorkOrder $workOrder) {
            return [
                'id' => $workOrder->id,
                'title' => $workOrder->title,
                'subtitle' => '#WO'.$workOrder->id,
                'meta' => ucfirst((string) $workOrder->status),
            ];
        })->values()->all();
    }

    /**
     * @param  Collection<int, AmcManagement>  $amcs
     * @return array<int, array<string, mixed>>
     */
    private function amcRows($amcs): array
    {
        return $amcs->map(function (AmcManagement $amc) {
            return [
                'id' => $amc->id,
                'title' => $amc->service_name ?? 'AMC #'.$amc->id,
                'subtitle' => 'Expires '.($amc->end_date?->toDateString() ?? '—'),
                'meta' => number_format((float) ($amc->cost ?? 0), 2),
            ];
        })->values()->all();
    }
}
