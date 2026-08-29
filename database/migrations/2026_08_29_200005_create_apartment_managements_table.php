<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('apartment_managements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->string('apartment_number');
            $table->integer('apartment_area');
            $table->string('apartment_area_unit');
            $table->foreignId('floor_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('tower_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('apartment_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->enum('status', ['not_sold', 'occupied', 'available_for_rent', 'rented'])->default('not_sold');
            $table->foreignId('parking_code_id')->nullable()->constrained('parking_managements')->onDelete('set null')->onUpdate('cascade');
            $table->boolean('is_defaulter')->default(false);
            $table->date('defaulter_since')->nullable();
            $table->json('blocked_amenities')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('apartment_managements');
    }
};