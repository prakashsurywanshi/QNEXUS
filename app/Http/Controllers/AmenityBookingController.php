<?php

namespace App\Http\Controllers;

use App\Models\AmenityBooking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AmenityBookingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('amenity-bookings/index', [
            'bookings' => AmenityBooking::with(['user'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('amenity-bookings/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'amenity_name' => ['required', 'string', 'max:255'],
            'booking_date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'guest_count' => ['nullable', 'integer'],
            'notes' => ['nullable', 'string'],
        ]);

        AmenityBooking::create($data + [
            'society_id' => active_society_id(),
            'user_id' => auth()->id(),
            'status' => 'pending',
        ]);

        return redirect()->route('amenity-bookings.index');
    }

    public function edit(AmenityBooking $booking): Response
    {
        return Inertia::render('amenity-bookings/edit', [
            'booking' => $booking,
        ]);
    }

    public function update(Request $request, AmenityBooking $booking): RedirectResponse
    {
        $data = $request->validate([
            'amenity_name' => ['required', 'string', 'max:255'],
            'booking_date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'guest_count' => ['nullable', 'integer'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,approved,rejected,cancelled'],
        ]);

        if ($data['status'] === 'approved') {
            $data['approved_by'] = auth()->id();
        }

        $booking->update($data);

        return redirect()->route('amenity-bookings.index');
    }

    public function destroy(AmenityBooking $booking): RedirectResponse
    {
        $booking->delete();

        return redirect()->route('amenity-bookings.index');
    }
}
