<?php

namespace App\Http\Middleware;

use App\Models\Society;
use App\Scopes\SocietyScope;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Blocks society members from the portal when their society has been
 * deactivated by the platform admin. Super-admins (not bound to any
 * society) are never affected.
 */
class EnsureActiveSociety
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user !== null && ! is_null($user->society_id)) {
            $society = Society::withoutGlobalScope(SocietyScope::class)
                ->whereKey($user->society_id)
                ->first();

            if ($society !== null && ! (bool) $society->is_active) {
                abort(
                    403,
                    'This society has been deactivated by the platform admin. Please contact support.',
                );
            }
        }

        return $next($request);
    }
}
