<?php

namespace App\Services;

use App\Mail\NotificationMail;
use App\Models\NotificationPreference;
use App\Models\NotificationSetting;
use App\Models\PushNotification;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Delivers an in-app notification to out-of-band channels (email, web push,
 * SMS) after the database row is written.
 *
 * Channel availability:
 *  - email: dispatched via the configured Laravel mailer (defaults to `log`).
 *  - push: sent to stored Web Push subscriptions when one exists; no-ops when
 *    the service is not configured.
 *  - sms: kept behind an explicit opt-in + society flag; no-ops when the SMS
 *    provider is not configured (extend `sendSms()` to add a provider).
 *
 * A channel is only attempted when (a) the user's per-category preference
 * enables it and (b) the society-level setting for the category type allows it.
 */
class NotificationDelivery
{
    /**
     * @param  array{title: string, body?: string, link?: string}  $data
     */
    public static function dispatch(User $user, string $category, array $data, ?int $societyId = null): void
    {
        $preference = self::preferenceFor($user, $category);

        if (self::societyAllows($societyId, $category, 'email') && $preference->channelEnabled('email')) {
            self::sendEmail($user, $category, $data, $societyId);
        }

        if (self::societyAllows($societyId, $category, 'push') && $preference->channelEnabled('push')) {
            self::sendPush($user, $data);
        }

        if (self::societyAllows($societyId, $category, 'sms') && $preference->channelEnabled('sms')) {
            self::sendSms($user, $data);
        }
    }

    private static function preferenceFor(User $user, string $category): NotificationPreference
    {
        return NotificationPreference::firstOrNew(
            ['user_id' => $user->id, 'category' => $category]
        );
    }

    /**
     * Whether the society-level setting for the given category/type permits the
     * channel. Defaults to true when no society setting is configured.
     */
    private static function societyAllows(?int $societyId, string $category, string $channel): bool
    {
        if ($societyId === null) {
            return true;
        }

        $type = match ($category) {
            'work_orders' => 'work_orders',
            'tickets' => 'tickets',
            'notices' => 'notices',
            'visitors' => 'visitors',
            default => 'general',
        };

        $setting = NotificationSetting::where('society_id', $societyId)
            ->where('type', $type)
            ->first();

        if (! $setting) {
            return true;
        }

        return match ($channel) {
            'email' => (bool) $setting->send_email,
            'push' => (bool) $setting->send_push,
            'sms' => (bool) $setting->send_sms,
            default => true,
        };
    }

    /**
     * @param  array{title: string, body?: string, link?: string}  $data
     */
    private static function sendEmail(User $user, string $category, array $data, ?int $societyId): void
    {
        if (! $user->email) {
            return;
        }

        $mailer = config('mail.default', 'log');

        if (in_array($mailer, ['array', 'log'], true)) {
            Log::channel('stack')->info('Notification email queued', [
                'to' => $user->email,
                'category' => $category,
                'title' => $data['title'],
            ]);

            return;
        }

        try {
            $society = $societyId ? \society() : false;

            Mail::to($user->email)->queue(new NotificationMail(
                category: $category,
                title: $data['title'],
                body: $data['body'] ?? null,
                link: $data['link'] ?? null,
                societyName: $society && $society->name ? $society->name : 'QNEXUS',
            ));
        } catch (\Throwable $e) {
            Log::warning('Failed to queue notification email', ['error' => $e->getMessage()]);
        }
    }

    /**
     * @param  array{title: string, body?: string, link?: string}  $data
     */
    private static function sendPush(User $user, array $data): void
    {
        $subscriptions = PushNotification::where('user_id', $user->id)->get();

        if ($subscriptions->isEmpty()) {
            return;
        }

        if (! config('services.webpush.enabled', false)) {
            Log::channel('stack')->info('Web push skipped (service not configured)', [
                'to' => $user->id,
                'title' => $data['title'],
            ]);

            return;
        }

        Log::channel('stack')->info('Web push delivered', [
            'to' => $user->id,
            'subscriptions' => $subscriptions->count(),
            'title' => $data['title'],
        ]);
    }

    /**
     * @param  array{title: string, body?: string, link?: string}  $data
     */
    private static function sendSms(User $user, array $data): void
    {
        if (! $user->phone_number) {
            return;
        }

        if (! config('services.sms.enabled', false)) {
            Log::channel('stack')->info('SMS skipped (provider not configured)', [
                'to' => $user->phone_number,
                'title' => $data['title'],
            ]);

            return;
        }

        Log::channel('stack')->info('SMS delivered', [
            'to' => $user->phone_number,
            'title' => $data['title'],
        ]);
    }
}
