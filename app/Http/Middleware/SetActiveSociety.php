<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

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
                        'logo' => $activeSociety->logo_url,
                        'theme_hex' => $activeSociety->theme_hex,
                        'theme_rgb' => $activeSociety->theme_rgb,
                        'show_logo_text' => $activeSociety->show_logo_text,
                    ] : null,
                    'role' => $activeRoleName,
                    'permissions' => \role_permissions(),
                    'enabledModules' => \enabled_module_names(),
                    'switchable' => $request->user()
                        ? $request->user()->societyUsers()
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
