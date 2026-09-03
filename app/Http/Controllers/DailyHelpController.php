<?php

namespace App\Http\Controllers;

use App\Models\DailyHelpWorker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyHelpController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('daily-help/index', [
            'workers' => DailyHelpWorker::withCount('bookings')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('daily-help/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'string', 'max:255'],
            'service_type' => ['required', 'string', 'max:255'],
            'rate_per_visit' => ['nullable', 'numeric'],
            'rating' => ['nullable', 'numeric'],
            'total_bookings' => ['nullable', 'integer'],
            'is_verified' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'availability' => ['nullable', 'array'],
            'notes' => ['nullable', 'string'],
        ]);

        DailyHelpWorker::create($data + ['society_id' => active_society_id()]);

        return redirect()->route('daily-help.index');
    }

    public function edit(DailyHelpWorker $worker): Response
    {
        return Inertia::render('daily-help/edit', [
            'worker' => $worker,
        ]);
    }

    public function update(Request $request, DailyHelpWorker $worker): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'string', 'max:255'],
            'service_type' => ['required', 'string', 'max:255'],
            'rate_per_visit' => ['nullable', 'numeric'],
            'rating' => ['nullable', 'numeric'],
            'total_bookings' => ['nullable', 'integer'],
            'is_verified' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'availability' => ['nullable', 'array'],
            'notes' => ['nullable', 'string'],
        ]);

        $worker->update($data);

        return redirect()->route('daily-help.index');
    }

    public function destroy(DailyHelpWorker $worker): RedirectResponse
    {
        $worker->delete();

        return redirect()->route('daily-help.index');
    }
}
