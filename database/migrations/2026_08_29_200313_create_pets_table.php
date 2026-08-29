<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->nullable()->constrained('societies')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('apartment_id')->nullable()->constrained('apartment_managements');
            $table->string('name');
            $table->string('species');
            $table->string('breed')->nullable();
            $table->string('color')->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->string('photo')->nullable();
            $table->enum('vaccination_status', ['up_to_date', 'overdue', 'unknown'])->default('unknown');
            $table->date('last_vaccination_date')->nullable();
            $table->date('next_vaccination_date')->nullable();
            $table->boolean('is_neutered')->default(false);
            $table->string('microchip_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};