<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\VisitorPreapproval;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitorPreapprovalController extends RoleAwareApiController
{
    public function index(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $query = VisitorPreapproval::with('user', 'apartment');

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
            'visitor_name' => 'required|string|max:255',
            'visitor_phone' => 'required|string|max:30',
            'expected_arrival' => 'nullable|date',
            'purpose' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $preapproval = VisitorPreapproval::create([
            'society_id' => $society->id,
            'user_id' => $this->authUser()->id,
            'visitor_name' => $validated['visitor_name'],
            'visitor_phone' => $validated['visitor_phone'],
            'expected_arrival' => $validated['expected_arrival'] ?? null,
            'purpose' => $validated['purpose'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return $this->created($preapproval->load('user'), 'Visitor pre-approved');
    }
}
