<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Enforces package feature entitlement: aborts with 403 unless the active
 * society's package entitles the requested module (e.g. `module:Energy`).
 *
 * When no package is assigned the module is treated as enabled (behaviour
 * mirrors enabled_module_names(), which falls back to all modules).
 */
class EnsureModuleEnabled
{
    public function handle(Request $request, Closure $next, string $module): Response
    {
        if (! \module_enabled($module)) {
            abort(403, 'This module is not included in your current plan.');
        }

        return $next($request);
    }
}
