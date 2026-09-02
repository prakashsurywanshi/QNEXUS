<?php

namespace App\Support;

use App\Models\GlobalSetting;

/**
 * Serves the single global platform settings row. A lightweight static cache
 * avoids re-querying the settings table on every middleware/frontend call.
 * `forget()` lets long-running processes (e.g. tests with a refreshed DB)
 * invalidate the cached instance without affecting production performance.
 */
class GlobalSettingCache
{
    protected static ?GlobalSetting $settings = null;

    public static function get(): ?GlobalSetting
    {
        return static::$settings ??= GlobalSetting::first();
    }

    public static function forget(): void
    {
        static::$settings = null;
    }
}
