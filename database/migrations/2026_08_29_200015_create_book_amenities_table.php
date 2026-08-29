<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('book_amenities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('amenity_id');
            $table->foreign(['amenity_id'])->references(['id'])->on('amenities')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->unsignedBigInteger('booked_by');
            $table->foreign(['booked_by'])->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->date('booking_date');
            $table->time('booking_time');
            $table->integer('persons')->nullable();
            $table->enum('booking_type', ['single', 'multiple'])->default('single');
            $table->string('unique_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_amenities');
    }
};