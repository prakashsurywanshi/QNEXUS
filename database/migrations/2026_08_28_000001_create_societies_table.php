<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('societies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->nullable();
            $table->text('email')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('property_measurement')->nullable();
            $table->string('logo')->nullable();
            $table->string('fevicon')->nullable();
            $table->string('theme_rgb')->nullable();
            $table->string('theme_hex')->nullable();
            $table->string('timezone')->nullable();
            $table->text('address')->nullable();
            $table->string('key')->nullable();
            $table->enum('property_type', ['residential', 'commercial', 'mixed'])->default('residential');
            $table->boolean('is_active')->default(true);
            $table->longText('about_us')->nullable();
            $table->boolean('show_logo_text')->default(true);
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('society_id')->nullable()->after('id');

            $table->foreign('society_id')->references('id')->on('societies')
                ->onDelete('cascade')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['society_id']);
            $table->dropColumn(['society_id']);
        });

        Schema::dropIfExists('societies');
    }
};
