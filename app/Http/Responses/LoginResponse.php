<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Redirect a successfully authenticated user to the correct portal.
     *
     * A platform user (society_id === null) is routed to the QNEXUS
     * management dashboard. Society members are routed to their own
     * role-aware member dashboard (Fortify's default redirect target).
     *
     * @param  mixed  $request
     */
    public function toResponse($request): Response
    {
        if ($request instanceof Request) {
            $user = $request->user();

            if ($user !== null && $user->society_id === null) {
                return $request->wantsJson()
                    ? response()->json(['two_factor' => false])
                    : redirect()->intended(route('superadmin.dashboard'));
            }

            if ($request->wantsJson()) {
                return response()->json(['two_factor' => false]);
            }
        }

        return redirect()->intended(config('fortify.home'));
    }
}
