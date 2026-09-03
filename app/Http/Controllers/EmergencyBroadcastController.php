<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\EmergencyBroadcast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EmergencyBroadcastController extends Controller
{
    public function index(): Response
    {
        $societyId = active_society_id();

        return Inertia::render('emergency-broadcasts/index', [
            'active' => EmergencyBroadcast::with('sender')->where('society_id', $societyId)->where('status', 'active')->orderBy('created_at', 'desc')->get(),
            'history' => EmergencyBroadcast::with('sender')->where('society_id', $societyId)->where('status', '!=', 'active')->orderBy('created_at', 'desc')->get(),
            'categories' => ['fire', 'medical', 'security', 'water', 'electricity', 'gas', 'natural_disaster', 'other'],
            'audiences' => ['all', 'residents', 'committee', 'contacts'],
            'severities' => ['info', 'warning', 'critical'],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('emergency-broadcasts/create', [
            'categories' => ['fire', 'medical', 'security', 'water', 'electricity', 'gas', 'natural_disaster', 'other'],
            'audiences' => ['all', 'residents', 'committee', 'contacts'],
            'severities' => ['info', 'warning', 'critical'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['fire', 'medical', 'security', 'water', 'electricity', 'gas', 'natural_disaster', 'other'])],
            'message' => ['required', 'string', 'max:5000'],
            'audience' => ['required', Rule::in(['all', 'residents', 'committee', 'contacts'])],
            'severity' => ['required', Rule::in(['info', 'warning', 'critical'])],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $broadcast = EmergencyBroadcast::create([
            'society_id' => active_society_id(),
            'title' => $data['title'],
            'category' => $data['category'],
            'message' => $data['message'],
            'audience' => $data['audience'],
            'severity' => $data['severity'],
            'location' => $data['location'] ?? null,
            'status' => 'active',
            'sent_by' => auth()->id() ? (int) auth()->id() : null,
            'sent_at' => now(),
        ]);

        AuditLog::record("Issued emergency broadcast: {$broadcast->title}", $broadcast);

        return redirect()->route('emergency-broadcasts.index');
    }

    public function resolve(Request $request, EmergencyBroadcast $broadcast): RedirectResponse
    {
        $broadcast->update([
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);

        AuditLog::record("Resolved emergency broadcast: {$broadcast->title}", $broadcast);

        return back();
    }

    public function destroy(EmergencyBroadcast $broadcast): RedirectResponse
    {
        AuditLog::record("Deleted emergency broadcast #{$broadcast->id}");

        $broadcast->delete();

        return redirect()->route('emergency-broadcasts.index');
    }
}
