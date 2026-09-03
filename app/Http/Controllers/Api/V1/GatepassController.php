<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\Gatepass;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GatepassController extends RoleAwareApiController
{
    public function index(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $query = Gatepass::with('apartment', 'user', 'approver');

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
}
