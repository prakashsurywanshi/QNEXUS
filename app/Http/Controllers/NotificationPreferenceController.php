<?php

namespace App\Http\Controllers;

use App\Models\NotificationPreference;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class NotificationPreferenceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $prefs = $user->notificationPreferences()->get()->keyBy('category');

        return response()->json([
            'categories' => collect(NotificationPreference::categories())
                ->map(function (string $label, string $category) use ($prefs) {
                    $pref = $prefs[$category] ?? null;

                    return [
                        'category' => $category,
                        'label' => $label,
                        'muted' => $pref->muted ?? false,
                        'snooze_until' => $pref?->snooze_until?->toISOString() ?? null,
                        'suppressed' => $pref?->isSuppressed() ?? false,
                        'email_enabled' => $pref ? (bool) $pref->email_enabled : true,
                        'push_enabled' => $pref ? (bool) $pref->push_enabled : true,
                        'sms_enabled' => $pref ? (bool) $pref->sms_enabled : false,
                    ];
                })
                ->values(),
        ]);
    }

    public function update(Request $request, string $category): JsonResponse
    {
        if (! array_key_exists($category, NotificationPreference::categories())) {
            throw ValidationException::withMessages([
                'category' => ['Unknown notification category.'],
            ]);
        }

        $data = $request->validate([
            'muted' => ['sometimes', 'boolean'],
            'snooze' => ['sometimes', Rule::in(['none', '1h', '24h', '1w', 'forever'])],
            'email_enabled' => ['sometimes', 'boolean'],
            'push_enabled' => ['sometimes', 'boolean'],
            'sms_enabled' => ['sometimes', 'boolean'],
        ]);

        $pref = $request->user()->notificationPreferences()->firstOrNew(['category' => $category]);

        if (array_key_exists('muted', $data)) {
            $muted = filter_var($data['muted'], FILTER_VALIDATE_BOOLEAN);
            $pref->muted = $muted;
            if ($muted) {
                $pref->snooze_until = null;
            }
        }

        if (array_key_exists('snooze', $data)) {
            $snooze = $data['snooze'];
            $pref->snooze_until = $snooze === 'none' ? null : $this->snoozeDate($snooze);
            $pref->muted = false;
        }

        foreach (['email_enabled', 'push_enabled', 'sms_enabled'] as $field) {
            if (array_key_exists($field, $data)) {
                $pref->{$field} = filter_var($data[$field], FILTER_VALIDATE_BOOLEAN);
            }
        }

        $pref->save();

        return response()->json([
            'category' => $category,
            'muted' => (bool) $pref->muted,
            'snooze_until' => $pref->snooze_until?->toISOString() ?? null,
            'suppressed' => $pref->isSuppressed(),
            'email_enabled' => (bool) $pref->email_enabled,
            'push_enabled' => (bool) $pref->push_enabled,
            'sms_enabled' => (bool) $pref->sms_enabled,
        ]);
    }

    private function snoozeDate(string $snooze): Carbon
    {
        return match ($snooze) {
            '1h' => Carbon::now()->addHours(1),
            '24h' => Carbon::now()->addDay(),
            '1w' => Carbon::now()->addWeek(),
            default => Carbon::now()->addYears(100),
        };
    }
}
