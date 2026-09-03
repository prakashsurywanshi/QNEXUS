<?php

namespace App\Http\Controllers;

use App\Models\PushNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Persists a browser Web Push subscription for a user so out-of-band push
 * notifications can be routed to them. Requires the Push Notification API.
 */
class PushSubscriptionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'endpoint' => ['required', 'string', 'url'],
            'public_key' => ['required', 'string'],
            'auth_token' => ['required', 'string'],
        ]);

        $societyId = $request->user()->society_id;

        PushNotification::updateOrCreate(
            ['user_id' => $request->user()->id, 'endpoint' => $data['endpoint']],
            [
                'public_key' => $data['public_key'],
                'auth_token' => $data['auth_token'],
                'society_id' => $societyId,
            ]
        );

        return response()->json(['success' => true]);
    }

    public function destroy(Request $request, string $endpoint): JsonResponse
    {
        PushNotification::where('user_id', $request->user()->id)
            ->where('endpoint', $endpoint)
            ->delete();

        return response()->json(['success' => true]);
    }
}
