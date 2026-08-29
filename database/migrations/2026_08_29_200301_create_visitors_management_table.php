<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitors_management', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->string('visitor_name');
            $table->string('visitor_photo')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('address')->nullable();
            $table->foreignId('apartment_id')->constrained('apartment_managements')->onDelete('cascade')->onUpdate('cascade');
            $table->date('date_of_visit')->nullable();
            $table->date('date_of_exit')->nullable();
            $table->time('in_time')->nullable();
            $table->time('out_time')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('added_by')->nullable();
            $table->foreign(['added_by'])->references(['id'])->on('users')->onUpdate('cascade')->onDelete('SET NULL');
            $table->enum('status', ['pending', 'allowed', 'not_allowed'])->default('pending');
            $table->timestamps();
            $table->string('purpose_of_visit')->nullable();
            $table->foreignId('visitor_type_id')->nullable()->constrained('visitor_settings')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitors_management');
    }
};