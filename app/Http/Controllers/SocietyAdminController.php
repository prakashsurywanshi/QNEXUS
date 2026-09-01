<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Society;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SocietyAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('societies/index', [
            'societies' => Society::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('societies/create');
    }

    public function store(Request $request): RedirectResponse
    {
        Society::create($this->validateSociety($request));

        return redirect()->route('societies.index');
    }

    public function edit(Society $society): Response
    {
        return Inertia::render('societies/edit', [
            'society' => $society,
        ]);
    }

    public function update(Request $request, Society $society): RedirectResponse
    {
        $society->update($this->validateSociety($request));

        return redirect()->route('societies.index');
    }

    public function destroy(Society $society): RedirectResponse
    {
        $society->delete();

        return redirect()->route('societies.index');
    }

    private function validateSociety(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'timezone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'property_type' => ['required', Rule::in(['residential', 'commercial', 'mixed'])],
            'is_active' => ['boolean'],
            'show_logo_text' => ['boolean'],
        ]);
    }
}
