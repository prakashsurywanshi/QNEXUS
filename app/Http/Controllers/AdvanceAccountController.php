<?php

namespace App\Http\Controllers;

use App\Models\AdvanceAccount;
use App\Models\ApartmentManagement;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdvanceAccountController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('accounting/advance-accounts/index', [
            'accounts' => AdvanceAccount::with(['apartment'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('accounting/advance-accounts/create', [
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateAccount($request);

        AdvanceAccount::create([
            'society_id' => active_society_id(),
            'apartment_id' => $data['apartment_id'] ?? null,
            'balance' => $data['balance'] ?? 0,
        ]);

        AuditLog::record('Created advance account');

        return redirect()->route('advance-accounts.index');
    }

    public function edit(AdvanceAccount $advanceAccount): Response
    {
        return Inertia::render('accounting/advance-accounts/edit', [
            'account' => $advanceAccount->load('apartment'),
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
        ]);
    }

    public function update(Request $request, AdvanceAccount $advanceAccount): RedirectResponse
    {
        $data = $this->validateAccount($request);

        $advanceAccount->update([
            'apartment_id' => $data['apartment_id'] ?? null,
            'balance' => $data['balance'] ?? 0,
            'last_updated' => now(),
        ]);

        AuditLog::record('Updated advance account', $advanceAccount);

        return redirect()->route('advance-accounts.index');
    }

    public function destroy(AdvanceAccount $advanceAccount): RedirectResponse
    {
        AuditLog::record('Deleted advance account');
        $advanceAccount->delete();

        return redirect()->route('advance-accounts.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateAccount(Request $request): array
    {
        return $request->validate([
            'apartment_id' => ['nullable', 'exists:apartment_managements,id'],
            'balance' => ['nullable', 'numeric', 'min:0'],
        ]);
    }
}
