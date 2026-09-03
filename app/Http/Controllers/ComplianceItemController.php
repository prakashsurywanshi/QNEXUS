<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\ComplianceItem;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ComplianceItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('compliance-items/index', [
            'complianceItems' => ComplianceItem::with(['assignee'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('compliance-items/create', [
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateCompliance($request);

        ComplianceItem::create([
            'society_id' => active_society_id(),
            'category' => $data['category'],
            'item_name' => $data['item_name'],
            'description' => $data['description'] ?? null,
            'due_date' => $data['due_date'] ?? null,
            'status' => $data['status'],
            'last_completed' => $data['last_completed'] ?? null,
            'next_due' => $data['next_due'] ?? null,
            'assigned_to' => $data['assigned_to'] ?? null,
        ]);

        AuditLog::record("Created compliance item: {$data['item_name']}");

        return redirect()->route('compliance-items.index');
    }

    public function edit(ComplianceItem $complianceItem): Response
    {
        return Inertia::render('compliance-items/edit', [
            'complianceItem' => $complianceItem->load('assignee'),
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, ComplianceItem $complianceItem): RedirectResponse
    {
        $data = $this->validateCompliance($request);

        $complianceItem->update([
            'category' => $data['category'],
            'item_name' => $data['item_name'],
            'description' => $data['description'] ?? null,
            'due_date' => $data['due_date'] ?? null,
            'status' => $data['status'],
            'last_completed' => $data['last_completed'] ?? null,
            'next_due' => $data['next_due'] ?? null,
            'assigned_to' => $data['assigned_to'] ?? null,
        ]);

        AuditLog::record("Updated compliance item: {$data['item_name']}", $complianceItem);

        return redirect()->route('compliance-items.index');
    }

    public function destroy(ComplianceItem $complianceItem): RedirectResponse
    {
        AuditLog::record("Deleted compliance item: {$complianceItem->item_name}");
        $complianceItem->delete();

        return redirect()->route('compliance-items.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateCompliance(Request $request): array
    {
        return $request->validate([
            'category' => ['required', 'string', 'max:255'],
            'item_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed', 'overdue'])],
            'last_completed' => ['nullable', 'date'],
            'next_due' => ['nullable', 'date'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);
    }
}
