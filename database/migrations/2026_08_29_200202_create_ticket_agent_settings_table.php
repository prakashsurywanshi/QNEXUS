<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ticket_agent_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_agent_id')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('ticket_type_id')->constrained('ticket_type_settings')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_agent_settings');
    }
};