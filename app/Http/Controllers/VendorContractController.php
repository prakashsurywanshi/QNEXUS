<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Vendor;
use App\Models\VendorContract;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VendorContractController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('accounting/vendor-contracts/index', [
            'contracts' => VendorContract::with(['vendor'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('accounting/vendor-contracts/create', [
            'vendors' => Vendor::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateContract($request);

        VendorContract::create([
            'society_id' => active_society_id(),
            'vendor_id' => $data['vendor_id'],
            'contract_number' => $data['contract_number'],
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'contract_value' => $data['contract_value'] ?? 0,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'status' => $data['status'],
            'payment_terms' => $data['payment_terms'] ?? null,
            'sla_terms' => $data['sla_terms'] ?? [],
            'auto_renew' => $data['auto_renew'] ?? false,
        ]);

        AuditLog::record("Created vendor contract: {$data['contract_number']}");

        return redirect()->route('vendor-contracts.index');
    }

    public function edit(VendorContract $vendorContract): Response
    {
        return Inertia::render('accounting/vendor-contracts/edit', [
            'contract' => $vendorContract->load('vendor'),
            'vendors' => Vendor::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, VendorContract $vendorContract): RedirectResponse
    {
        $data = $this->validateContract($request);

        $vendorContract->update([
            'vendor_id' => $data['vendor_id'],
            'contract_number' => $data['contract_number'],
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'contract_value' => $data['contract_value'] ?? 0,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'status' => $data['status'],
            'payment_terms' => $data['payment_terms'] ?? null,
            'sla_terms' => $data['sla_terms'] ?? [],
            'auto_renew' => $data['auto_renew'] ?? false,
        ]);

        AuditLog::record("Updated vendor contract: {$data['contract_number']}", $vendorContract);

        return redirect()->route('vendor-contracts.index');
    }

    public function destroy(VendorContract $vendorContract): RedirectResponse
    {
        AuditLog::record("Deleted vendor contract: {$vendorContract->contract_number}");
        $vendorContract->delete();

        return redirect()->route('vendor-contracts.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateContract(Request $request): array
    {
        return $request->validate([
            'vendor_id' => ['required', 'exists:vendors,id'],
            'contract_number' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'contract_value' => ['nullable', 'numeric', 'min:0'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'status' => ['required', Rule::in(['draft', 'active', 'expired', 'terminated'])],
            'payment_terms' => ['nullable', 'string'],
            'sla_terms' => ['nullable', 'array'],
            'auto_renew' => ['nullable', 'boolean'],
        ]);
    }
}
