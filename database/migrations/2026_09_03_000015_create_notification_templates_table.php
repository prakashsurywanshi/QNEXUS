<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('category')->index();
            $table->string('title');
            $table->text('body')->nullable();
            $table->timestamps();
        });

        Schema::table('notification_preferences', function (Blueprint $table) {
            $table->boolean('email_enabled')->default(true)->after('snooze_until');
            $table->boolean('push_enabled')->default(true)->after('email_enabled');
            $table->boolean('sms_enabled')->default(false)->after('push_enabled');
        });
    }

    public function down(): void
    {
        Schema::table('notification_preferences', function (Blueprint $table) {
            $table->dropColumn(['email_enabled', 'push_enabled', 'sms_enabled']);
        });

        Schema::dropIfExists('notification_templates');
    }
};
