<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable()->index();
            $table->unsignedBigInteger('apartment_management_id')->nullable();
            $table->unsignedBigInteger('owner_user_id')->nullable();
            $table->string('vehicle_number');
            $table->string('vehicle_type')->default('four_wheeler');
            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->string('color')->nullable();
            $table->string('sticker_number')->nullable();
            $table->unsignedBigInteger('parking_management_id')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->foreign('apartment_management_id')->references('id')->on('apartment_managements')->onDelete('set null');
            $table->foreign('owner_user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('parking_management_id')->references('id')->on('parking_managements')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
