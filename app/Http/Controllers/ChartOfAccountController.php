<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\ChartOfAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ChartOfAccountController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('accounting/chart-of-accounts/index', [
            'accounts' => ChartOfAccount::with(['parent'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('accounting/chart-of-accounts/create', [
            'parentAccounts' => ChartOfAccount::where('society_id', active_society_id())->orderBy('account_name')->get(['id', 'account_name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateChart($request);

        ChartOfAccount::create([
            'society_id' => active_society_id(),
            'account_code' => $data['account_code'],
            'account_name' => $data['account_name'],
            'account_type' => $data['account_type'],
            'parent_id' => $data['parent_id'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        AuditLog::record("Created chart of account: {$data['account_name']}");

        return redirect()->route('chart-of-accounts.index');
    }

    public function edit(ChartOfAccount $chartOfAccount): Response
    {
        return Inertia::render('accounting/chart-of-accounts/edit', [
            'account' => $chartOfAccount,
            'parentAccounts' => ChartOfAccount::where('society_id', active_society_id())
                ->where('id', '!=', $chartOfAccount->id)
                ->orderBy('account_name')
                ->get(['id', 'account_name']),
        ]);
    }

    public function update(Request $request, ChartOfAccount $chartOfAccount): RedirectResponse
    {
        $data = $this->validateChart($request);

        $chartOfAccount->update([
            'account_code' => $data['account_code'],
            'account_name' => $data['account_name'],
            'account_type' => $data['account_type'],
            'parent_id' => $data['parent_id'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        AuditLog::record("Updated chart of account: {$data['account_name']}", $chartOfAccount);

        return redirect()->route('chart-of-accounts.index');
    }

    public function destroy(ChartOfAccount $chartOfAccount): RedirectResponse
    {
        AuditLog::record("Deleted chart of account: {$chartOfAccount->account_name}");
        $chartOfAccount->delete();

        return redirect()->route('chart-of-accounts.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateChart(Request $request): array
    {
        return $request->validate([
            'account_code' => ['required', 'string', 'max:50'],
            'account_name' => ['required', 'string', 'max:255'],
            'account_type' => ['required', Rule::in(['asset', 'liability', 'equity', 'income', 'expense'])],
            'parent_id' => ['nullable', 'exists:chart_of_accounts,id'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
