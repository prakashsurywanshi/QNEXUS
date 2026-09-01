<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CommercialTenant;
use App\Models\LeaseAgreement;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LeaseAgreementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('lease-agreements/index', [
            'leases' => LeaseAgreement::with(['commercialTenant', 'user'])->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('lease-agreements/create', [
            'commercialTenants' => CommercialTenant::get(['id', 'company_name', 'unit_number']),
            'users' => User::where('society_id', active_society_id())->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        LeaseAgreement::create($this->validateLease($request) + [
            'society_id' => active_society_id(),
        ]);

        return redirect()->route('lease-agreements.index');
    }

    public function edit(LeaseAgreement $leaseAgreement): Response
    {
        return Inertia::render('lease-agreements/edit', [
            'lease' => $leaseAgreement,
            'commercialTenants' => CommercialTenant::get(['id', 'company_name', 'unit_number']),
            'users' => User::where('society_id', active_society_id())->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, LeaseAgreement $leaseAgreement): RedirectResponse
    {
        $leaseAgreement->update($this->validateLease($request));

        return redirect()->route('lease-agreements.index');
    }

    public function destroy(LeaseAgreement $leaseAgreement): RedirectResponse
    {
        $leaseAgreement->delete();

        return redirect()->route('lease-agreements.index');
    }

    private function validateLease(Request $request): array
    {
        return $request->validate([
            'commercial_tenant_id' => ['required', 'integer', 'exists:commercial_tenants,id'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'lease_number' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'monthly_rent' => ['required', 'numeric', 'min:0'],
            'security_deposit' => ['nullable', 'numeric', 'min:0'],
            'cam_charges' => ['nullable', 'numeric', 'min:0'],
            'rent_escalation_type' => ['required', Rule::in(['fixed', 'percentage'])],
            'escalation_value' => ['nullable', 'numeric', 'min:0', 'max:999.99'],
            'escalation_frequency_months' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', Rule::in(['draft', 'active', 'expired', 'terminated'])],
            'notes' => ['nullable', 'string'],
        ]);
    }
}