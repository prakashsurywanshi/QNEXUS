<?php

namespace App\Http\Controllers;

use App\Models\Amenities;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AmenityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('amenities/index', [
            'amenities' => Amenities::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('amenities/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateAmenity($request);

        Amenities::create($data + ['society_id' => active_society_id()]);

        return redirect()->route('amenities.index');
    }

    public function edit(Amenities $amenity): Response
    {
        return Inertia::render('amenities/edit', [
            'amenity' => $amenity,
        ]);
    }

    public function update(Request $request, Amenities $amenity): RedirectResponse
    {
        $data = $this->validateAmenity($request);

        $amenity->update($data);

        return redirect()->route('amenities.index');
    }

    public function destroy(Amenities $amenity): RedirectResponse
    {
        $amenity->delete();

        return redirect()->route('amenities.index');
    }

    private function validateAmenity(Request $request): array
    {
        return $request->validate([
            'amenities_name' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['available', 'not_available'])],
            'booking_status' => ['boolean'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'slot_time' => ['nullable', 'integer', 'min:5'],
            'multiple_booking_status' => ['boolean'],
            'number_of_person' => ['nullable', 'integer', 'min:1'],
        ]);
    }
}
