<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\Amenities;
use App\Models\BookAmenity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AmenityBookingController extends RoleAwareApiController
{
    public function amenities(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $this->authorizeRole(['Owner', 'Tenant', 'Admin', 'Manager']);

        $amenities = Amenities::where('society_id', $society->id)
            ->where('status', 'available')
            ->get();

        return $this->success($amenities, 'Amenities fetched');
    }

    public function store(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $this->authorizeRole(['Owner', 'Tenant']);

        $validated = $request->validate([
            'amenity_id' => 'required|integer|exists:amenities,id',
            'booking_date' => 'required|date',
            'booking_time' => 'required|string|max:255',
            'persons' => 'required|integer|min:1',
            'booking_type' => 'nullable|string|max:255',
        ]);

        $amenity = Amenities::where('society_id', $society->id)
            ->where('id', $validated['amenity_id'])
            ->where('status', 'available')
            ->first();

        if (!$amenity) {
            return $this->notFound('Amenity not found in this society.');
        }

        $booking = new BookAmenity();
        $booking->society_id = $society->id;
        $booking->amenity_id = $amenity->id;
        $booking->booked_by = $this->authUser()->id;
        $booking->booking_date = $validated['booking_date'];
        $booking->booking_time = $validated['booking_time'];
        $booking->persons = $validated['persons'];
        $booking->booking_type = $validated['booking_type'] ?? 'single';
        $booking->unique_id = (string) \Illuminate\Support\Str::uuid();
        $booking->save();

        return $this->created($booking, 'Amenity booked successfully');
    }

    public function myBookings(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $bookings = BookAmenity::where('society_id', $society->id)
            ->where('booked_by', $this->authUser()->id)
            ->with('amenity')
            ->orderByDesc('id')
            ->get();

        return $this->success($bookings, 'My bookings fetched');
    }
}
