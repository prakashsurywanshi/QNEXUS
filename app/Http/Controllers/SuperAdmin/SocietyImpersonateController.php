<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Society;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Allows the platform superadmin to temporarily log in as a user of a given
 * society (an admin OR any member) to view and manage the society from that
 * user's perspective. The original superadmin id is stored in the session so
 * the impersonation can be stopped at any time.
 */
class SocietyImpersonateController extends Controller
{
    /**
     * Log in as a specific, verified member of the given society.
     */
    public function impersonate(Request $request, Society $society, User $user): RedirectResponse
    {
        abort_if($user->society_id !== $society->id, 403, 'User does not belong to this society.');

        $superadmin = $request->user();

        // Store the superadmin's identity before switching.
        $request->session()->put('impersonate_user_id', $superadmin->id);
        $request->session()->put('impersonate_society_id', $society->id);

        // Switch context: clear cached context and log in as the target user.
        $request->session()->forget(['user', 'active_society_id', 'active_role_id', 'isRole', 'role_permissions', 'timezone']);

        Auth::loginUsingId($user->id);

        // Set the society context for the impersonated session.
        $request->session()->put('active_society_id', $society->id);

        // Refresh context so the helper functions pick up the new user/society.
        refresh_context_for_user();

        return redirect()->route('dashboard');
    }

    /**
     * Stop impersonating and return to the superadmin portal.
     */
    public function stop(Request $request): RedirectResponse
    {
        $superadminId = $request->session()->get('impersonate_user_id');
        $societyId = $request->session()->get('impersonate_society_id');

        if (! $superadminId) {
            return redirect()->route('superadmin.dashboard');
        }

        // Clear all impersonation-related session data.
        $request->session()->forget([
            'impersonate_user_id',
            'impersonate_society_id',
            'active_society_id',
            'active_role_id',
            'isRole',
            'role_permissions',
            'timezone',
            'user',
        ]);

        // Log back in as the superadmin.
        Auth::loginUsingId($superadminId);

        refresh_context_for_user();

        return redirect()->route('superadmin.dashboard');
    }
}
