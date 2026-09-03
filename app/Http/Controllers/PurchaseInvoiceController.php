<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseOrder;
use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseInvoiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('accounting/purchase-invoices/index', [
            'invoices' => PurchaseInvoice::with(['vendor', 'purchaseOrder'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('accounting/purchase-invoices/create', [
            'vendors' => Vendor::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
            'purchaseOrders' => PurchaseOrder::where('society_id', active_society_id())->orderBy('po_number')->get(['id', 'po_number']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateInvoice($request);

        PurchaseInvoice::create([
            'society_id' => active_society_id(),
            'vendor_id' => $data['vendor_id'] ?? null,
            'purchase_order_id' => $data['purchase_order_id'] ?? null,
            'invoice_number' => $data['invoice_number'],
            'invoice_date' => $data['invoice_date'],
            'subtotal' => $data['subtotal'] ?? 0,
            'tax_amount' => $data['tax_amount'] ?? 0,
            'total_amount' => $data['total_amount'] ?? $data['subtotal'] ?? 0,
            'paid_amount' => $data['paid_amount'] ?? 0,
            'status' => $data['status'],
            'due_date' => $data['due_date'] ?? null,
            'created_by' => auth()->id() ? (int) auth()->id() : 0,
        ]);

        AuditLog::record("Created purchase invoice: {$data['invoice_number']}");

        return redirect()->route('purchase-invoices.index');
    }

    public function edit(PurchaseInvoice $purchaseInvoice): Response
    {
        return Inertia::render('accounting/purchase-invoices/edit', [
            'invoice' => $purchaseInvoice->load(['vendor', 'purchaseOrder']),
            'vendors' => Vendor::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
            'purchaseOrders' => PurchaseOrder::where('society_id', active_society_id())->orderBy('po_number')->get(['id', 'po_number']),
        ]);
    }

    public function update(Request $request, PurchaseInvoice $purchaseInvoice): RedirectResponse
    {
        $data = $this->validateInvoice($request);

        $purchaseInvoice->update([
            'vendor_id' => $data['vendor_id'] ?? null,
            'purchase_order_id' => $data['purchase_order_id'] ?? null,
            'invoice_number' => $data['invoice_number'],
            'invoice_date' => $data['invoice_date'],
            'subtotal' => $data['subtotal'] ?? 0,
            'tax_amount' => $data['tax_amount'] ?? 0,
            'total_amount' => $data['total_amount'] ?? $data['subtotal'] ?? 0,
            'paid_amount' => $data['paid_amount'] ?? 0,
            'status' => $data['status'],
            'due_date' => $data['due_date'] ?? null,
        ]);

        AuditLog::record("Updated purchase invoice: {$data['invoice_number']}", $purchaseInvoice);

        return redirect()->route('purchase-invoices.index');
    }

    public function destroy(PurchaseInvoice $purchaseInvoice): RedirectResponse
    {
        AuditLog::record("Deleted purchase invoice: {$purchaseInvoice->invoice_number}");
        $purchaseInvoice->delete();

        return redirect()->route('purchase-invoices.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateInvoice(Request $request): array
    {
        return $request->validate([
            'vendor_id' => ['nullable', 'exists:vendors,id'],
            'purchase_order_id' => ['nullable', 'exists:purchase_orders,id'],
            'invoice_number' => ['required', 'string', 'max:255'],
            'invoice_date' => ['required', 'date'],
            'subtotal' => ['nullable', 'numeric', 'min:0'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['pending', 'partially_paid', 'paid', 'overdue', 'cancelled'])],
            'due_date' => ['nullable', 'date'],
        ]);
    }
}
