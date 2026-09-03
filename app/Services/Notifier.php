<?php

namespace App\Services;

use App\Models\NotificationPreference;
use App\Models\Role;
use App\Models\SocietyUser;
use App\Models\User;
use App\Scopes\SocietyScope;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Writes database-channel notifications so the bell + notifications page
 * have real producers. Respects each user's mute/snooze preferences.
 */
class Notifier
{
    public const CATEGORY_WORK_ORDERS = 'work_orders';

    public const CATEGORY_TICKETS = 'tickets';

    public const CATEGORY_NOTICES = 'notices';

    public const CATEGORY_APPROVALS = 'system';

    public const CATEGORY_VISITORS = 'visitors';

    /**
     * Notify a single user.
     *
     * @param  array{title: string, body?: string, link?: string}  $data
     */
    public static function notify(User|int|null $user, string $category, array $data): void
    {
        if (! $user) {
            return;
        }

        $user = $user instanceof User ? $user : User::find($user);

        if (! $user || self::isSuppressed($user, $category)) {
            return;
        }

        $user->notifications()->create([
            'id' => (string) Str::uuid(),
            'type' => 'App\\Notifications\\DatabaseNotification',
            'data' => [
                'category' => $category,
                'title' => $data['title'],
                'body' => $data['body'] ?? null,
                'link' => $data['link'] ?? null,
                'user_id' => auth()->id(),
            ],
        ]);

        NotificationDelivery::dispatch($user, $category, $data, $user->society_id);
    }

    /**
     * Notify every user in the society whose active role holds the permission.
     *
     * @param  array{title: string, body?: string, link?: string}  $data
     */
    public static function notifyUsersWithPermission(string $societyId, string $permission, string $category, array $data): void
    {
        $userId = auth()->id();

        $roleIds = Role::query()
            ->withoutGlobalScope(SocietyScope::class)
            ->where('society_id', $societyId)
            ->get()
            ->filter(fn (Role $role) => $role->permissions->pluck('name')->contains($permission))
            ->pluck('id');

        $excludeUserId = $userId === null ? null : (int) $userId;

        self::notifySocietyUsers($societyId, $roleIds, $excludeUserId, $category, $data);
    }

    /**
     * Broadcast to every member of the society (used for community notices).
     *
     * @param  array{title: string, body?: string, link?: string}  $data
     */
    public static function notifySociety(string $societyId, string $category, array $data): void
    {
        self::notifySocietyUsers($societyId, null, self::currentUserId(), $category, $data);
    }

    /**
     * @param  Collection<int, int>|null  $roleIds
     * @param  array{title: string, body?: string, link?: string}  $data
     */
    private static function notifySocietyUsers(string $societyId, $roleIds, ?int $excludeUserId, string $category, array $data): void
    {
        $query = SocietyUser::where('society_id', $societyId);

        if ($roleIds !== null && $roleIds->isNotEmpty()) {
            $query->whereIn('role_id', $roleIds);
        }

        if ($excludeUserId !== null) {
            $query->where('user_id', '!=', $excludeUserId);
        }

        $query->pluck('user_id')
            ->unique()
            ->each(function ($id) use ($category, $data) {
                self::notify((int) $id, $category, $data);
            });
    }

    private static function currentUserId(): ?int
    {
        $id = auth()->id();

        return $id === null ? null : (int) $id;
    }

    private static function isSuppressed(User $user, string $category): bool
    {
        $preference = NotificationPreference::firstOrNew(
            ['user_id' => $user->id, 'category' => $category]
        );

        return $preference->isSuppressed();
    }
}
