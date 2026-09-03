<?php

namespace App\Http\Controllers;

use App\Models\AmenityBooking;
use App\Models\ApartmentManagement;
use App\Models\Event;
use App\Models\Gatepass;
use App\Models\MaintenanceApartment;
use App\Models\Payment;
use App\Models\Poll;
use App\Models\Staff;
use App\Models\Tenant;
use App\Models\Ticket;
use App\Models\Vehicle;
use App\Models\VisitorManagement;
use App\Models\WorkOrder;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        $societyId = active_society_id();

        return Inertia::render('analytics/index', [
            'occupancy' => $this->occupancy($societyId),
            'tickets' => $this->tickets($societyId),
            'workOrders' => $this->workOrders($societyId),
            'visitors' => $this->visitors($societyId),
            'finance' => $this->finance($societyId),
            'community' => $this->community($societyId),
            'operations' => $this->operations($societyId),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function occupancy(?int $societyId): array
    {
        $total = ApartmentManagement::where('society_id', $societyId)->count();

        $byStatus = ApartmentManagement::where('society_id', $societyId)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $occupied = ($byStatus['occupied'] ?? 0) + ($byStatus['rented'] ?? 0);
        $vacant = $total - $occupied;
        $rate = $total > 0 ? round(($occupied / $total) * 100) : 0;

        return [
            'total' => $total,
            'occupied' => $occupied,
            'rented' => $byStatus['rented'] ?? 0,
            'vacant' => $vacant,
            'owner_occupied' => $byStatus['occupied'] ?? 0,
            'occupancy_rate' => $rate,
            'tenants' => Tenant::where('society_id', $societyId)->count(),
            'defaulters' => ApartmentManagement::where('society_id', $societyId)->where('is_defaulter', true)->count(),
            'byStatus' => $this->mapByKey($byStatus, ['not_sold', 'occupied', 'available_for_rent', 'rented']),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function tickets(?int $societyId): array
    {
        $byStatus = Ticket::where('society_id', $societyId)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $total = array_sum($byStatus);
        $open = ($byStatus['open'] ?? 0) + ($byStatus['pending'] ?? 0);

        return [
            'total' => $total,
            'open' => $open,
            'resolution_rate' => $total > 0 ? round((($byStatus['closed'] ?? 0) / $total) * 100) : 0,
            'byStatus' => $this->mapByKey($byStatus, ['open', 'pending', 'resolved', 'closed']),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function workOrders(?int $societyId): array
    {
        $byStatus = WorkOrder::where('society_id', $societyId)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $byPriority = WorkOrder::where('society_id', $societyId)
            ->selectRaw('priority, count(*) as total')
            ->groupBy('priority')
            ->pluck('total', 'priority')
            ->toArray();

        $total = array_sum($byStatus);
        $open = ($byStatus['open'] ?? 0) + ($byStatus['assigned'] ?? 0) + ($byStatus['in_progress'] ?? 0);

        return [
            'total' => $total,
            'open' => $open,
            'completed' => $byStatus['completed'] ?? 0,
            'byStatus' => $this->mapByKey($byStatus, ['open', 'assigned', 'in_progress', 'completed', 'verified', 'closed']),
            'byPriority' => $this->mapByKey($byPriority, ['low', 'medium', 'high', 'urgent']),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function visitors(?int $societyId): array
    {
        $byStatus = VisitorManagement::where('society_id', $societyId)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $byPurpose = VisitorManagement::where('society_id', $societyId)
            ->whereNotNull('purpose_of_visit')
            ->selectRaw('purpose_of_visit, count(*) as total')
            ->groupBy('purpose_of_visit')
            ->orderByDesc('total')
            ->limit(8)
            ->pluck('total', 'purpose_of_visit')
            ->toArray();

        $trend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $trend[] = [
                'date' => now()->subDays($i)->format('D'),
                'visitors' => VisitorManagement::where('society_id', $societyId)
                    ->whereDate('date_of_visit', $date)
                    ->count(),
            ];
        }

        return [
            'total' => array_sum($byStatus),
            'checkedIn' => ($byStatus['checked_in'] ?? 0) + ($byStatus['allowed'] ?? 0),
            'byStatus' => $this->mapByKey($byStatus, ['pending', 'allowed', 'not_allowed', 'checked_in', 'checked_out']),
            'byPurpose' => $byPurpose,
            'trend' => $trend,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function finance(?int $societyId): array
    {
        $billedApartmentIds = ApartmentManagement::where('society_id', $societyId)->pluck('id');
        $billed = (float) MaintenanceApartment::whereIn('apartment_management_id', $billedApartmentIds)->sum('cost');
        $collected = (float) Payment::where('society_id', $societyId)->sum('amount');
        $arrears = (float) MaintenanceApartment::whereIn('apartment_management_id', $billedApartmentIds)->where('paid_status', 'unpaid')->sum('arrears_amount');

        $byMethod = Payment::where('society_id', $societyId)
            ->selectRaw('payment_method, sum(amount) as total')
            ->groupBy('payment_method')
            ->pluck('total', 'payment_method')
            ->toArray();

        return [
            'billed' => round($billed, 2),
            'collected' => round($collected, 2),
            'pending' => round(max(0, $billed - $collected), 2),
            'arrears' => round($arrears, 2),
            'collection_rate' => $billed > 0 ? round(($collected / $billed) * 100) : 0,
            'byMethod' => $byMethod,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function community(?int $societyId): array
    {
        return [
            'events' => Event::where('society_id', $societyId)->count(),
            'polls' => Poll::where('society_id', $societyId)->count(),
            'amenityBookings' => AmenityBooking::where('society_id', $societyId)->count(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function operations(?int $societyId): array
    {
        $vehiclesByType = Vehicle::where('society_id', $societyId)
            ->selectRaw('vehicle_type, count(*) as total')
            ->groupBy('vehicle_type')
            ->pluck('total', 'vehicle_type')
            ->toArray();

        $staffByDesignation = Staff::where('society_id', $societyId)
            ->selectRaw('designation, count(*) as total')
            ->groupBy('designation')
            ->orderByDesc('total')
            ->limit(8)
            ->pluck('total', 'designation')
            ->toArray();

        $gatepassByType = Gatepass::where('society_id', $societyId)
            ->selectRaw('gatepass_type, count(*) as total')
            ->groupBy('gatepass_type')
            ->pluck('total', 'gatepass_type')
            ->toArray();

        return [
            'vehicles' => Vehicle::where('society_id', $societyId)->count(),
            'vehiclesByType' => $this->mapByKey($vehiclesByType, ['two_wheeler', 'four_wheeler', 'commercial']),
            'staff' => Staff::where('society_id', $societyId)->count(),
            'activeStaff' => Staff::where('society_id', $societyId)->where('is_active', true)->count(),
            'staffByDesignation' => $staffByDesignation,
            'gatepasses' => Gatepass::where('society_id', $societyId)->count(),
            'gatepassByType' => $this->mapByKey($gatepassByType, ['in', 'out']),
        ];
    }

    /**
     * @param  array<string, int>  $data
     * @param  array<int, string>  $keys
     * @return array<int, array{name: string, value: int}>
     */
    protected function mapByKey(array $data, array $keys): array
    {
        $result = [];
        foreach ($keys as $key) {
            $result[] = [
                'name' => $key,
                'value' => $data[$key] ?? 0,
            ];
        }

        return $result;
    }
}
