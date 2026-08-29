<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_provider_management', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->nullable();
            $table->string('contact_person_name')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('website_link')->nullable();
            $table->double('price', 16, 2)->default(0);
            $table->longText('description')->nullable();
            $table->enum('status', ['available', 'not_available'])->default('available');
            $table->enum('payment_frequency', ['per_visit', 'per_hour', 'per_day', 'per_week', 'per_month', 'per_year'])->default('per_visit');
            $table->unsignedBigInteger('service_provider_settings_id');
            $table->foreign('service_provider_settings_id')
                ->references('id')
                ->on('service_provider_settings')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_provider_management');
    }
};