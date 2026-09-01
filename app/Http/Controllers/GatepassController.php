<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ApartmentManagement;
use App\Models\Gatepass;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GatepassController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('gatepasses/index', [
            'gatepasses' => Gatepass::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('gatepasses/create', [
            'apartments' => ApartmentManagement::get(['id', 'apartment_number']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $gatepass = Gatepass::create($this->validateGatepass($request) + [
            'society_id' => active_society_id(),
            'user_id' => user()->id,
        ]);

        return redirect()->route('gatepasses.index');
    }

    public function edit(Gatepass $gatepass): Response
    {
        return Inertia::render('gatepasses/edit', [
            'gatepass' => $gatepass,
            'apartments' => ApartmentManagement::get(['id', 'apartment_number']),
        ]);
    }

    public function update(Request $request, Gatepass $gatepass): RedirectResponse
    {
        $gatepass->update($this->validateGatepass($request));

        return redirect()->route('gatepasses.index');
    }

    public function destroy(Gatepass $gatepass): RedirectResponse
    {
        $gatepass->delete();

        return redirect()->route('gatepasses.index');
    }

    private function validateGatepass(Request $request): array
    {
        return $request->validate([
            'item_description' => ['required', 'string', 'max:255'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'gatepass_type' => ['required', Rule::in(['in', 'out'])],
            'vehicle_number' => ['nullable', 'string', 'max:255'],
            'driver_name' => ['nullable', 'string', 'max:255'],
            'driver_phone' => ['nullable', 'string', 'max:20'],
            'apartment_id' => ['nullable', 'integer', 'exists:apartment_managements,id'],
            'status' => ['required', Rule::in(['pending', 'approved', 'rejected', 'completed'])],
        ]);
    }
}
