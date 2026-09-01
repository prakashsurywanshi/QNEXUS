<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Poll;
use App\Models\PollOption;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PollController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('polls/index', [
            'polls' => Poll::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('polls/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $poll = Poll::create($this->validatePoll($request) + [
            'society_id' => active_society_id(),
            'created_by' => user()->id,
        ]);
        $this->syncOptions($poll, $request->input('options', []));

        return redirect()->route('polls.index');
    }

    public function edit(Poll $poll): Response
    {
        return Inertia::render('polls/edit', [
            'poll' => $poll->load('options'),
        ]);
    }

    public function update(Request $request, Poll $poll): RedirectResponse
    {
        $poll->update($this->validatePoll($request));
        $this->syncOptions($poll, $request->input('options', []));

        return redirect()->route('polls.index');
    }

    public function destroy(Poll $poll): RedirectResponse
    {
        $poll->delete();

        return redirect()->route('polls.index');
    }

    private function validatePoll(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'poll_type' => ['required', Rule::in(['normal', 'secret', 'election'])],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['required', Rule::in(['draft', 'active', 'closed'])],
            'results_visible' => ['boolean'],
        ]);
    }

    private function syncOptions(Poll $poll, mixed $options): void
    {
        $existing = $poll->options()->pluck('id');
        $existing->each(fn ($id) => PollOption::where('id', $id)->delete());

        foreach (array_values((array) $options) as $index => $optionText) {
            if (is_string($optionText) && trim($optionText) !== '') {
                PollOption::create([
                    'poll_id' => $poll->id,
                    'option_text' => trim($optionText),
                    'sort_order' => $index,
                ]);
            }
        }
    }
}
