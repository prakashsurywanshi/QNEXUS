<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketReply;
use App\Models\TicketTypeSetting;
use App\Services\Notifier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('tickets/index', [
            'tickets' => Ticket::with(['user', 'ticketType'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tickets/create', [
            'types' => TicketTypeSetting::get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'type_id' => ['nullable', 'integer'],
        ]);

        $societyId = active_society_id();

        $ticket = new Ticket([
            'society_id' => $societyId,
            'user_id' => auth()->id(),
            'subject' => $data['subject'],
            'type_id' => $data['type_id'] ?? null,
            'status' => 'open',
        ]);

        $ticket->ticket_number = (Ticket::where('society_id', $societyId)->max('ticket_number') ?? 0) + 1;
        $ticket->save();

        Notifier::notifyUsersWithPermission(
            (string) $societyId,
            'Show Tickets',
            Notifier::CATEGORY_TICKETS,
            [
                'title' => 'New ticket raised',
                'body' => $ticket->subject,
                'link' => route('tickets.show', $ticket->id),
            ],
        );

        return redirect()->route('tickets.show', $ticket->id);
    }

    public function show(Ticket $ticket): Response
    {
        return Inertia::render('tickets/show', [
            'ticket' => $ticket->load(['user', 'ticketType', 'reply' => fn ($q) => $q->with('user')->latest()]),
        ]);
    }

    public function reply(Request $request, Ticket $ticket): RedirectResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        TicketReply::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'message' => $data['message'],
        ]);

        if ($ticket->user_id && $ticket->user_id !== auth()->id()) {
            Notifier::notify($ticket->user_id, Notifier::CATEGORY_TICKETS, [
                'title' => 'New reply on your ticket',
                'body' => $ticket->subject,
                'link' => route('tickets.show', $ticket->id),
            ]);
        }

        return redirect()->route('tickets.show', $ticket->id);
    }

    public function edit(Ticket $ticket): Response
    {
        return Inertia::render('tickets/edit', [
            'ticket' => $ticket,
            'types' => TicketTypeSetting::get(),
        ]);
    }

    public function update(Request $request, Ticket $ticket): RedirectResponse
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'type_id' => ['nullable', 'integer'],
            'status' => ['required', 'in:open,pending,resolved,closed'],
        ]);

        $ticket->update($data);

        return redirect()->route('tickets.show', $ticket->id);
    }

    public function destroy(Ticket $ticket): RedirectResponse
    {
        $ticket->delete();

        return redirect()->route('tickets.index');
    }
}
