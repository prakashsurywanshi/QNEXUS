<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\ServiceManagement;
use App\Models\ServiceRequest;
use App\Models\ServiceRequestReply;
use App\Models\SocietyUser;
use App\Models\User;
use App\Scopes\SocietyScope;
use App\Services\Notifier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ServiceRequest::with(['user', 'assignee', 'serviceProvider'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return Inertia::render('service-requests/index', [
            'serviceRequests' => $query->paginate(20)->withQueryString(),
            'statusCounts' => ServiceRequest::selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),
            'statuses' => ['request', 'quoted', 'approved', 'assigned', 'in_progress', 'payment_pending', 'feedback', 'completed', 'cancelled'],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('service-requests/create', [
            'serviceTypes' => ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Pest Control', 'Painting', 'Appliance Repair', 'General Maintenance', 'Landscaping', 'Security', 'Other'],
            'priorities' => ['low', 'medium', 'high', 'urgent'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'service_type' => ['required', 'string', 'max:255'],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
        ]);

        ServiceRequest::create([
            'society_id' => active_society_id(),
            'user_id' => auth()->id(),
            'service_type' => $data['service_type'],
            'subject' => $data['subject'],
            'description' => $data['description'] ?? null,
            'priority' => $data['priority'],
            'status' => 'request',
        ]);

        Notifier::notifyUsersWithPermission(
            active_society_id(),
            'Show Service Requests',
            'service_requests',
            ['title' => 'New Service Request', 'body' => $data['subject'], 'link' => '/service-requests'],
        );

        return redirect()->route('service-requests.index');
    }

    public function show(ServiceRequest $serviceRequest): Response
    {
        $serviceRequest->load(['user', 'assignee', 'serviceProvider', 'replies.user']);

        return Inertia::render('service-requests/show', [
            'serviceRequest' => $serviceRequest,
            'current_user_id' => auth()->id(),
            'serviceProviders' => ServiceManagement::where('status', 'available')->get(['id', 'company_name']),
            'agents' => $this->agentsForSociety(),
            'statuses' => ['request', 'quoted', 'approved', 'assigned', 'in_progress', 'payment_pending', 'feedback', 'completed', 'cancelled'],
        ]);
    }

    /** @return Collection<int, User> */
    private function agentsForSociety(): Collection
    {
        $managerRoleId = Role::withoutGlobalScope(SocietyScope::class)
            ->where('society_id', active_society_id())
            ->where('display_name', 'Manager')
            ->value('id');

        if (! $managerRoleId) {
            return collect();
        }

        return SocietyUser::where('society_id', active_society_id())
            ->where('role_id', $managerRoleId)
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter()
            ->values();
    }

    public function edit(ServiceRequest $serviceRequest): Response
    {
        return Inertia::render('service-requests/edit', [
            'serviceRequest' => $serviceRequest,
            'serviceTypes' => ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Pest Control', 'Painting', 'Appliance Repair', 'General Maintenance', 'Landscaping', 'Security', 'Other'],
            'priorities' => ['low', 'medium', 'high', 'urgent'],
        ]);
    }

    public function update(Request $request, ServiceRequest $serviceRequest): RedirectResponse
    {
        $data = $request->validate([
            'subject' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'service_type' => ['sometimes', 'string', 'max:255'],
            'priority' => ['sometimes', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'status' => ['sometimes', Rule::in(['request', 'quoted', 'approved', 'assigned', 'in_progress', 'payment_pending', 'feedback', 'completed', 'cancelled'])],
            'quote_amount' => ['nullable', 'numeric', 'min:0'],
            'quote_notes' => ['nullable', 'string'],
            'quote_valid_until' => ['nullable', 'date'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'service_provider_id' => ['nullable', 'exists:service_management,id'],
            'scheduled_date' => ['nullable', 'date'],
            'completion_notes' => ['nullable', 'string'],
            'payment_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_status' => ['nullable', Rule::in(['unpaid', 'paid'])],
            'rating' => ['nullable', 'integer', 'between:1,5'],
            'feedback' => ['nullable', 'string'],
        ]);

        if (isset($data['status']) && $data['status'] === 'completed' && ! $serviceRequest->completed_at) {
            $data['completed_at'] = now();
        }

        $serviceRequest->update($data);

        return redirect()->route('service-requests.show', $serviceRequest);
    }

    public function destroy(ServiceRequest $serviceRequest): RedirectResponse
    {
        $serviceRequest->delete();

        return redirect()->route('service-requests.index');
    }

    public function quote(Request $request, ServiceRequest $serviceRequest): RedirectResponse
    {
        $data = $request->validate([
            'quote_amount' => ['required', 'numeric', 'min:0'],
            'quote_notes' => ['nullable', 'string'],
            'quote_valid_until' => ['nullable', 'date', 'after:today'],
        ]);

        $serviceRequest->update([
            'status' => 'quoted',
            'quote_amount' => $data['quote_amount'],
            'quote_notes' => $data['quote_notes'] ?? null,
            'quote_valid_until' => $data['quote_valid_until'] ?? null,
        ]);

        Notifier::notify(
            $serviceRequest->user_id,
            'service_requests',
            ['title' => 'Quote Received', 'body' => "A quote of {$data['quote_amount']} has been provided for your request.", 'link' => "/service-requests/{$serviceRequest->id}"],
        );

        return redirect()->route('service-requests.show', $serviceRequest);
    }

    public function assign(Request $request, ServiceRequest $serviceRequest): RedirectResponse
    {
        $data = $request->validate([
            'assigned_to' => ['nullable', 'exists:users,id'],
            'service_provider_id' => ['nullable', 'exists:service_management,id'],
            'scheduled_date' => ['nullable', 'date'],
        ]);

        $serviceRequest->update([
            'status' => 'assigned',
            'assigned_to' => $data['assigned_to'] ?? null,
            'service_provider_id' => $data['service_provider_id'] ?? null,
            'scheduled_date' => $data['scheduled_date'] ?? null,
        ]);

        if ($serviceRequest->assigned_to) {
            Notifier::notify(
                $serviceRequest->assigned_to,
                'service_requests',
                ['title' => 'Service Request Assigned', 'body' => "You have been assigned: {$serviceRequest->subject}", 'link' => "/service-requests/{$serviceRequest->id}"],
            );
        }

        return redirect()->route('service-requests.show', $serviceRequest);
    }

    public function advance(ServiceRequest $serviceRequest): RedirectResponse
    {
        $nextStatus = match ($serviceRequest->status) {
            'request', 'quoted' => 'approved',
            'approved' => 'assigned',
            'assigned' => 'in_progress',
            'in_progress' => 'payment_pending',
            'payment_pending' => 'feedback',
            'feedback' => 'completed',
            default => null,
        };

        if (! $nextStatus) {
            return back()->withErrors(['status' => 'Cannot advance from current status.']);
        }

        $data = ['status' => $nextStatus];

        if ($nextStatus === 'completed') {
            $data['completed_at'] = now();
        }

        $serviceRequest->update($data);

        return redirect()->route('service-requests.show', $serviceRequest);
    }

    public function reply(Request $request, ServiceRequest $serviceRequest): RedirectResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string'],
        ]);

        ServiceRequestReply::create([
            'service_request_id' => $serviceRequest->id,
            'user_id' => auth()->id(),
            'message' => $data['message'],
        ]);

        $notifyUserId = $serviceRequest->user_id === auth()->id() ? $serviceRequest->assigned_to : $serviceRequest->user_id;

        if ($notifyUserId) {
            Notifier::notify(
                $notifyUserId,
                'service_requests',
                ['title' => 'New Reply on Service Request', 'body' => Str::limit($data['message'], 100), 'link' => "/service-requests/{$serviceRequest->id}"],
            );
        }

        return back();
    }
}
