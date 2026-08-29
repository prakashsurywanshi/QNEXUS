<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parking_managements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->string('parking_code');
            $table->enum('status', ['available', 'not_available'])->default('not_available');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parking_managements');
    }
};