<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\DailyHelpBooking;
use App\Models\DailyHelpWorker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DailyHelpController extends RoleAwareApiController
{
    public function workers(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $query = DailyHelpWorker::where('society_id', $society->id)->active();

        if ($request->has('service_type')) {
            $query->byServiceType((string) $request->query('service_type'));
        }

        $items = $query->orderBy('name')
            ->paginate((int) $request->get('per_page', 20));

        return $this->paginated($items);
    }

    public function book(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $validated = $request->validate([
            'worker_id' => 'required|integer|exists:daily_help_workers,id',
            'booking_date' => 'required|date',
            'preferred_time' => 'required|string|max:10',
            'amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $worker = DailyHelpWorker::where('society_id', $society->id)->find($validated['worker_id']);

        if (! $worker) {
            return $this->notFound('Worker not found.');
        }

        $booking = DailyHelpBooking::create([
            'society_id' => $society->id,
            'worker_id' => $worker->id,
            'user_id' => $this->authUser()->id,
            'booking_date' => $validated['booking_date'],
            'preferred_time' => $validated['preferred_time'],
            'amount' => $validated['amount'] ?? $worker->rate_per_visit,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return $this->created($booking->load('worker'), 'Daily help booked');
    }

    public function myBookings(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $query = DailyHelpBooking::with('worker', 'apartment')
            ->where('society_id', $society->id);

        if ($this->roleIs(['Owner', 'Tenant'])) {
            $query->where('user_id', $this->authUser()->id);
        }

        $items = $query->orderByDesc('booking_date')
            ->paginate((int) $request->get('per_page', 15));

        return $this->paginated($items);
    }
}
