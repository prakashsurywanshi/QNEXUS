<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Honours the global `disable_landing_site` toggle. When enabled, public
 * visitors hitting the marketing site are redirected to the login page.
 */
class DisableLandingSite
{
    public function handle(Request $request, Closure $next): Response
    {
        $settings = \global_setting();

        if ($settings && $settings->disable_landing_site && ! $request->expectsJson()) {
            return redirect()->route('login');
        }

        return $next($request);
    }
}
