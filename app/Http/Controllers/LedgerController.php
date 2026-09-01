<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ChartOfAccount;
use App\Models\GeneralLedger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LedgerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('ledger/index', [
            'entries' => GeneralLedger::latest('date')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('ledger/create', [
            'accounts' => ChartOfAccount::get(['id', 'account_name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateEntry($request);

        GeneralLedger::create($data + [
            'society_id' => active_society_id(),
            'created_by' => user()->id,
        ]);

        return redirect()->route('ledger.index');
    }

    public function edit(GeneralLedger $entry): Response
    {
        return Inertia::render('ledger/edit', [
            'entry' => $entry,
            'accounts' => ChartOfAccount::get(['id', 'account_name']),
        ]);
    }

    public function update(Request $request, GeneralLedger $entry): RedirectResponse
    {
        $entry->update($this->validateEntry($request));

        return redirect()->route('ledger.index');
    }

    public function destroy(GeneralLedger $entry): RedirectResponse
    {
        $entry->delete();

        return redirect()->route('ledger.index');
    }

    private function validateEntry(Request $request): array
    {
        return $request->validate([
            'account_id' => ['required', 'integer', 'exists:chart_of_accounts,id'],
            'date' => ['required', 'date'],
            'description' => ['required', 'string', 'max:255'],
            'debit' => ['nullable', 'numeric', 'min:0'],
            'credit' => ['nullable', 'numeric', 'min:0'],
        ]);
    }
}
