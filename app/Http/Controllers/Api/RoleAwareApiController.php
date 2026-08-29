<?php

namespace App\Http\Controllers\Api;

use App\Models\Role;
use App\Models\Society;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Base controller for role-aware mobile API endpoints.
 *
 * It resolves the authenticated user's tenancy context (active society + role)
 * once per request and exposes helpers to guard against the five society roles
 * (Admin, Manager, Owner, Tenant, Guard) and to scope queries to the active
 * society automatically.
 */
abstract class RoleAwareApiController extends BaseApiController
{
    use AuthorizesRequests;

    protected ?User $authUser = null;

    protected ?Society $activeSociety = null;

    protected ?Role $activeRole = null;

    protected array $tenantScopes = [];

    public function __construct()
    {
        // The built-in scope middleware resolves tenant context eagerly so that
        // every query in the request is automatically society-scoped.
        $this->middleware(function (Request $request, $next) {
            $this->resolveContext();

            return $next($request);
        });
    }

    /**
     * Resolve the authenticated user, active society and active role once.
     */
    protected function resolveContext(): void
    {
        $this->authUser = \user();

        if ($this->authUser && $this->authUser->society_id) {
            $this->activeSociety = \App\Models\Society::find($this->authUser->society_id);
        } else {
            $this->activeSociety = null;
        }

        $this->activeRole = $this->resolveActiveRole();
    }

    /**
     * Resolve the active Role model for the current user + society.
     */
    protected function resolveActiveRole(): ?Role
    {
        $roleId = \active_role_id();

        if (!$roleId) {
            return null;
        }

        return Role::where('id', $roleId)
            ->withoutGlobalScope(\App\Scopes\SocietyScope::class)
            ->first();
    }

    /**
     * The authenticated user.
     */
    protected function authUser(): ?User
    {
        return $this->authUser;
    }

    /**
     * The active Society model (null when unresolved).
     */
    protected function activeSociety(): ?Society
    {
        $this->resolveContext();

        return $this->activeSociety;
    }

    /**
     * The active Role model (null when unresolved).
     */
    protected function activeRole(): ?Role
    {
        $this->resolveContext();

        return $this->activeRole;
    }

    /**
     * The display name of the active role: Admin|Manager|Owner|Tenant|Guard.
     */
    protected function roleName(): ?string
    {
        $this->resolveContext();

        return $this->activeRole?->display_name;
    }

    /**
     * Whether the active role is one of the given display names.
     */
    protected function roleIs(array $names): bool
    {
        return in_array($this->roleName(), $names, true);
    }

    /**
     * Whether the active role can perform the given permission.
     */
    protected function can(string $permission): bool
    {
        if (!$this->activeRole) {
            return false;
        }

        return in_array($permission, $this->rolePermissionNames(), true);
    }

    /**
     * All permission names granted to the active role.
     */
    protected function rolePermissionNames(): array
    {
        $this->resolveContext();

        return $this->activeRole?->permissions->pluck('name')->toArray() ?? [];
    }

    /**
     * Abort with 403 unless the active role is one of the given names.
     */
    protected function authorizeRole(array $names): void
    {
        if (!$this->roleIs($names)) {
            abort(response()->json([
                'success' => false,
                'message' => 'You do not have permission to perform this action.',
            ], 403));
        }
    }

    /**
     * Abort with 403 unless the active role has the given permission.
     */
    protected function authorizePermission(string $permission): void
    {
        if (!$this->can($permission)) {
            abort(response()->json([
                'success' => false,
                'message' => 'Forbidden. You lack permission: ' . $permission,
            ], 403));
        }
    }

    /**
     * Require an authenticated user, otherwise 401.
     */
    protected function requireAuth(): void
    {
        $this->resolveContext();

        if (!$this->authUser) {
            abort(response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401));
        }
    }

    /**
     * Require an active society, otherwise 404/403.
     */
    protected function requireSociety(): Society
    {
        $this->resolveContext();
        $this->requireAuth();

        if (!$this->activeSociety) {
            abort(response()->json([
                'success' => false,
                'message' => 'No active society for this user.',
            ], 404));
        }

        return $this->activeSociety;
    }

    /**
     * Resolve a scoped Eloquent model by id within the active society, else 404.
     */
    protected function findOr404(string $modelClass, $id)
    {
        $query = $modelClass::query();

        if (in_array('society_id', $this->tenantColumns($modelClass), true)) {
            $query->where('society_id', $this->activeSociety?->id);
        }

        $model = $query->find($id);

        if (!$model) {
            throw new NotFoundHttpException('Resource not found.');
        }

        return $model;
    }

    /**
     * The list of tenant (society_id) columns a model's table may have.
     */
    protected function tenantColumns(string $modelClass): array
    {
        if (!isset($this->tenantScopes[$modelClass])) {
            $model = new $modelClass();
            $this->tenantScopes[$modelClass] = \Illuminate\Support\Facades\Schema::hasColumn($model->getTable(), 'society_id')
                ? ['society_id']
                : [];
        }

        return $this->tenantScopes[$modelClass];
    }
}
