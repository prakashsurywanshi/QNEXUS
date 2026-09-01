<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CamCharge;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CamChargeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cam-charges/index', [
            'camCharges' => CamCharge::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('cam-charges/create');
    }

    public function store(Request $request): RedirectResponse
    {
        CamCharge::create($this->validateCamCharge($request) + [
            'society_id' => active_society_id(),
        ]);

        return redirect()->route('cam-charges.index');
    }

    public function edit(CamCharge $camCharge): Response
    {
        return Inertia::render('cam-charges/edit', [
            'camCharge' => $camCharge,
        ]);
    }

    public function update(Request $request, CamCharge $camCharge): RedirectResponse
    {
        $camCharge->update($this->validateCamCharge($request));

        return redirect()->route('cam-charges.index');
    }

    public function destroy(CamCharge $camCharge): RedirectResponse
    {
        $camCharge->delete();

        return redirect()->route('cam-charges.index');
    }

    private function validateCamCharge(Request $request): array
    {
        return $request->validate([
            'fiscal_year' => ['required', 'string', 'max:20'],
            'total_budget' => ['nullable', 'numeric', 'min:0'],
            'total_area' => ['nullable', 'numeric', 'min:0'],
            'rate_per_sqft' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['draft', 'active', 'closed'])],
            'notes' => ['nullable', 'string'],
        ]);
    }
}