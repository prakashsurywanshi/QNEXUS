<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\ServiceRequest;
use App\Models\ServiceRequestReply;
use App\Services\Notifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ServiceRequestController extends RoleAwareApiController
{
    public function index(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $query = ServiceRequest::with('user', 'assignee', 'serviceProvider', 'replies');

        if ($this->roleIs(['Owner', 'Tenant'])) {
            $query->where('user_id', $this->authUser()->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        $items = $query->where('society_id', $society->id)
            ->orderByDesc('id')
            ->paginate((int) $request->get('per_page', 15));

        return $this->paginated($items);
    }

    public function store(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string',
            'service_type' => 'required|string|max:255',
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
        ]);

        $serviceRequest = ServiceRequest::create([
            'society_id' => $society->id,
            'user_id' => $this->authUser()->id,
            'subject' => $validated['subject'],
            'description' => $validated['description'] ?? null,
            'service_type' => $validated['service_type'],
            'priority' => $validated['priority'],
            'status' => 'request',
        ]);

        Notifier::notifyUsersWithPermission(
            (string) $society->id,
            'Show Service Requests',
            'service_requests',
            ['title' => 'New Service Request', 'body' => $validated['subject'], 'link' => '/service-requests'],
        );

        return $this->created($serviceRequest->load('user', 'replies'), 'Service request created');
    }

    public function show(Request $request, $id): JsonResponse
    {
        $society = $this->requireSociety();

        $serviceRequest = ServiceRequest::with('user', 'assignee', 'serviceProvider', 'replies.user')
            ->where('society_id', $society->id)
            ->find($id);

        if (! $serviceRequest) {
            return $this->notFound('Service request not found.');
        }

        if ($this->roleIs(['Owner', 'Tenant']) && $serviceRequest->user_id !== $this->authUser()->id) {
            return $this->forbidden('You can only view your own service requests.');
        }

        return $this->success($serviceRequest, 'Service request fetched');
    }

    public function reply(Request $request, $id): JsonResponse
    {
        $society = $this->requireSociety();

        $serviceRequest = ServiceRequest::where('society_id', $society->id)->find($id);

        if (! $serviceRequest) {
            return $this->notFound('Service request not found.');
        }

        if ($this->roleIs(['Owner', 'Tenant']) && $serviceRequest->user_id !== $this->authUser()->id) {
            return $this->forbidden('You can only reply to your own service requests.');
        }

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $reply = ServiceRequestReply::create([
            'service_request_id' => $serviceRequest->id,
            'user_id' => $this->authUser()->id,
            'message' => $validated['message'],
        ]);

        return $this->created($reply->load('user'), 'Reply added');
    }

    public function quote(Request $request, $id): JsonResponse
    {
        $society = $this->requireSociety();
        $this->authorizePermission('Update Service Requests');

        $serviceRequest = ServiceRequest::where('society_id', $society->id)->find($id);

        if (! $serviceRequest) {
            return $this->notFound('Service request not found.');
        }

        $validated = $request->validate([
            'quote_amount' => 'required|numeric|min:0',
            'quote_notes' => 'nullable|string',
            'quote_valid_until' => 'nullable|date|after:today',
        ]);

        $serviceRequest->update([
            'status' => 'quoted',
            'quote_amount' => $validated['quote_amount'],
            'quote_notes' => $validated['quote_notes'] ?? null,
            'quote_valid_until' => $validated['quote_valid_until'] ?? null,
        ]);

        Notifier::notify(
            $serviceRequest->user_id,
            'service_requests',
            ['title' => 'Quote Received', 'body' => "A quote of {$validated['quote_amount']} has been provided for your request.", 'link' => "/service-requests/{$serviceRequest->id}"],
        );

        return $this->success($serviceRequest->fresh(), 'Quote submitted');
    }

    public function advance(Request $request, $id): JsonResponse
    {
        $society = $this->requireSociety();
        $this->authorizePermission('Update Service Requests');

        $serviceRequest = ServiceRequest::where('society_id', $society->id)->find($id);

        if (! $serviceRequest) {
            return $this->notFound('Service request not found.');
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['approved', 'assigned', 'in_progress', 'payment_pending', 'feedback', 'completed', 'cancelled'])],
            'assigned_to' => 'nullable|integer|exists:users,id',
            'service_provider_id' => 'nullable|integer|exists:service_management,id',
            'scheduled_date' => 'nullable|date',
            'completion_notes' => 'nullable|string',
        ]);

        $serviceRequest->status = $validated['status'];

        if (isset($validated['assigned_to'])) {
            $serviceRequest->assigned_to = $validated['assigned_to'];
        }

        if (isset($validated['service_provider_id'])) {
            $serviceRequest->service_provider_id = $validated['service_provider_id'];
        }

        if (isset($validated['scheduled_date'])) {
            $serviceRequest->scheduled_date = $validated['scheduled_date'];
        }

        if ($validated['status'] === 'completed') {
            $serviceRequest->completion_notes = $validated['completion_notes'] ?? null;
            $serviceRequest->completed_at = now();
        }

        $serviceRequest->save();

        return $this->success($serviceRequest->fresh(), 'Service request status updated');
    }
}
