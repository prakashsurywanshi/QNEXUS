<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LeaseAgreement;
use App\Models\RentInvoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RentInvoiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('invoices/index', [
            'invoices' => RentInvoice::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('invoices/create', [
            'leaseAgreements' => LeaseAgreement::get(['id', 'lease_number']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateInvoice($request);

        $data['total_amount'] = ($data['rent_amount'] ?? 0)
            + ($data['cam_charges'] ?? 0)
            + ($data['other_charges'] ?? 0)
            + ($data['tax_amount'] ?? 0);

        RentInvoice::create($data + [
            'society_id' => active_society_id(),
        ]);

        return redirect()->route('invoices.index');
    }

    public function edit(RentInvoice $invoice): Response
    {
        return Inertia::render('invoices/edit', [
            'invoice' => $invoice,
            'leaseAgreements' => LeaseAgreement::get(['id', 'lease_number']),
        ]);
    }

    public function update(Request $request, RentInvoice $invoice): RedirectResponse
    {
        $validated = $this->validateInvoice($request);

        $validated['total_amount'] = ($validated['rent_amount'] ?? 0)
            + ($validated['cam_charges'] ?? 0)
            + ($validated['other_charges'] ?? 0)
            + ($validated['tax_amount'] ?? 0);

        $invoice->update($validated);

        return redirect()->route('invoices.index');
    }

    public function destroy(RentInvoice $invoice): RedirectResponse
    {
        $invoice->delete();

        return redirect()->route('invoices.index');
    }

    private function validateInvoice(Request $request): array
    {
        return $request->validate([
            'lease_agreement_id' => ['required', 'integer', 'exists:lease_agreements,id'],
            'invoice_number' => ['required', 'string', 'max:255'],
            'billing_period' => ['required', 'string', 'max:255'],
            'rent_amount' => ['nullable', 'numeric', 'min:0'],
            'cam_charges' => ['nullable', 'numeric', 'min:0'],
            'other_charges' => ['nullable', 'numeric', 'min:0'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['pending', 'paid', 'overdue', 'partial', 'cancelled'])],
            'due_date' => ['required', 'date'],
        ]);
    }
}
