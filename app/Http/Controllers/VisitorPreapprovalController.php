<?php

namespace App\Http\Controllers;

use App\Models\ApartmentManagement;
use App\Models\AuditLog;
use App\Models\User;
use App\Models\VisitorPreapproval;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VisitorPreapprovalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('visitor-preapprovals/index', [
            'preapprovals' => VisitorPreapproval::with(['user', 'apartment'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('visitor-preapprovals/create', [
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
            'residents' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'visitor_name' => ['required', 'string', 'max:255'],
            'visitor_phone' => ['nullable', 'string', 'max:20'],
            'apartment_id' => ['nullable', 'exists:apartment_managements,id'],
            'expected_arrival' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date'],
            'purpose' => ['nullable', 'string', 'max:500'],
            'status' => ['required', Rule::in(['pending', 'approved', 'rejected', 'expired'])],
            'entry_type' => ['nullable', Rule::in(['visitor', 'delivery', 'cab', 'maintenance', 'other'])],
        ]);

        VisitorPreapproval::create([
            'society_id' => active_society_id(),
            'user_id' => auth()->id() ? (int) auth()->id() : null,
            'visitor_name' => $data['visitor_name'],
            'visitor_phone' => $data['visitor_phone'] ?? null,
            'apartment_id' => $data['apartment_id'] ?? null,
            'expected_arrival' => $data['expected_arrival'] ?? null,
            'expires_at' => $data['expires_at'] ?? null,
            'purpose' => $data['purpose'] ?? null,
            'status' => $data['status'],
            'entry_type' => $data['entry_type'] ?? 'visitor',
            'qr_code' => Str::random(32),
        ]);

        AuditLog::record("Created visitor preapproval: {$data['visitor_name']}");

        return redirect()->route('visitor-preapprovals.index');
    }

    public function edit(VisitorPreapproval $visitorPreapproval): Response
    {
        return Inertia::render('visitor-preapprovals/edit', [
            'preapproval' => $visitorPreapproval->load(['user', 'apartment']),
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
            'residents' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, VisitorPreapproval $visitorPreapproval): RedirectResponse
    {
        $data = $request->validate([
            'visitor_name' => ['required', 'string', 'max:255'],
            'visitor_phone' => ['nullable', 'string', 'max:20'],
            'apartment_id' => ['nullable', 'exists:apartment_managements,id'],
            'expected_arrival' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date'],
            'purpose' => ['nullable', 'string', 'max:500'],
            'status' => ['required', Rule::in(['pending', 'approved', 'rejected', 'expired'])],
            'entry_type' => ['nullable', Rule::in(['visitor', 'delivery', 'cab', 'maintenance', 'other'])],
        ]);

        $visitorPreapproval->update([
            'visitor_name' => $data['visitor_name'],
            'visitor_phone' => $data['visitor_phone'] ?? null,
            'apartment_id' => $data['apartment_id'] ?? null,
            'expected_arrival' => $data['expected_arrival'] ?? null,
            'expires_at' => $data['expires_at'] ?? null,
            'purpose' => $data['purpose'] ?? null,
            'status' => $data['status'],
            'entry_type' => $data['entry_type'] ?? $visitorPreapproval->entry_type,
        ]);

        AuditLog::record("Updated visitor preapproval: {$data['visitor_name']}", $visitorPreapproval);

        return redirect()->route('visitor-preapprovals.index');
    }

    public function destroy(VisitorPreapproval $visitorPreapproval): RedirectResponse
    {
        AuditLog::record("Deleted visitor preapproval: {$visitorPreapproval->visitor_name}");
        $visitorPreapproval->delete();

        return redirect()->route('visitor-preapprovals.index');
    }
}
