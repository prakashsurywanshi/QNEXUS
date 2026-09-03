<?php

namespace App\Http\Controllers;

use App\Models\ApartmentManagement;
use App\Models\AuditLog;
use App\Models\CreditNote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CreditNoteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('accounting/credit-notes/index', [
            'creditNotes' => CreditNote::with(['apartment', 'creator'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('accounting/credit-notes/create', [
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateCreditNote($request);

        CreditNote::create([
            'society_id' => active_society_id(),
            'apartment_id' => $data['apartment_id'] ?? null,
            'credit_number' => $data['credit_number'],
            'amount' => $data['amount'],
            'reason' => $data['reason'],
            'applied_to_invoice' => $data['applied_to_invoice'] ?? null,
            'status' => $data['status'],
            'created_by' => auth()->id() ? (int) auth()->id() : 0,
        ]);

        AuditLog::record("Created credit note: {$data['credit_number']}");

        return redirect()->route('credit-notes.index');
    }

    public function edit(CreditNote $creditNote): Response
    {
        return Inertia::render('accounting/credit-notes/edit', [
            'creditNote' => $creditNote->load(['apartment', 'creator']),
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
        ]);
    }

    public function update(Request $request, CreditNote $creditNote): RedirectResponse
    {
        $data = $this->validateCreditNote($request);

        $creditNote->update([
            'apartment_id' => $data['apartment_id'] ?? null,
            'credit_number' => $data['credit_number'],
            'amount' => $data['amount'],
            'reason' => $data['reason'],
            'applied_to_invoice' => $data['applied_to_invoice'] ?? null,
            'status' => $data['status'],
        ]);

        AuditLog::record("Updated credit note: {$data['credit_number']}", $creditNote);

        return redirect()->route('credit-notes.index');
    }

    public function destroy(CreditNote $creditNote): RedirectResponse
    {
        AuditLog::record("Deleted credit note: {$creditNote->credit_number}");
        $creditNote->delete();

        return redirect()->route('credit-notes.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateCreditNote(Request $request): array
    {
        return $request->validate([
            'apartment_id' => ['nullable', 'exists:apartment_managements,id'],
            'credit_number' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'reason' => ['required', 'string'],
            'applied_to_invoice' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['pending', 'applied', 'cancelled'])],
        ]);
    }
}
