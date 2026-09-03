<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\BoomBarrierLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BoomBarrierLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('boom-barrier-logs/index', [
            'logs' => BoomBarrierLog::with(['triggeredBy', 'visitorPreapproval'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('boom-barrier-logs/create', [
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateLog($request);

        BoomBarrierLog::create([
            'society_id' => active_society_id(),
            'gate_name' => $data['gate_name'] ?? null,
            'vehicle_number' => $data['vehicle_number'] ?? null,
            'direction' => $data['direction'],
            'barrier_type' => $data['barrier_type'],
            'trigger_method' => $data['trigger_method'],
            'triggered_by' => $data['triggered_by'] ?? null,
            'is_visitor' => $data['is_visitor'] ?? false,
            'visitor_preapproval_id' => $data['visitor_preapproval_id'] ?? null,
            'opened_at' => $data['opened_at'],
            'closed_at' => $data['closed_at'] ?? null,
        ]);

        AuditLog::record('Recorded boom barrier log');

        return redirect()->route('boom-barrier-logs.index');
    }

    public function edit(BoomBarrierLog $boomBarrierLog): Response
    {
        return Inertia::render('boom-barrier-logs/edit', [
            'log' => $boomBarrierLog->load(['triggeredBy', 'visitorPreapproval']),
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, BoomBarrierLog $boomBarrierLog): RedirectResponse
    {
        $data = $this->validateLog($request);

        $boomBarrierLog->update([
            'gate_name' => $data['gate_name'] ?? null,
            'vehicle_number' => $data['vehicle_number'] ?? null,
            'direction' => $data['direction'],
            'barrier_type' => $data['barrier_type'],
            'trigger_method' => $data['trigger_method'],
            'triggered_by' => $data['triggered_by'] ?? null,
            'is_visitor' => $data['is_visitor'] ?? false,
            'visitor_preapproval_id' => $data['visitor_preapproval_id'] ?? null,
            'opened_at' => $data['opened_at'],
            'closed_at' => $data['closed_at'] ?? null,
        ]);

        AuditLog::record("Updated boom barrier log #{$boomBarrierLog->id}", $boomBarrierLog);

        return redirect()->route('boom-barrier-logs.index');
    }

    public function destroy(BoomBarrierLog $boomBarrierLog): RedirectResponse
    {
        AuditLog::record("Deleted boom barrier log #{$boomBarrierLog->id}");
        $boomBarrierLog->delete();

        return redirect()->route('boom-barrier-logs.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateLog(Request $request): array
    {
        return $request->validate([
            'gate_name' => ['nullable', 'string', 'max:255'],
            'vehicle_number' => ['nullable', 'string', 'max:255'],
            'direction' => ['required', Rule::in(['in', 'out'])],
            'barrier_type' => ['required', Rule::in(['vehicle', 'pedestrian'])],
            'trigger_method' => ['required', Rule::in(['manual', 'remote', 'auto_number_plate', 'qr_code', 'rfid'])],
            'triggered_by' => ['nullable', 'exists:users,id'],
            'is_visitor' => ['nullable', 'boolean'],
            'visitor_preapproval_id' => ['nullable', 'exists:visitor_preapprovals,id'],
            'opened_at' => ['required', 'date'],
            'closed_at' => ['nullable', 'date'],
        ]);
    }
}
