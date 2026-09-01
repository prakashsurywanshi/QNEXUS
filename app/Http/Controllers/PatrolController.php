<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PatrolCheckpoint;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatrolController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('patrol/index', [
            'checkpoints' => PatrolCheckpoint::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('patrol/create');
    }

    public function store(Request $request): RedirectResponse
    {
        PatrolCheckpoint::create($this->validateCheckpoint($request) + [
            'society_id' => active_society_id(),
        ]);

        return redirect()->route('patrol.index');
    }

    public function edit(PatrolCheckpoint $checkpoint): Response
    {
        return Inertia::render('patrol/edit', [
            'checkpoint' => $checkpoint,
        ]);
    }

    public function update(Request $request, PatrolCheckpoint $checkpoint): RedirectResponse
    {
        $checkpoint->update($this->validateCheckpoint($request));

        return redirect()->route('patrol.index');
    }

    public function destroy(PatrolCheckpoint $checkpoint): RedirectResponse
    {
        $checkpoint->delete();

        return redirect()->route('patrol.index');
    }

    private function validateCheckpoint(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'location_description' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);
    }
}
