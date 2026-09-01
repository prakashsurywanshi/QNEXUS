<?php

namespace Database\Seeders;

use App\Models\GlobalSetting;
use Illuminate\Database\Seeder;

class GlobalSettingsSeeder extends Seeder
{
    /**
     * Provision the singleton platform settings row (branding, SEO, landing
     * site toggle + type, social links, locale/timezone).
     */
    public function run(): void
    {
        if (GlobalSetting::exists()) {
            return;
        }

        GlobalSetting::create([
            'name' => 'QNEXUS',
            'email' => 'hello@qnexus.app',
            'locale' => 'en',
            'timezone' => 'Asia/Kolkata',
            'show_logo_text' => true,
            'disable_landing_site' => false,
            'landing_site_type' => 'theme',
            'landing_site_url' => null,
            'facebook_link' => 'https://facebook.com/qodeigence',
            'instagram_link' => 'https://instagram.com/qodeigence',
            'twitter_link' => 'https://x.com/qodeigence',
            'meta_keyword' => 'society management, community management, commercial property management, facility management, smart property',
            'meta_description' => 'QNEXUS is an intelligent, role-based Community & Commercial Management Platform that connects residents, tenants, management, security, facilities and vendors through one unified ecosystem.',
            'requires_approval_after_signup' => false,
        ]);
    }
}
