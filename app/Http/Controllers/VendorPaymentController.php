<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Vendor;
use App\Models\VendorPayment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VendorPaymentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('accounting/vendor-payments/index', [
            'payments' => VendorPayment::with(['vendor'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('accounting/vendor-payments/create', [
            'vendors' => Vendor::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePayment($request);

        VendorPayment::create([
            'society_id' => active_society_id(),
            'vendor_id' => $data['vendor_id'],
            'amount' => $data['amount'],
            'payment_date' => $data['payment_date'],
            'payment_method' => $data['payment_method'],
            'transaction_id' => $data['transaction_id'] ?? null,
            'tds_amount' => $data['tds_amount'] ?? 0,
            'net_amount' => $data['net_amount'] ?? $data['amount'],
            'invoice_number' => $data['invoice_number'] ?? null,
            'status' => $data['status'],
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record("Recorded vendor payment to vendor #{$data['vendor_id']}");

        return redirect()->route('vendor-payments.index');
    }

    public function edit(VendorPayment $vendorPayment): Response
    {
        return Inertia::render('accounting/vendor-payments/edit', [
            'payment' => $vendorPayment->load('vendor'),
            'vendors' => Vendor::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, VendorPayment $vendorPayment): RedirectResponse
    {
        $data = $this->validatePayment($request);

        $vendorPayment->update([
            'vendor_id' => $data['vendor_id'],
            'amount' => $data['amount'],
            'payment_date' => $data['payment_date'],
            'payment_method' => $data['payment_method'],
            'transaction_id' => $data['transaction_id'] ?? null,
            'tds_amount' => $data['tds_amount'] ?? 0,
            'net_amount' => $data['net_amount'] ?? $data['amount'],
            'invoice_number' => $data['invoice_number'] ?? null,
            'status' => $data['status'],
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record("Updated vendor payment #{$vendorPayment->id}", $vendorPayment);

        return redirect()->route('vendor-payments.index');
    }

    public function destroy(VendorPayment $vendorPayment): RedirectResponse
    {
        AuditLog::record("Deleted vendor payment #{$vendorPayment->id}");
        $vendorPayment->delete();

        return redirect()->route('vendor-payments.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePayment(Request $request): array
    {
        return $request->validate([
            'vendor_id' => ['required', 'exists:vendors,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', Rule::in(['cash', 'upi', 'card', 'bank_transfer', 'cheque'])],
            'transaction_id' => ['nullable', 'string', 'max:255'],
            'tds_amount' => ['nullable', 'numeric', 'min:0'],
            'net_amount' => ['nullable', 'numeric', 'min:0'],
            'invoice_number' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['pending', 'completed', 'cancelled'])],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
