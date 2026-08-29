<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('credit_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->nullable()->constrained('societies')->nullOnDelete();
            $table->foreignId('apartment_id')->nullable()->constrained('apartment_managements')->nullOnDelete();
            $table->string('credit_number');
            $table->decimal('amount', 12, 2);
            $table->text('reason');
            $table->string('applied_to_invoice')->nullable();
            $table->enum('status', ['pending', 'applied', 'cancelled'])->default('pending');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_notes');
    }
};
