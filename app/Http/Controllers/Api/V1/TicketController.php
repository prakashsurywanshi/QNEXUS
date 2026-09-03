<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TicketController extends RoleAwareApiController
{
    public function index(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $query = Ticket::where('society_id', $society->id);

        if ($this->roleIs(['Owner', 'Tenant'])) {
            $query->where('user_id', $this->authUser()->id);
        }

        if ($this->roleIs(['Guard', 'Manager', 'Admin'])) {
            if ($request->has('status')) {
                $query->where('status', $request->query('status'));
            }
        }

        $tickets = $query->with('ticketType', 'user')->orderByDesc('id')->paginate($request->get('per_page', 15));

        return $this->paginated($tickets);
    }

    public function store(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'type_id' => 'nullable|integer|exists:ticket_type_settings,id',
        ]);

        $ticket = new Ticket;
        $ticket->society_id = $society->id;
        $ticket->ticket_number = (Ticket::where('society_id', $society->id)->max('ticket_number') ?? 0) + 1;
        $ticket->user_id = $this->authUser()->id;
        $ticket->type_id = $validated['type_id'] ?? null;
        $ticket->subject = $validated['subject'];
        $ticket->status = 'open';
        $ticket->save();

        return $this->created($ticket->load('ticketType'), 'Ticket created');
    }

    public function show(Request $request, $id): JsonResponse
    {
        $society = $this->requireSociety();

        $ticket = Ticket::where('society_id', $society->id)->find($id);

        if (! $ticket) {
            return $this->notFound('Ticket not found.');
        }

        if ($this->roleIs(['Owner', 'Tenant']) && $ticket->user_id !== $this->authUser()->id) {
            return $this->forbidden('You can only view your own tickets.');
        }

        $ticket->load('ticketType', 'user', 'reply', 'latestReply');

        return $this->success($ticket, 'Ticket fetched');
    }

    public function updateStatus(Request $request, $id): JsonResponse
    {
        $society = $this->requireSociety();

        $this->authorizeRole(['Admin', 'Manager', 'Guard']);

        $ticket = Ticket::where('society_id', $society->id)->find($id);

        if (! $ticket) {
            return $this->notFound('Ticket not found.');
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['open', 'pending', 'resolved', 'closed'])],
        ]);

        $ticket->status = $validated['status'];
        $ticket->save();

        return $this->success($ticket, 'Ticket status updated');
    }

    public function reply(Request $request, $id): JsonResponse
    {
        $society = $this->requireSociety();

        $ticket = Ticket::where('society_id', $society->id)->find($id);

        if (! $ticket) {
            return $this->notFound('Ticket not found.');
        }

        if ($this->roleIs(['Owner', 'Tenant']) && $ticket->user_id !== $this->authUser()->id) {
            return $this->forbidden('You can only reply to your own tickets.');
        }

        $validated = $request->validate([
            'reply' => 'required|string',
        ]);

        $reply = new TicketReply;
        $reply->ticket_id = $ticket->id;
        $reply->user_id = $this->authUser()->id;
        $reply->message = $validated['reply'];
        $reply->save();

        return $this->created($reply, 'Reply added');
    }
}
