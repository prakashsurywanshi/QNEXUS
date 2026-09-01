<?php

namespace App\Http\Controllers;

use App\Models\VisitorManagement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VisitorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('visitors/index', [
            'visitors' => VisitorManagement::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('visitors/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateVisitor($request);

        $this->persist(new VisitorManagement(), $data);

        return redirect()->route('visitors.index');
    }

    public function edit(VisitorManagement $visitor): Response
    {
        return Inertia::render('visitors/edit', [
            'visitor' => $visitor,
        ]);
    }

    public function update(Request $request, VisitorManagement $visitor): RedirectResponse
    {
        $this->persist($visitor, $this->validateVisitor($request));

        return redirect()->route('visitors.index');
    }

    public function destroy(VisitorManagement $visitor): RedirectResponse
    {
        $visitor->delete();

        return redirect()->route('visitors.index');
    }

    private function validateVisitor(Request $request): array
    {
        return $request->validate([
            'visitor_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'purpose_of_visit' => ['nullable', 'string', 'max:500'],
            'date_of_visit' => ['nullable', 'date'],
            'date_of_exit' => ['nullable', 'date'],
            'in_time' => ['nullable', 'date_format:H:i'],
            'out_time' => ['nullable', 'date_format:H:i'],
            'status' => ['required', Rule::in(['pending', 'allowed', 'not_allowed'])],
        ]);
    }

    private function persist(VisitorManagement $visitor, array $data): void
    {
        $visitor->visitor_name = $data['visitor_name'];
        $visitor->phone_number = $data['phone_number'] ?? null;
        $visitor->address = $data['address'] ?? null;
        $visitor->purpose_of_visit = $data['purpose_of_visit'] ?? null;
        $visitor->date_of_visit = $data['date_of_visit'] ?? null;
        $visitor->date_of_exit = $data['date_of_exit'] ?? null;
        $visitor->in_time = $data['in_time'] ?? null;
        $visitor->out_time = $data['out_time'] ?? null;
        $visitor->status = $data['status'];
        $visitor->added_by = user() ? user()->id : null;
        if (!$visitor->society_id && !$visitor->exists) {
            $visitor->society_id = active_society_id();
        }
        $visitor->save();
    }
}
