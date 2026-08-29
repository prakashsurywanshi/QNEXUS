<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_type', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->string('name')->nullable();
            $table->longText('icon')->nullable();
            $table->timestamps();
        });

        Schema::create('service_management', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('service_type_id');
            $table->foreign('service_type_id')->references('id')->on('service_type')->onUpdate('cascade')->onDelete('cascade');
            $table->string('company_name')->nullable();
            $table->string('contact_person_name')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('website_link')->nullable();
            $table->double('price', 16, 2)->default(0);
            $table->longText('description')->nullable();
            $table->enum('status', ['available', 'not_available'])->default('available');
            $table->enum('payment_frequency', ['per_visit', 'per_hour', 'per_day', 'per_week', 'per_month', 'per_year'])->default('per_visit');
            $table->boolean('daily_help')->default(0);
            $table->string('service_photo')->nullable();
            $table->timestamps();
        });

        Schema::create('service_management_apartment', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_management_id');
            $table->foreign('service_management_id')->references('id')->on('service_management')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('apartment_management_id');
            $table->foreign('apartment_management_id')->references('id')->on('apartment_managements')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });

        Schema::create('service_clock_in_out', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('service_management_id');
            $table->foreign('service_management_id')->references('id')->on('service_management')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('added_by');
            $table->foreign('added_by')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->date('clock_in_date')->nullable();
            $table->time('clock_in_time')->nullable();
            $table->date('clock_out_date')->nullable();
            $table->time('clock_out_time')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->enum('status', ['clock_in', 'clock_out'])->default('clock_in');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_type');
        Schema::dropIfExists('service_management');
        Schema::dropIfExists('service_management_apartment');
        Schema::dropIfExists('service_clock_in_out');
    }
};