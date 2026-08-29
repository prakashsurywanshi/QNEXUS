<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

/**
 * Ensures the web request has a resolved tenancy context (active society,
 * active role) and shares it with the Inertia front-end so the UI can be
 * society/role aware.
 */
class SetActiveSociety
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            \refresh_context_for_user();

            $activeSocietyId = active_society_id();

            if ($activeSocietyId) {
                $activeSociety = \society() ?: null;
                $activeRoleName = \isRole();

                Inertia::share('tenancy', fn () => [
                    'society' => $activeSociety ? [
                        'id' => $activeSociety->id,
                        'name' => $activeSociety->name,
                        'slug' => $activeSociety->slug,
                        'property_type' => $activeSociety->property_type,
                    ] : null,
                    'role' => $activeRoleName,
                    'permissions' => \role_permissions(),
                    'switchable' => $request->user()
                        ? $request->user()->societyUser()
                            ?->with('society')
                            ->get()
                            ->map(fn ($pivot) => [
                                'id' => $pivot->society_id,
                                'name' => $pivot->society?->name,
                            ])
                            ->values()
                        : [],
                ]);
            }
        }

        return $next($request);
    }
}
