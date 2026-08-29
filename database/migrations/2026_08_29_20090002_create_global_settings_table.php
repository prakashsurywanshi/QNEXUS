<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('global_settings', function (Blueprint $table) {
            $table->id();
            $table->string('purchase_code', 80)->nullable();
            $table->timestamp('supported_until')->nullable();
            $table->timestamp('last_license_verified_at')->nullable()->default(null);
            $table->string('email')->nullable()->default(null);
            $table->string('name');
            $table->string('hash')->nullable();
            $table->unsignedBigInteger('default_currency_id')->nullable();
            $table->foreign('default_currency_id')->references('id')->on('global_currencies')->onDelete('cascade')->onUpdate('cascade');
            $table->string('logo')->nullable();
            $table->string('theme_hex')->nullable();
            $table->string('theme_rgb')->nullable();
            $table->string('locale')->default('en');
            $table->string('license_type')->nullable();
            $table->boolean('hide_cron_job')->default(0);
            $table->timestamp('last_cron_run')->nullable();
            $table->boolean('system_update')->default(1);
            $table->timestamp('purchased_on')->nullable();
            $table->string('timezone')->nullable()->default('Asia/Kolkata');
            $table->boolean('show_logo_text')->default(true);
            $table->boolean('disable_landing_site')->default(false);
            $table->enum('landing_site_type', ['theme', 'custom'])->default('theme');
            $table->string('landing_site_url')->nullable();
            $table->tinyText('installed_url')->nullable();
            $table->boolean('requires_approval_after_signup')->default(false);
            $table->string('facebook_link', 255)->nullable();
            $table->string('instagram_link', 255)->nullable();
            $table->string('twitter_link', 255)->nullable();
            $table->string('meta_keyword', 255)->nullable();
            $table->longText('meta_description')->nullable();
            $table->string('upload_fav_icon_android_chrome_192')->nullable();
            $table->string('upload_fav_icon_android_chrome_512')->nullable();
            $table->string('upload_fav_icon_apple_touch_icon')->nullable();
            $table->string('upload_favicon_16')->nullable();
            $table->string('upload_favicon_32')->nullable();
            $table->string('favicon')->nullable();
            $table->string('webmanifest')->nullable();
            $table->boolean('is_pwa_install_alert_show')->default(1);
            $table->string('vapid_public_key')->nullable();
            $table->string('vapid_private_key')->nullable();
            $table->string('vapid_subject')->default('mailto:admin@example.com');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('global_settings');
    }
};