<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NoticeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('notices/index', [
            'notices' => Notice::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('notices/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        Notice::create($data + ['society_id' => active_society_id()]);

        return redirect()->route('notices.index');
    }

    public function edit(Notice $notice): Response
    {
        return Inertia::render('notices/edit', [
            'notice' => $notice,
        ]);
    }

    public function update(Request $request, Notice $notice): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $notice->update($data);

        return redirect()->route('notices.index');
    }

    public function destroy(Notice $notice): RedirectResponse
    {
        $notice->delete();

        return redirect()->route('notices.index');
    }
}
