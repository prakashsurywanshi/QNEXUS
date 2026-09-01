<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Models\CommercialTenant;
use App\Models\CommercialUnit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CommercialUnitController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('commercial-units/index', [
            'units' => CommercialUnit::with(['building', 'commercialTenant'])->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('commercial-units/create', [
            'buildings' => Building::get(['id', 'name']),
            'commercialTenants' => CommercialTenant::get(['id', 'company_name', 'unit_number']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        CommercialUnit::create($this->validateUnit($request) + [
            'society_id' => active_society_id(),
        ]);

        return redirect()->route('commercial-units.index');
    }

    public function edit(CommercialUnit $commercialUnit): Response
    {
        return Inertia::render('commercial-units/edit', [
            'unit' => $commercialUnit,
            'buildings' => Building::get(['id', 'name']),
            'commercialTenants' => CommercialTenant::get(['id', 'company_name', 'unit_number']),
        ]);
    }

    public function update(Request $request, CommercialUnit $commercialUnit): RedirectResponse
    {
        $commercialUnit->update($this->validateUnit($request));

        return redirect()->route('commercial-units.index');
    }

    public function destroy(CommercialUnit $commercialUnit): RedirectResponse
    {
        $commercialUnit->delete();

        return redirect()->route('commercial-units.index');
    }

    private function validateUnit(Request $request): array
    {
        return $request->validate([
            'building_id' => ['nullable', 'integer', 'exists:buildings,id'],
            'commercial_tenant_id' => ['nullable', 'integer', 'exists:commercial_tenants,id'],
            'unit_number' => ['required', 'string', 'max:255'],
            'floor' => ['nullable', 'string', 'max:255'],
            'area_sqft' => ['nullable', 'numeric', 'min:0'],
            'unit_type' => ['required', Rule::in(['office', 'retail', 'warehouse', 'other'])],
            'status' => ['required', Rule::in(['vacant', 'occupied', 'under_maintenance'])],
            'monthly_rent' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}