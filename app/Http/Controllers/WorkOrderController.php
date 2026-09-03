<?php

namespace App\Http\Controllers;

use App\Models\AssetManagement;
use App\Models\AuditLog;
use App\Models\User;
use App\Models\WorkOrder;
use App\Services\Notifier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkOrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('work-orders/index', [
            'workOrders' => WorkOrder::with(['asset', 'assignee', 'creator'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('work-orders/create', [
            'assets' => AssetManagement::orderBy('name')->get(['id', 'name']),
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'asset_id' => ['nullable', 'exists:asset_managements,id'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'due_date' => ['nullable', 'date'],
        ]);

        $workOrder = WorkOrder::create([
            'society_id' => active_society_id(),
            'created_by' => auth()->id(),
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'asset_id' => $data['asset_id'] ?? null,
            'assigned_to' => $data['assigned_to'] ?? null,
            'priority' => $data['priority'],
            'due_date' => $data['due_date'] ?? null,
            'status' => ! empty($data['assigned_to']) ? 'assigned' : 'open',
        ]);

        AuditLog::record("Created work order: {$data['title']}");

        if (! empty($data['assigned_to']) && $data['assigned_to'] !== auth()->id()) {
            Notifier::notify((int) $data['assigned_to'], Notifier::CATEGORY_WORK_ORDERS, [
                'title' => 'New work order assigned to you',
                'body' => "{$data['title']} · priority: {$data['priority']}",
                'link' => route('work-orders.edit', $workOrder->id),
            ]);
        }

        return redirect()->route('work-orders.index');
    }

    public function edit(WorkOrder $workOrder): Response
    {
        return Inertia::render('work-orders/edit', [
            'workOrder' => $workOrder->load(['asset', 'assignee']),
            'assets' => AssetManagement::orderBy('name')->get(['id', 'name']),
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, WorkOrder $workOrder): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'asset_id' => ['nullable', 'exists:asset_managements,id'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'due_date' => ['nullable', 'date'],
            'status' => ['required', 'in:open,assigned,in_progress,completed,verified,closed'],
            'resolution_notes' => ['nullable', 'string'],
        ]);

        $workOrder->update([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'asset_id' => $data['asset_id'] ?? null,
            'assigned_to' => $data['assigned_to'] ?? null,
            'priority' => $data['priority'],
            'due_date' => $data['due_date'] ?? null,
            'status' => $data['status'],
            'resolution_notes' => $data['resolution_notes'] ?? null,
        ]);

        AuditLog::record("Updated work order: {$data['title']}", $workOrder);

        return redirect()->route('work-orders.index');
    }

    public function destroy(WorkOrder $workOrder): RedirectResponse
    {
        AuditLog::record("Deleted work order: {$workOrder->title}");
        $workOrder->delete();

        return redirect()->route('work-orders.index');
    }
}
