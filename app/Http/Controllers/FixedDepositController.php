<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\FixedDeposit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FixedDepositController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('finance/fixed-deposits/index', [
            'deposits' => FixedDeposit::latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('finance/fixed-deposits/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateDeposit($request);

        FixedDeposit::create([
            'society_id' => active_society_id(),
            'bank_name' => $data['bank_name'],
            'fd_number' => $data['fd_number'],
            'amount' => $data['amount'],
            'interest_rate' => $data['interest_rate'],
            'start_date' => $data['start_date'],
            'maturity_date' => $data['maturity_date'],
            'status' => $data['status'],
            'renewal_action' => $data['renewal_action'] ?? null,
        ]);

        AuditLog::record("Created fixed deposit: {$data['fd_number']}");

        return redirect()->route('fixed-deposits.index');
    }

    public function edit(FixedDeposit $fixedDeposit): Response
    {
        return Inertia::render('finance/fixed-deposits/edit', [
            'deposit' => $fixedDeposit,
        ]);
    }

    public function update(Request $request, FixedDeposit $fixedDeposit): RedirectResponse
    {
        $data = $this->validateDeposit($request);

        $fixedDeposit->update([
            'bank_name' => $data['bank_name'],
            'fd_number' => $data['fd_number'],
            'amount' => $data['amount'],
            'interest_rate' => $data['interest_rate'],
            'start_date' => $data['start_date'],
            'maturity_date' => $data['maturity_date'],
            'status' => $data['status'],
            'renewal_action' => $data['renewal_action'] ?? null,
        ]);

        AuditLog::record("Updated fixed deposit: {$data['fd_number']}", $fixedDeposit);

        return redirect()->route('fixed-deposits.index');
    }

    public function destroy(FixedDeposit $fixedDeposit): RedirectResponse
    {
        AuditLog::record("Deleted fixed deposit: {$fixedDeposit->fd_number}");
        $fixedDeposit->delete();

        return redirect()->route('fixed-deposits.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateDeposit(Request $request): array
    {
        return $request->validate([
            'bank_name' => ['required', 'string', 'max:255'],
            'fd_number' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'interest_rate' => ['required', 'numeric', 'min:0'],
            'start_date' => ['required', 'date'],
            'maturity_date' => ['required', 'date'],
            'status' => ['required', Rule::in(['active', 'matured', 'renewed', 'losed'])],
            'renewal_action' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
