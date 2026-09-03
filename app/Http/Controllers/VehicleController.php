<?php

namespace App\Http\Controllers;

use App\Models\ApartmentManagement;
use App\Models\AuditLog;
use App\Models\ParkingManagementSetting;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('vehicles/index', [
            'vehicles' => Vehicle::with(['apartment', 'owner', 'parkingSlot'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('vehicles/create', [
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
            'parkingSlots' => ParkingManagementSetting::where('society_id', active_society_id())->orderBy('parking_code')->get(['id', 'parking_code', 'status']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateVehicle($request);

        Vehicle::create([
            'society_id' => active_society_id(),
            'apartment_management_id' => $data['apartment_management_id'] ?? null,
            'owner_user_id' => $data['owner_user_id'] ?? null,
            'vehicle_number' => $data['vehicle_number'],
            'vehicle_type' => $data['vehicle_type'],
            'make' => $data['make'] ?? null,
            'model' => $data['model'] ?? null,
            'color' => $data['color'] ?? null,
            'sticker_number' => $data['sticker_number'] ?? null,
            'parking_management_id' => $data['parking_management_id'] ?? null,
            'is_primary' => $data['is_primary'] ?? false,
        ]);

        AuditLog::record("Registered vehicle: {$data['vehicle_number']}");

        return redirect()->route('vehicles.index');
    }

    public function edit(Vehicle $vehicle): Response
    {
        return Inertia::render('vehicles/edit', [
            'vehicle' => $vehicle->load(['apartment', 'owner', 'parkingSlot']),
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
            'parkingSlots' => ParkingManagementSetting::where('society_id', active_society_id())->orderBy('parking_code')->get(['id', 'parking_code', 'status']),
        ]);
    }

    public function update(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $data = $this->validateVehicle($request);

        $vehicle->update([
            'apartment_management_id' => $data['apartment_management_id'] ?? null,
            'owner_user_id' => $data['owner_user_id'] ?? null,
            'vehicle_number' => $data['vehicle_number'],
            'vehicle_type' => $data['vehicle_type'],
            'make' => $data['make'] ?? null,
            'model' => $data['model'] ?? null,
            'color' => $data['color'] ?? null,
            'sticker_number' => $data['sticker_number'] ?? null,
            'parking_management_id' => $data['parking_management_id'] ?? null,
            'is_primary' => $data['is_primary'] ?? false,
        ]);

        AuditLog::record("Updated vehicle: {$data['vehicle_number']}", $vehicle);

        return redirect()->route('vehicles.index');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        AuditLog::record("Removed vehicle: {$vehicle->vehicle_number}", $vehicle);

        $vehicle->delete();

        return redirect()->route('vehicles.index');
    }

    /**
     * @return array<string, mixed>
     */
    protected function validateVehicle(Request $request): array
    {
        return $request->validate([
            'apartment_management_id' => ['nullable', 'exists:apartment_managements,id'],
            'owner_user_id' => ['nullable', 'exists:users,id'],
            'vehicle_number' => ['required', 'string', 'max:255'],
            'vehicle_type' => ['required', Rule::in(['two_wheeler', 'four_wheeler', 'commercial'])],
            'make' => ['nullable', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'sticker_number' => ['nullable', 'string', 'max:255'],
            'parking_management_id' => ['nullable', 'exists:parking_managements,id'],
            'is_primary' => ['nullable', 'boolean'],
        ]);
    }
}
