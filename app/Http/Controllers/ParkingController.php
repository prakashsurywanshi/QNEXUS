<?php

namespace App\Http\Controllers;

use App\Models\ParkingManagementSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParkingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('parking/index', [
            'parkings' => ParkingManagementSetting::latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('parking/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'parking_code' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:available,not_available'],
        ]);

        ParkingManagementSetting::create($data + ['society_id' => active_society_id()]);

        return redirect()->route('parking.index');
    }

    public function edit(ParkingManagementSetting $parking): Response
    {
        return Inertia::render('parking/edit', [
            'parking' => $parking,
        ]);
    }

    public function update(Request $request, ParkingManagementSetting $parking): RedirectResponse
    {
        $data = $request->validate([
            'parking_code' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:available,not_available'],
        ]);

        $parking->update($data);

        return redirect()->route('parking.index');
    }

    public function destroy(ParkingManagementSetting $parking): RedirectResponse
    {
        $parking->delete();

        return redirect()->route('parking.index');
    }
}
