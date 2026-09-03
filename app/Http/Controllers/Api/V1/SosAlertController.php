<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\SosAlert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SosAlertController extends RoleAwareApiController
{
    public function store(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $validated = $request->validate([
            'message' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        $alert = new SosAlert;
        $alert->society_id = $society->id;
        $alert->user_id = $this->authUser()->id;
        $alert->message = $validated['message'] ?? 'SOS Alert';
        $alert->location = $validated['location'] ?? null;
        $alert->save();

        return $this->created($alert, 'SOS alert raised');
    }
}
