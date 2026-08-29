<?php

namespace App\Http\Controllers;

use App\Models\Society;
use App\Models\SocietyUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * Switches the authenticated web user's active society (and role) within the
 * session so the rest of the app resolves tenancy context through the helpers.
 */
class SocietySwitchController extends Controller
{
    public function __invoke(Request $request, int $societyId): RedirectResponse
    {
        abort_unless($request->user(), 403);

        $membership = SocietyUser::where('user_id', $request->user()->id)
            ->where('society_id', $societyId)
            ->first();

        if (!$membership) {
            throw ValidationException::withMessages([
                'society' => 'You do not belong to that society.',
            ]);
        }

        $society = Society::find($societyId);

        session()->forget([
            'society',
            'active_role_id',
            'isRole',
            'role_permissions',
            'timezone',
        ]);

        session(['active_society_id' => $societyId]);
        session(['society' => $society]);
        session(['active_role_id' => $membership->role_id]);

        if ($membership->role_id) {
            session(['isRole' => $membership->role->display_name]);
        }

        return redirect()->back();
    }
}
