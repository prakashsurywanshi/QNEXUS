<?php

namespace App\Http\Controllers;

use App\Models\ApartmentManagement;
use App\Models\AuditLog;
use App\Models\MoveRecord;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MoveRecordController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('move-records/index', [
            'moveRecords' => MoveRecord::with(['user', 'apartment', 'nocIssuer'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('move-records/create', [
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateMoveRecord($request);

        MoveRecord::create([
            'society_id' => active_society_id(),
            'apartment_id' => $data['apartment_id'] ?? null,
            'user_id' => $data['user_id'],
            'move_type' => $data['move_type'],
            'move_date' => $data['move_date'],
            'forwarding_address' => $data['forwarding_address'] ?? null,
            'deposit_amount' => $data['deposit_amount'] ?? 0,
            'deposit_status' => $data['deposit_status'],
            'pending_dues' => $data['pending_dues'] ?? 0,
            'noc_status' => $data['noc_status'],
            'noc_issued_by' => $data['noc_issued_by'] ?? null,
            'noc_date' => $data['noc_date'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record("Recorded move-{$data['move_type']} for user #{$data['user_id']}");

        return redirect()->route('move-records.index');
    }

    public function edit(MoveRecord $moveRecord): Response
    {
        return Inertia::render('move-records/edit', [
            'moveRecord' => $moveRecord->load(['user', 'apartment', 'nocIssuer']),
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
        ]);
    }

    public function update(Request $request, MoveRecord $moveRecord): RedirectResponse
    {
        $data = $this->validateMoveRecord($request);

        $moveRecord->update([
            'apartment_id' => $data['apartment_id'] ?? null,
            'user_id' => $data['user_id'],
            'move_type' => $data['move_type'],
            'move_date' => $data['move_date'],
            'forwarding_address' => $data['forwarding_address'] ?? null,
            'deposit_amount' => $data['deposit_amount'] ?? 0,
            'deposit_status' => $data['deposit_status'],
            'pending_dues' => $data['pending_dues'] ?? 0,
            'noc_status' => $data['noc_status'],
            'noc_issued_by' => $data['noc_issued_by'] ?? null,
            'noc_date' => $data['noc_date'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record("Updated move record #{$moveRecord->id}", $moveRecord);

        return redirect()->route('move-records.index');
    }

    public function destroy(MoveRecord $moveRecord): RedirectResponse
    {
        AuditLog::record("Deleted move record #{$moveRecord->id}");
        $moveRecord->delete();

        return redirect()->route('move-records.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateMoveRecord(Request $request): array
    {
        return $request->validate([
            'apartment_id' => ['nullable', 'exists:apartment_managements,id'],
            'user_id' => ['required', 'exists:users,id'],
            'move_type' => ['required', Rule::in(['in', 'out'])],
            'move_date' => ['required', 'date'],
            'forwarding_address' => ['nullable', 'string'],
            'deposit_amount' => ['nullable', 'numeric', 'min:0'],
            'deposit_status' => ['required', Rule::in(['pending', 'refunded', 'forfeited'])],
            'pending_dues' => ['nullable', 'numeric', 'min:0'],
            'noc_status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
            'noc_issued_by' => ['nullable', 'exists:users,id'],
            'noc_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
