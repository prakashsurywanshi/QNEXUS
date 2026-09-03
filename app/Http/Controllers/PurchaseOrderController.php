<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseOrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('accounting/purchase-orders/index', [
            'purchaseOrders' => PurchaseOrder::with(['vendor'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('accounting/purchase-orders/create', [
            'vendors' => Vendor::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePurchaseOrder($request);

        DB::transaction(function () use ($data) {
            $po = PurchaseOrder::create([
                'society_id' => active_society_id(),
                'vendor_id' => $data['vendor_id'] ?? null,
                'po_number' => $data['po_number'],
                'po_date' => $data['po_date'],
                'total_amount' => $data['total_amount'] ?? 0,
                'tax_amount' => $data['tax_amount'] ?? 0,
                'grand_total' => $data['grand_total'] ?? $data['total_amount'] ?? 0,
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
                'created_by' => auth()->id() ? (int) auth()->id() : 0,
            ]);

            foreach ($data['items'] ?? [] as $item) {
                if (empty($item['item_name'])) {
                    continue;
                }
                PurchaseOrderItem::create([
                    'purchase_order_id' => $po->id,
                    'item_name' => $item['item_name'],
                    'description' => $item['description'] ?? null,
                    'quantity' => $item['quantity'] ?? 0,
                    'unit' => $item['unit'] ?? 'nos',
                    'unit_price' => $item['unit_price'] ?? 0,
                    'total_price' => ($item['quantity'] ?? 0) * ($item['unit_price'] ?? 0),
                ]);
            }
        });

        AuditLog::record("Created purchase order: {$data['po_number']}");

        return redirect()->route('purchase-orders.index');
    }

    public function edit(PurchaseOrder $purchaseOrder): Response
    {
        return Inertia::render('accounting/purchase-orders/edit', [
            'purchaseOrder' => $purchaseOrder->load(['vendor', 'items']),
            'vendors' => Vendor::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        $data = $this->validatePurchaseOrder($request);

        DB::transaction(function () use ($data, $purchaseOrder) {
            $purchaseOrder->update([
                'vendor_id' => $data['vendor_id'] ?? null,
                'po_number' => $data['po_number'],
                'po_date' => $data['po_date'],
                'total_amount' => $data['total_amount'] ?? 0,
                'tax_amount' => $data['tax_amount'] ?? 0,
                'grand_total' => $data['grand_total'] ?? $data['total_amount'] ?? 0,
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
            ]);

            $purchaseOrder->items()->delete();

            foreach ($data['items'] ?? [] as $item) {
                if (empty($item['item_name'])) {
                    continue;
                }
                PurchaseOrderItem::create([
                    'purchase_order_id' => $purchaseOrder->id,
                    'item_name' => $item['item_name'],
                    'description' => $item['description'] ?? null,
                    'quantity' => $item['quantity'] ?? 0,
                    'unit' => $item['unit'] ?? 'nos',
                    'unit_price' => $item['unit_price'] ?? 0,
                    'total_price' => ($item['quantity'] ?? 0) * ($item['unit_price'] ?? 0),
                ]);
            }
        });

        AuditLog::record("Updated purchase order: {$data['po_number']}", $purchaseOrder);

        return redirect()->route('purchase-orders.index');
    }

    public function destroy(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        AuditLog::record("Deleted purchase order: {$purchaseOrder->po_number}");
        $purchaseOrder->items()->delete();
        $purchaseOrder->delete();

        return redirect()->route('purchase-orders.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePurchaseOrder(Request $request): array
    {
        return $request->validate([
            'vendor_id' => ['nullable', 'exists:vendors,id'],
            'po_number' => ['required', 'string', 'max:255'],
            'po_date' => ['required', 'date'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'grand_total' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['draft', 'pending_approval', 'approved', 'ordered', 'partially_received', 'received', 'cancelled'])],
            'notes' => ['nullable', 'string'],
            'items' => ['array'],
            'items.*.item_name' => ['nullable', 'string'],
            'items.*.description' => ['nullable', 'string'],
            'items.*.quantity' => ['nullable', 'numeric', 'min:0'],
            'items.*.unit' => ['nullable', 'string'],
            'items.*.unit_price' => ['nullable', 'numeric', 'min:0'],
        ]);
    }
}
