<?php

namespace App\Http\Controllers;

use App\Models\AmcManagement;
use App\Models\AssetManagement;
use App\Models\AuditLog;
use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AmcManagementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('amc/index', [
            'amcs' => AmcManagement::with(['asset', 'vendor'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('amc/create', [
            'assets' => AssetManagement::orderBy('name')->get(['id', 'name']),
            'vendors' => Vendor::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'asset_id' => ['nullable', 'exists:asset_managements,id'],
            'vendor_id' => ['nullable', 'exists:vendors,id'],
            'reference_no' => ['nullable', 'string', 'max:255'],
            'service_name' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'frequency' => ['required', 'in:one_time,monthly,quarterly,half_yearly,yearly'],
            'status' => ['required', 'in:active,expired,cancelled'],
            'notes' => ['nullable', 'string'],
        ]);

        AmcManagement::create([
            'society_id' => active_society_id(),
            'asset_id' => $data['asset_id'] ?? null,
            'vendor_id' => $data['vendor_id'] ?? null,
            'reference_no' => $data['reference_no'] ?? null,
            'service_name' => $data['service_name'] ?? null,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'cost' => $data['cost'] ?? null,
            'frequency' => $data['frequency'],
            'status' => $data['status'],
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record("Created AMC: {$data['service_name']}");

        return redirect()->route('amc.index');
    }

    public function edit(AmcManagement $amc): Response
    {
        return Inertia::render('amc/edit', [
            'amc' => $amc->load(['asset', 'vendor']),
            'assets' => AssetManagement::orderBy('name')->get(['id', 'name']),
            'vendors' => Vendor::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, AmcManagement $amc): RedirectResponse
    {
        $data = $request->validate([
            'asset_id' => ['nullable', 'exists:asset_managements,id'],
            'vendor_id' => ['nullable', 'exists:vendors,id'],
            'reference_no' => ['nullable', 'string', 'max:255'],
            'service_name' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'frequency' => ['required', 'in:one_time,monthly,quarterly,half_yearly,yearly'],
            'status' => ['required', 'in:active,expired,cancelled'],
            'notes' => ['nullable', 'string'],
        ]);

        $amc->update([
            'asset_id' => $data['asset_id'] ?? null,
            'vendor_id' => $data['vendor_id'] ?? null,
            'reference_no' => $data['reference_no'] ?? null,
            'service_name' => $data['service_name'] ?? null,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'cost' => $data['cost'] ?? null,
            'frequency' => $data['frequency'],
            'status' => $data['status'],
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record("Updated AMC: {$data['service_name']}", $amc);

        return redirect()->route('amc.index');
    }

    public function destroy(AmcManagement $amc): RedirectResponse
    {
        AuditLog::record("Deleted AMC: {$amc->service_name}");
        $amc->delete();

        return redirect()->route('amc.index');
    }
}
