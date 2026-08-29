<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amenity_society', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->constrained('societies')->cascadeOnDelete();
            $table->foreignId('amenities_id')->constrained('amenities')->cascadeOnDelete();
            $table->decimal('booking_amount', 10, 2)->default(0);
            $table->integer('max_guest_count')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['society_id', 'amenities_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amenity_society');
    }
};