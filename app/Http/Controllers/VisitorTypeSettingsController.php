<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\VisitorTypeSettingsModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VisitorTypeSettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('visitor-types/index', [
            'types' => VisitorTypeSettingsModel::where('society_id', active_society_id())->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('visitor-types/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        VisitorTypeSettingsModel::create([
            'society_id' => active_society_id(),
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
        ]);

        AuditLog::record("Created visitor type: {$data['name']}");

        return redirect()->route('visitor-types.index');
    }

    public function edit(VisitorTypeSettingsModel $visitorType): Response
    {
        return Inertia::render('visitor-types/edit', [
            'type' => $visitorType,
        ]);
    }

    public function update(Request $request, VisitorTypeSettingsModel $visitorType): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $visitorType->update([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
        ]);

        AuditLog::record("Updated visitor type: {$data['name']}", $visitorType);

        return redirect()->route('visitor-types.index');
    }

    public function destroy(VisitorTypeSettingsModel $visitorType): RedirectResponse
    {
        AuditLog::record("Deleted visitor type: {$visitorType->name}");
        $visitorType->delete();

        return redirect()->route('visitor-types.index');
    }
}
