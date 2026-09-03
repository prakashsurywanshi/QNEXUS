<?php

use App\Helper\Files;
use App\Models\GlobalSetting;
use App\Models\Package;
use App\Models\Role;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Models\StorageSetting;
use App\Models\User;
use App\Scopes\SocietyScope;
use App\Support\GlobalSettingCache;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Cache;

if (! function_exists('refresh_context_for_user')) {

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

if (! function_exists('user')) {

    /**
     * Return the current logged-in user (memorised for the request/session).
     *
     * @return User|Authenticatable|null
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

if (! function_exists('active_society_id')) {

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

if (! function_exists('active_role_id')) {

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
            $pivot = SocietyUser::where('user_id', $userId)
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

if (! function_exists('society')) {

    /**
     * Return the society currently active for the logged-in user.
     *
     * @return Society|false
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

if (! function_exists('isRole')) {

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
            ? Role::where('id', $roleId)
                ->withoutGlobalScope(SocietyScope::class)
                ->value('display_name')
            : null;

        if ($roleName) {
            session(['isRole' => $roleName]);

            return $roleName;
        }

        return null;
    }
}

if (! function_exists('role_permissions')) {

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
            ? Role::where('id', $roleId)
                ->withoutGlobalScope(SocietyScope::class)
                ->first()?->permissions
                ->pluck('name')
                ->toArray()
            : [];

        $permissions = $permissions ?: [];

        session(['role_permissions' => $permissions]);

        return $permissions;
    }
}

if (! function_exists('user_can')) {

    /**
     * Whether the current user's active role holds the given permission.
     */
    function user_can(string $permission): bool
    {
        return in_array($permission, role_permissions(), true);
    }
}

if (! function_exists('timezone')) {

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

if (! function_exists('moduleAppliesToType')) {

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

if (! function_exists('enabled_module_names')) {

    /**
     * The set of module names the active society's package entitles (the
     * purchased modules). Falls back to every configured module when the
     * society has no package assigned (e.g. super-admin or pre-provisioning).
     *
     * @return array<string>
     */
    function enabled_module_names(): array
    {
        if (session()->has('enabled_module_names') && session('enabled_module_names')) {
            return session('enabled_module_names');
        }

        $names = null;

        $activeSociety = society();

        if ($activeSociety && $activeSociety->package_id) {
            $names = Package::whereKey($activeSociety->package_id)
                ->with('modules')
                ->first()
                ?->modules
                ?->pluck('name')
                ?->values()
                ?->map(fn ($name) => (string) $name)
                ?->all();
        }

        if (! $names || count($names) === 0) {
            $names = array_keys(config('modules.modules'));
        }

        $names = array_values(array_unique(array_map('strval', (array) $names)));

        session(['enabled_module_names' => $names]);

        return $names;
    }
}

if (! function_exists('module_enabled')) {

    /**
     * Whether the active society's package entitles the given module.
     */
    function module_enabled(string $module): bool
    {
        return in_array($module, enabled_module_names(), true);
    }
}

if (! function_exists('effective_property_type')) {

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

if (! function_exists('society_is_type')) {

    /**
     * Whether the active society matches one of the given property types.
     */
    function society_is_type($types): bool
    {
        $society = society();

        if (! $society) {
            return false;
        }

        return in_array(effective_property_type(), (array) $types, true);
    }
}

if (! function_exists('global_setting')) {

    /**
     * The platform-wide GlobalSetting singleton (branding, SEO, landing site
     * toggle, social links, locale/timezone). Memorised per request.
     *
     * @return GlobalSetting|null
     */
    function global_setting()
    {
        return GlobalSettingCache::get();
    }

    if (! function_exists('forget_global_settings_cache')) {

        /**
         * Invalidate the cached global settings so the next call re-queries the
         * database (used after a DB refresh in long-running processes/tests).
         */
        function forget_global_settings_cache(): void
        {
            GlobalSettingCache::forget();
        }
    }
}

if (! function_exists('is_superadmin')) {

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

if (! function_exists('asset_url_local_s3')) {

    /**
     * Build a URL for a stored asset. Supports S3-compatible disks when the
     * configured default disk matches, otherwise falls back to local uploads.
     */
    function asset_url_local_s3($path)
    {
        $StorageSetting = class_exists(StorageSetting::class)
            ? new StorageSetting
            : null;

        if (in_array(config('filesystems.default'), $StorageSetting ? $StorageSetting::S3_COMPATIBLE_STORAGE : [])) {
            if (Cache::has(config('filesystems.default').'-'.$path)) {
                return Cache::get(config('filesystems.default').'-'.$path);
            }

            $temporaryUrl = Storage::disk(config('filesystems.default'))->temporaryUrl($path, now()->addMinutes($StorageSetting::HASH_TEMP_FILE_TIME));
            Cache::put(config('filesystems.default').'-'.$path, $temporaryUrl, $StorageSetting::HASH_TEMP_FILE_TIME * 60);

            return $temporaryUrl;
        }

        $storageUrl = Files::UPLOAD_FOLDER.'/'.$path;

        if (! Str::startsWith($storageUrl, 'http')) {
            return url($storageUrl);
        }

        return $storageUrl;
    }
}
