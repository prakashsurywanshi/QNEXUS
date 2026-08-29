<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->string('amenities_name');
            $table->enum('status', ['available', 'not_available'])->default('not_available');
            $table->boolean('booking_status')->default(0);
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->integer('slot_time')->nullable();
            $table->boolean('multiple_booking_status')->default(0);
            $table->integer('number_of_person')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amenities');
    }
};