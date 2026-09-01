<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Models\CommercialTenant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CommercialTenantController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('commercial-tenants/index', [
            'tenants' => CommercialTenant::with(['building', 'user'])->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('commercial-tenants/create', [
            'buildings' => Building::get(['id', 'name']),
            'users' => User::where('society_id', active_society_id())->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        CommercialTenant::create($this->validateTenant($request) + [
            'society_id' => active_society_id(),
        ]);

        return redirect()->route('commercial-tenants.index');
    }

    public function edit(CommercialTenant $commercialTenant): Response
    {
        return Inertia::render('commercial-tenants/edit', [
            'tenant' => $commercialTenant,
            'buildings' => Building::get(['id', 'name']),
            'users' => User::where('society_id', active_society_id())->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, CommercialTenant $commercialTenant): RedirectResponse
    {
        $commercialTenant->update($this->validateTenant($request));

        return redirect()->route('commercial-tenants.index');
    }

    public function destroy(CommercialTenant $commercialTenant): RedirectResponse
    {
        $commercialTenant->delete();

        return redirect()->route('commercial-tenants.index');
    }

    private function validateTenant(Request $request): array
    {
        return $request->validate([
            'building_id' => ['nullable', 'integer', 'exists:buildings,id'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'unit_number' => ['required', 'string', 'max:255'],
            'unit_area' => ['nullable', 'numeric', 'min:0'],
            'rent_amount' => ['nullable', 'numeric', 'min:0'],
            'security_deposit' => ['nullable', 'numeric', 'min:0'],
            'unit_type' => ['required', Rule::in(['office', 'retail', 'warehouse', 'other'])],
            'status' => ['required', Rule::in(['vacant', 'occupied', 'under_maintenance'])],
        ]);
    }
}