<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property bool $muted
 * @property Carbon|null $snooze_until
 */
class NotificationPreference extends Model
{
    protected $guarded = ['id'];

    public const CATEGORIES = [
        'work_orders' => 'Work Orders',
        'tickets' => 'Tickets & Requests',
        'notices' => 'Notice Board',
        'events' => 'Events & Polls',
        'visitors' => 'Visitors & Gatepasses',
        'security' => 'Security & SOS',
        'finance' => 'Payments & Dues',
        'community' => 'Community',
        'system' => 'System & Account',
    ];

    /** @return array<string, string> */
    public static function categories(): array
    {
        return self::CATEGORIES;
    }

    public function casts(): array
    {
        return [
            'muted' => 'boolean',
            'snooze_until' => 'datetime',
            'email_enabled' => 'boolean',
            'push_enabled' => 'boolean',
            'sms_enabled' => 'boolean',
        ];
    }

    public function isSuppressed(): bool
    {
        return $this->muted || ($this->snooze_until !== null && $this->snooze_until->isFuture());
    }

    /**
     * Whether a given delivery channel is enabled for this category. Returns
     * true when no explicit preference row exists (defaults on).
     */
    public function channelEnabled(string $channel): bool
    {
        return match ($channel) {
            'email' => (bool) $this->email_enabled,
            'push' => (bool) $this->push_enabled,
            'sms' => (bool) $this->sms_enabled,
            default => true,
        };
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
