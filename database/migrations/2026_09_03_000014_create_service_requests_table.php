<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->nullable()->constrained('societies')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('service_type');
            $table->string('subject');
            $table->text('description')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['request', 'quoted', 'approved', 'assigned', 'in_progress', 'payment_pending', 'feedback', 'completed', 'cancelled'])->default('request');
            $table->decimal('quote_amount', 10, 2)->nullable();
            $table->text('quote_notes')->nullable();
            $table->date('quote_valid_until')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('service_provider_id')->nullable()->constrained('service_management')->nullOnDelete();
            $table->date('scheduled_date')->nullable();
            $table->text('completion_notes')->nullable();
            $table->decimal('payment_amount', 10, 2)->nullable();
            $table->enum('payment_status', ['unpaid', 'paid'])->nullable();
            $table->tinyInteger('rating')->unsigned()->nullable();
            $table->text('feedback')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['society_id', 'status']);
        });

        Schema::create('service_request_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_request_id')->constrained('service_requests')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('message');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_request_replies');
        Schema::dropIfExists('service_requests');
    }
};
