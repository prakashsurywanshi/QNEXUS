<?php

use App\Models\Society;

if (!function_exists('refresh_context_for_user')) {

    /**
     * Invalidate session-cached context whenever the authenticated user changes
     * (login, logout, acting-as or society switch).
     */
    function refresh_context_for_user(): void
    {
        $authUser = auth()->user();
        $uid = $authUser ? $authUser->id : null;

        if (session('context_user') !== $uid) {
            session()->forget([
                'user',
                'active_society_id',
                'active_role_id',
                'isRole',
                'role_permissions',
                'society',
            ]);
            session(['context_user' => $uid]);
        }
    }
}

if (!function_exists('user')) {

    /**
     * Return the current logged-in user (memorised for the request/session).
     *
     * @return \App\Models\User|\Illuminate\Contracts\Auth\Authenticatable|null
     */
    function user()
    {
        refresh_context_for_user();

        if (session()->has('user')) {
            return session('user');
        }

        $authUser = auth()->user();

        if ($authUser) {
            session(['user' => $authUser]);

            return $authUser;
        }

        return null;
    }
}

if (!function_exists('active_society_id')) {

    /**
     * The id of the society currently active for the logged-in user.
     * Falls back to the legacy single `society_id` column on the user row.
     */
    function active_society_id()
    {
        refresh_context_for_user();

        if (session()->has('active_society_id') && session('active_society_id')) {
            return session('active_society_id');
        }

        if (user() && user()->society_id) {
            session(['active_society_id' => user()->society_id]);

            return user()->society_id;
        }

        return null;
    }
}

if (!function_exists('active_role_id')) {

    /**
     * The id of the role currently active for the user within the active society.
     */
    function active_role_id()
    {
        refresh_context_for_user();

        if (session()->has('active_role_id') && session('active_role_id')) {
            return session('active_role_id');
        }

        $userId = user() ? user()->id : null;
        $societyId = active_society_id();

        if ($userId && $societyId) {
            $pivot = \App\Models\SocietyUser::where('user_id', $userId)
                ->where('society_id', $societyId)
                ->first();

            if ($pivot && $pivot->role_id) {
                session(['active_role_id' => $pivot->role_id]);

                return $pivot->role_id;
            }
        }

        // Legacy fallback: the direct role_id on the user row.
        if (user() && user()->role_id) {
            session(['active_role_id' => user()->role_id]);

            return user()->role_id;
        }

        return null;
    }
}

if (!function_exists('society')) {

    /**
     * Return the society currently active for the logged-in user.
     *
     * @return \App\Models\Society|false
     */
    function society()
    {
        refresh_context_for_user();

        if (session()->has('society')) {
            return session('society');
        }

        if (active_society_id()) {
            $model = Society::find(active_society_id());
            session(['society' => $model]);

            return $model;
        }

        return false;
    }
}

if (!function_exists('isRole')) {

    /**
     * Return the display name of the currently active role.
     */
    function isRole()
    {
        refresh_context_for_user();

        if (session()->has('isRole')) {
            return session('isRole');
        }

        $roleId = active_role_id();
        $roleName = $roleId
            ? \App\Models\Role::where('id', $roleId)
                ->withoutGlobalScope(\App\Scopes\SocietyScope::class)
                ->value('display_name')
            : null;

        if ($roleName) {
            session(['isRole' => $roleName]);

            return $roleName;
        }

        return null;
    }
}

if (!function_exists('role_permissions')) {

    /**
     * Array of permission names granted to the currently active role.
     *
     * @return array<int, string>
     */
    function role_permissions()
    {
        refresh_context_for_user();

        if (session()->has('role_permissions')) {
            return session('role_permissions');
        }

        $roleId = active_role_id();
        $permissions = $roleId
            ? \App\Models\Role::where('id', $roleId)
                ->withoutGlobalScope(\App\Scopes\SocietyScope::class)
                ->first()?->permissions
                ->pluck('name')
                ->toArray()
            : [];

        $permissions = $permissions ?: [];

        session(['role_permissions' => $permissions]);

        return $permissions;
    }
}

if (!function_exists('user_can')) {

    /**
     * Whether the current user's active role holds the given permission.
     */
    function user_can(string $permission): bool
    {
        return in_array($permission, role_permissions(), true);
    }
}

if (!function_exists('timezone')) {

    function timezone()
    {
        if (session()->has('timezone')) {
            return session('timezone');
        }

        $tz = society() ? society()->timezone : 'Asia/Kolkata';
        session(['timezone' => $tz]);

        return $tz;
    }
}

if (!function_exists('moduleAppliesToType')) {

    /**
     * Whether a module applies to a given society property type.
     */
    function moduleAppliesToType($module, $propertyType): bool
    {
        $bucket = config("modules.module_types.{$module}", 'both');

        if ($bucket === 'both' || $bucket === $propertyType || $propertyType === 'mixed') {
            return true;
        }

        return false;
    }
}

if (!function_exists('effective_property_type')) {

    /**
     * The resolved property type, honouring a per-session view-type override
     * (lets a mixed-society user focus on the residential or commercial view).
     */
    function effective_property_type()
    {
        if (session()->has('view_type') && session('view_type')) {
            return session('view_type');
        }

        $society = society();

        return $society ? $society->property_type : null;
    }
}

if (!function_exists('society_is_type')) {

    /**
     * Whether the active society matches one of the given property types.
     */
    function society_is_type($types): bool
    {
        $society = society();

        if (!$society) {
            return false;
        }

        return in_array(effective_property_type(), (array) $types, true);
    }
}

if (!function_exists('global_setting')) {

    /**
     * The platform-wide GlobalSetting singleton (branding, SEO, landing site
     * toggle, social links, locale/timezone). Memorised per request.
     *
     * @return \App\Models\GlobalSetting|null
     */
    function global_setting()
    {
        static $settings = null;
        static $resolved = false;

        if (!$resolved) {
            $settings = \App\Models\GlobalSetting::first();
            $resolved = true;
        }

        return $settings;
    }
}

if (!function_exists('is_superadmin')) {

    /**
     * Whether the current user is a platform-level superadmin, i.e. a user
     * that is not bound to any single society (society_id is null).
     */
    function is_superadmin(): bool
    {
        $user = user();

        return $user !== null && is_null($user->society_id);
    }
}

if (!function_exists('asset_url_local_s3')) {

    /**
     * Build a URL for a stored asset. Supports S3-compatible disks when the
     * configured default disk matches, otherwise falls back to local uploads.
     */
    function asset_url_local_s3($path)
    {
        $StorageSetting = class_exists(\App\Models\StorageSetting::class)
            ? new \App\Models\StorageSetting()
            : null;

        if (in_array(config('filesystems.default'), $StorageSetting ? $StorageSetting::S3_COMPATIBLE_STORAGE : [])) {
            if (\Illuminate\Support\Facades\Cache::has(config('filesystems.default') . '-' . $path)) {
                return \Illuminate\Support\Facades\Cache::get(config('filesystems.default') . '-' . $path);
            }

            $temporaryUrl = Storage::disk(config('filesystems.default'))->temporaryUrl($path, now()->addMinutes($StorageSetting::HASH_TEMP_FILE_TIME));
            \Illuminate\Support\Facades\Cache::put(config('filesystems.default') . '-' . $path, $temporaryUrl, $StorageSetting::HASH_TEMP_FILE_TIME * 60);

            return $temporaryUrl;
        }

        $storageUrl = \App\Helper\Files::UPLOAD_FOLDER . '/' . $path;

        if (!Str::startsWith($storageUrl, 'http')) {
            return url($storageUrl);
        }

        return $storageUrl;
    }
}
