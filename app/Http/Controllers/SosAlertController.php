<?php

namespace App\Http\Controllers;

use App\Models\SosAlert;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SosAlertController extends Controller
{
    public function index(): Response
    {
        $alerts = SosAlert::with('user')->latest()->get();

        return Inertia::render('sos-alerts/index', [
            'alerts' => $alerts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('sos-alerts/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'alert_type' => ['required', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:2000'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
        ]);

        SosAlert::create($data + [
            'society_id' => active_society_id(),
            'user_id' => auth()->id(),
            'status' => 'active',
        ]);

        return redirect()->route('sos-alerts.index');
    }

    public function update(Request $request, SosAlert $alert): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:active,responded,resolved'],
        ]);

        $updateData = ['status' => $data['status']];

        if (in_array($data['status'], ['responded', 'resolved'], true)) {
            $updateData['responded_by'] = auth()->id();
            $updateData['responded_at'] = now();
        }

        $alert->update($updateData);

        return redirect()->route('sos-alerts.index');
    }

    public function destroy(SosAlert $alert): RedirectResponse
    {
        $alert->delete();

        return redirect()->route('sos-alerts.index');
    }
}
