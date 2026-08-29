<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\VisitorManagement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitorController extends RoleAwareApiController
{
    public function index(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $query = VisitorManagement::where('society_id', $society->id);

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        $query->with('apartment');

        $visitors = $query->orderByDesc('id')->paginate($request->get('per_page', 15));

        return $this->paginated($visitors);
    }

    public function checkin(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $this->authorizeRole(['Guard', 'Admin', 'Manager']);

        $validated = $request->validate([
            'visitor_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:255',
            'apartment_id' => 'nullable|integer',
            'date_of_visit' => 'nullable|date',
            'purpose_of_visit' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        $visitor = new VisitorManagement();
        $visitor->society_id = $society->id;
        $visitor->visitor_name = $validated['visitor_name'];
        $visitor->phone_number = $validated['phone_number'] ?? null;
        $visitor->apartment_id = $validated['apartment_id'] ?? null;
        $visitor->date_of_visit = $validated['date_of_visit'] ?? now()->toDateString();
        $visitor->purpose_of_visit = $validated['purpose_of_visit'] ?? null;
        $visitor->address = $validated['address'] ?? null;
        $visitor->user_id = $this->authUser()->id;
        $visitor->added_by = $this->authUser()->id;
        $visitor->status = 'active';
        $visitor->in_time = now()->toTimeString();
        $visitor->save();

        return $this->created($visitor, 'Visitor checked in');
    }

    public function checkout(Request $request, $id): JsonResponse
    {
        $society = $this->requireSociety();

        $this->authorizeRole(['Guard', 'Admin', 'Manager']);

        $visitor = VisitorManagement::where('society_id', $society->id)->find($id);

        if (!$visitor) {
            return $this->notFound('Visitor not found.');
        }

        $visitor->status = 'exited';
        $visitor->out_time = now()->toTimeString();
        $visitor->date_of_exit = now()->toDateString();
        $visitor->save();

        return $this->success($visitor, 'Visitor checked out');
    }
}
