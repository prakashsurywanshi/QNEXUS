<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('maintenance/index', [
            'maintenance' => Maintenance::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('maintenance/create');
    }

    public function store(Request $request): RedirectResponse
    {
        Maintenance::create($this->validateMaintenance($request) + [
            'society_id' => active_society_id(),
        ]);

        return redirect()->route('maintenance.index');
    }

    public function edit(Maintenance $maintenance): Response
    {
        return Inertia::render('maintenance/edit', [
            'maintenance' => $maintenance,
        ]);
    }

    public function update(Request $request, Maintenance $maintenance): RedirectResponse
    {
        $maintenance->update($this->validateMaintenance($request));

        return redirect()->route('maintenance.index');
    }

    public function destroy(Maintenance $maintenance): RedirectResponse
    {
        $maintenance->delete();

        return redirect()->route('maintenance.index');
    }

    private function validateMaintenance(Request $request): array
    {
        return $request->validate([
            'cost_type' => ['required', Rule::in(['fixedValue', 'unitType'])],
            'unit_name' => ['nullable', 'string', 'max:255'],
            'set_value' => ['nullable', 'numeric', 'min:0'],
        ]);
    }
}
