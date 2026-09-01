<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gates the platform-level SuperAdmin portal. A user is a superadmin when
 * they are not bound to any society (`society_id` is null).
 */
class EnsureSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        abort_if($user === null || ! is_null($user->society_id), 403, 'Super-admin access only.');

        return $next($request);
    }
}
